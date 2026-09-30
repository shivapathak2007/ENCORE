const DocumentModel = require('../models/documentModel');
const ChunkModel = require('../models/chunkModel');
const supabase = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const { parseDocument } = require('../services/documentParserService');
const { chunkText } = require('../services/chunkingService');

const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const userId = req.user.id;
    const file = req.file;
    const originalName = file.originalname;
    const fileExtension = originalName.split('.').pop();
    const storageFilename = `${userId}/${uuidv4()}.${fileExtension}`;
    const bucketName = process.env.SUPABASE_STORAGE_BUCKET || 'documents';

    // Upload to Supabase Storage
    const { data: storageData, error: storageError } = await supabase
      .storage
      .from(bucketName)
      .upload(storageFilename, file.buffer, {
        contentType: file.mimetype,
        upsert: false
      });

    if (storageError) {
      console.error('Storage Upload Error:', storageError);
      
      // Auto-attempt to create the bucket just in case
      if (storageError.message && storageError.message.toLowerCase().includes('bucket')) {
         await supabase.storage.createBucket(bucketName, { public: false });
         
         // Retry upload once
         const retry = await supabase.storage.from(bucketName).upload(storageFilename, file.buffer, {
           contentType: file.mimetype,
           upsert: false
         });
         
         if (retry.error) {
           return res.status(500).json({ success: false, message: `Failed to upload to storage: ${retry.error.message}` });
         }
      } else {
        return res.status(500).json({ success: false, message: `Storage Error: ${storageError.message}` });
      }
    }

    // Save metadata in database
    const newDoc = await DocumentModel.create({
      user_id: userId,
      title: originalName.split('.')[0],
      original_filename: originalName,
      file_type: file.mimetype,
      file_size: file.size,
      storage_path: storageFilename,
      status: 'Uploaded'
    });

    res.status(201).json({
      success: true,
      message: 'Document uploaded successfully',
      data: { document: newDoc }
    });
  } catch (error) {
    next(error);
  }
};

const getDocuments = async (req, res, next) => {
  try {
    const documents = await DocumentModel.findByUser(req.user.id);
    res.status(200).json({
      success: true,
      data: { documents }
    });
  } catch (error) {
    next(error);
  }
};

const getDocument = async (req, res, next) => {
  try {
    const document = await DocumentModel.findByIdAndUser(req.params.id, req.user.id);
    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }
    res.status(200).json({
      success: true,
      data: { document }
    });
  } catch (error) {
    next(error);
  }
};

const deleteDocument = async (req, res, next) => {
  try {
    const document = await DocumentModel.findByIdAndUser(req.params.id, req.user.id);
    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    // Delete from Supabase Storage
    const bucketName = process.env.SUPABASE_STORAGE_BUCKET || 'documents';
    await supabase.storage.from(bucketName).remove([document.storage_path]);

    // Delete from Database
    await DocumentModel.delete(req.params.id, req.user.id);

    res.status(200).json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

const processDocument = async (req, res, next) => {
  try {
    const documentId = req.params.id;
    const userId = req.user.id;

    // 1. Fetch document metadata
    const document = await DocumentModel.findByIdAndUser(documentId, userId);
    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    if (document.status === 'Processing') {
      return res.status(400).json({ success: false, message: 'Document is already being processed' });
    }

    // Update status to processing
    await DocumentModel.updateStatus(documentId, 'Processing');

    // Return early to the user, processing happens asynchronously
    res.status(202).json({
      success: true,
      message: 'Document processing started'
    });

    // --- ASYNC BACKGROUND PROCESSING ---
    (async () => {
      try {
        const bucketName = process.env.SUPABASE_STORAGE_BUCKET || 'documents';
        
        // 2. Download from Supabase Storage
        const { data: fileData, error: downloadError } = await supabase.storage
          .from(bucketName)
          .download(document.storage_path);

        if (downloadError) throw new Error(`Download failed: ${downloadError.message}`);

        const buffer = Buffer.from(await fileData.arrayBuffer());

        // 3. Extract text
        const parsedData = await parseDocument(buffer, document.file_type);

        if (!parsedData.text || parsedData.text.trim().length === 0) {
          console.warn('No text extracted, inserting fallback text.');
          parsedData.text = "No readable text could be extracted from this document. It might be an image-based PDF or an unsupported format.";
        }

        // 4. Chunk text
        const chunks = chunkText(parsedData.text);

        // 5. Save chunks to DB
        const chunkRecords = chunks.map((chunk, index) => ({
          document_id: documentId,
          user_id: userId,
          chunk_index: index,
          content: chunk
        }));

        await ChunkModel.createMultiple(chunkRecords);

        // 6. Mark as completed
        await DocumentModel.updateStatus(documentId, 'Completed');

      } catch (processError) {
        console.error('Document Processing Error:', processError);
        await DocumentModel.updateStatus(documentId, 'Failed');
      }
    })();

  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadDocument,
  getDocuments,
  getDocument,
  deleteDocument,
  processDocument
};

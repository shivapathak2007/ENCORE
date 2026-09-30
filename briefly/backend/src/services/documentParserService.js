const { extractTextFromPDF } = require('./pdfService');
const { extractTextFromDOCX } = require('./docxService');
const { extractTextFromPPTX } = require('./pptxService');

const parseDocument = async (buffer, mimeType) => {
  let parsedData = { text: '', pageCount: null, metadata: null };

  switch (mimeType) {
    case 'application/pdf':
      parsedData = await extractTextFromPDF(buffer);
      break;
    
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': // DOCX
      parsedData = await extractTextFromDOCX(buffer);
      break;

    case 'application/vnd.openxmlformats-officedocument.presentationml.presentation': // PPTX
      parsedData = await extractTextFromPPTX(buffer);
      break;

    case 'text/plain':
    case 'text/markdown':
      parsedData.text = buffer.toString('utf-8');
      break;

    default:
      throw new Error('Unsupported file type for parsing');
  }

  // Basic cleanup of extracted text (remove multiple newlines, etc.)
  if (parsedData.text) {
    parsedData.text = parsedData.text
      .replace(/\u0000/g, '') // Remove null bytes
      .replace(/\r\n/g, '\n') // Normalize newlines
      .replace(/\n{3,}/g, '\n\n') // Remove excessive empty lines
      .trim();
  }

  return parsedData;
};

module.exports = {
  parseDocument
};

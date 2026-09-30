const { extractTextFromPDF } = require('./pdfService');
const { extractTextFromDOCX } = require('./docxService');
const { extractTextFromPPTX } = require('./pptxService');

const parseDocument = async (buffer, mimeType) => {
  let parsedData = { text: '', pageCount: null, metadata: null };

  let typeToUse = mimeType;
  
  // Fallback for vague mimetypes if needed, though we should rely on extension if possible
  if (typeToUse === 'application/octet-stream') {
    // We would need the filename to do this properly, but for now let's just try PDF as a guess
    // or just let it fail. 
  }

  if (typeToUse.includes('pdf')) {
    parsedData = await extractTextFromPDF(buffer);
  } else if (typeToUse.includes('wordprocessingml') || typeToUse.includes('msword')) {
    parsedData = await extractTextFromDOCX(buffer);
  } else if (typeToUse.includes('presentationml') || typeToUse.includes('ms-powerpoint')) {
    parsedData = await extractTextFromPPTX(buffer);
  } else if (typeToUse.includes('text/') || typeToUse.includes('markdown')) {
    parsedData.text = buffer.toString('utf-8');
  } else {
    // Ultimate fallback: try to extract it as text anyway. If it's binary, it will be garbage, but it won't crash instantly.
    try {
      parsedData = await extractTextFromPDF(buffer);
    } catch (e) {
      try {
        parsedData = await extractTextFromDOCX(buffer);
      } catch (e2) {
        parsedData.text = buffer.toString('utf-8');
      }
    }
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

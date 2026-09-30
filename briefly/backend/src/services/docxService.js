const mammoth = require('mammoth');

const extractTextFromDOCX = async (buffer) => {
  try {
    const result = await mammoth.extractRawText({ buffer: buffer });
    return {
      text: result.value,
      pageCount: null, // DOCX doesn't have a fixed page count in raw format
      metadata: null
    };
  } catch (error) {
    console.error('DOCX parsing error:', error);
    throw new Error('Failed to parse DOCX document');
  }
};

module.exports = {
  extractTextFromDOCX
};

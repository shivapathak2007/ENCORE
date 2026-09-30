const officeParser = require('officeparser');

const extractTextFromPPTX = async (buffer) => {
  try {
    const text = await officeParser.parseOfficeAsync(buffer);
    return {
      text: text,
      pageCount: null,
      metadata: null
    };
  } catch (error) {
    console.error('PPTX parsing error:', error);
    throw new Error('Failed to parse PPTX document');
  }
};

module.exports = {
  extractTextFromPPTX
};

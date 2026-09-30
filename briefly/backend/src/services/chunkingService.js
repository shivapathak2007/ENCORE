const chunkText = (text, maxChunkSize = 2000, overlap = 200) => {
  if (!text) return [];
  
  const chunks = [];
  let startIndex = 0;

  while (startIndex < text.length) {
    let endIndex = startIndex + maxChunkSize;
    
    // If we're not at the end of the text, try to find a natural break point
    if (endIndex < text.length) {
      // Look for a newline or period within the last 100 characters of the chunk
      const searchArea = text.substring(endIndex - 100, endIndex);
      const naturalBreak = Math.max(
        searchArea.lastIndexOf('\n\n'),
        searchArea.lastIndexOf('\n'),
        searchArea.lastIndexOf('. ')
      );

      if (naturalBreak !== -1) {
        endIndex = (endIndex - 100) + naturalBreak + 1; // +1 to include the period/newline
      }
    }

    chunks.push(text.substring(startIndex, endIndex).trim());
    
    // Move start index for next chunk, factoring in overlap
    startIndex = endIndex - overlap;
    
    // Safety check to prevent infinite loops if overlap is somehow larger than progress
    if (startIndex <= chunks[chunks.length - 1].length - maxChunkSize) {
      startIndex = endIndex;
    }
  }

  return chunks;
};

module.exports = {
  chunkText
};

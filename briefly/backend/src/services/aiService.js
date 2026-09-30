const { GoogleGenerativeAI } = require('@google/generative-ai');

class AIService {
  constructor() {
    this.provider = process.env.AI_PROVIDER || 'gemini';
    
    if (this.provider === 'gemini') {
      const apiKey = process.env.AI_API_KEY;
      if (!apiKey) {
        console.warn('⚠️ AI_API_KEY is not set. AI features will fail.');
      }
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.modelStr = process.env.AI_MODEL || 'gemini-3.8-flash';
    }
  }

  async _generateJsonOutput(prompt) {
    if (this.provider === 'gemini') {
      const model = this.genAI.getGenerativeModel({ 
        model: this.modelStr,
        generationConfig: { responseMimeType: "application/json" }
      });
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      return JSON.parse(text);
    }
    throw new Error('Unsupported AI provider');
  }

  async _generateTextOutput(prompt) {
    if (this.provider === 'gemini') {
      const model = this.genAI.getGenerativeModel({ model: this.modelStr });
      const result = await model.generateContent(prompt);
      return result.response.text();
    }
    throw new Error('Unsupported AI provider');
  }

  async generateSummary(text, type = 'standard') {
    const lengthMap = {
      quick: '100-200 words',
      standard: '300-500 words',
      detailed: '700-1200 words'
    };

    const prompt = `
      You are an expert knowledge summarizer. Summarize the following text.
      Target length: ${lengthMap[type] || '300-500 words'}.
      Format the output as JSON with the following keys:
      - tldr: A one sentence summary.
      - key_takeaways: Array of 5-10 bullet points.
      - core_concepts: Array of strings.
      - conclusion: A brief conclusion.
      
      Text to summarize:
      ${text}
    `;

    return this._generateJsonOutput(prompt);
  }

  async generateMindMap(text) {
    const prompt = `
      Create a hierarchical mind map based on the following text.
      Identify the main topic as the center node, major topics as branches, and subtopics/concepts as leaves.
      Return valid JSON in this exact structure:
      {
        "title": "Main Topic",
        "nodes": [ { "id": "1", "label": "Node Label" } ],
        "edges": [ { "source": "1", "target": "2", "label": "Optional Relationship" } ]
      }
      
      Text:
      ${text}
    `;

    return this._generateJsonOutput(prompt);
  }

  async extractConcepts(text) {
    const prompt = `
      Extract key concepts, definitions, and relationships from the text.
      Return valid JSON with an array of "concepts", each having:
      "concept_name", "definition", and an array of "related_concepts".
      
      Text:
      ${text}
    `;

    return this._generateJsonOutput(prompt);
  }

  async generateFlashcards(text, count = 10) {
    const prompt = `
      Create ${count} flashcards for studying the following text.
      Return valid JSON with an array of "flashcards", each having:
      "front" (question), "back" (answer/explanation).
      
      Text:
      ${text}
    `;

    return this._generateJsonOutput(prompt);
  }

  async generateQuiz(text, count = 5) {
    const prompt = `
      Create a ${count}-question multiple choice quiz based on the following text.
      Return valid JSON with a "title", "total_questions" and an array of "questions", each having:
      "question", "options" (array of 4 strings), "correct_answer" (string matching one option exactly), "explanation" (why it is correct).
      
      Text:
      ${text}
    `;

    return this._generateJsonOutput(prompt);
  }

  async answerQuestion(text, question) {
    const prompt = `
      Based ONLY on the provided text, answer the following question. 
      If the text does not contain the answer, explicitly say: "I couldn't find enough information in this document to answer that confidently."
      Provide specific source references/quotes from the text if possible.
      
      Question: ${question}
      
      Text:
      ${text}
    `;

    return this._generateTextOutput(prompt);
  }
}

module.exports = new AIService();

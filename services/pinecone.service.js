import { Pinecone } from "@pinecone-database/pinecone";
import { configDotenv } from "dotenv";

configDotenv();

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

const chatgptIndex = pc.Index("chatgpt");


export async function createMemory({ vectors, messageId, metadata }) {
  try {
    await chatgptIndex.upsert([{
      id: messageId,
      values: vectors,
      metadata,
    }]);
  } catch (error) {
    console.error("Error creating memory:", error);
  }
}

export async function queryMemory({ queryVector, limit = 5, metadata }) {
  try {
    const data = await chatgptIndex.query({
      vector: queryVector,
      topK: limit,
      filter: metadata,
      includeMetadata: true,
    });
    return data.matches;
  } catch (error) {
    console.error("Error querying memory:", error);
  }
}

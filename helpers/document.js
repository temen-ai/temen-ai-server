import supabase from "../config/supabase";
import cheerio from "cheerio";
import axios from "axios";
import url from "url";
import { v4 as uuidv4 } from 'uuid';


import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY,
});

async function getTextChunksEmbeddings(chunks) {
  const vectors = await embeddings.embedDocuments(chunks);
  return vectors;
}

async function processTextContent(text, character_id) {
  try {
    // Define the text splitter with the desired chunk size and overlap
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1024,
      chunkOverlap: 256,
    });

    // Use the text splitter to split the document's text into chunks
    const chunks = await textSplitter.splitText(text);

    // Clean up chunks by replacing newline characters with spaces
    const cleanedChunks = chunks.map((chunk) => chunk.replace(/\n/g, " "));

    // Get vectors for each cleaned chunk
    const vectors = await getTextChunksEmbeddings(cleanedChunks);

    // Combine the chunks and their vectors into an array of objects
    const chunksWithVectors = cleanedChunks.map((chunk, index) => ({
      metadata: { character_id },
      content: chunk,
      vectors: vectors[index],
      characters: chunk.length,
      totalCharacters: text.length,
    }));

    return chunksWithVectors;
  } catch (error) {
    throw new HttpError(400, "Error processing text content");
  }
}


async function insertAndEnhanceDocumentData(
  content,
  type,
  ai_agent_id,
  url,
  functionProcessFileContent,
  id,
  question,
  answer,
) {
  const { data, error } = await supabase
    .from("documents")
    .upsert({
      id,
      content,
      type,
      ai_agent_id,
      url,
      updated_at: new Date().toISOString(),
      question,
      answer,
    })
    .select()
    .single();
  if (error) throw new HttpError(400, error.message);

  const infoFile = await functionProcessFileContent(content, url, ai_agent_id);

  const transformedData = infoFile.map((obj) => ({
    document_id: id,
    metadata: obj.metadata,
    content: obj.content,
    vectors: obj.vectors,
  }));

  return transformedData;
}


// Process Text Documents
async function processTextDocuments(text, ai_agent_id, doc_id) {
  if (!text) return [];
  const transformedTextData = await processContent(
    text,
    "text",
    ai_agent_id,
    null,
    doc_id,
  );
  return [transformedTextData];
}

async function processContent(
    content,
    type,
    ai_agent_id,
    url,
    doc_id,
    question,
    answer,
  ) {
    return insertAndEnhanceDocumentData(
      content,
      type,
      ai_agent_id,
      url,
      processTextContent,
      doc_id,
      question,
      answer,
    );
  }



async function fetchDocumentData(docType, ai_agent_id) {
  return await supabase
    .from("documents")
    .select()
    .eq("ai_agent_id", ai_agent_id)
    .eq("type", docType);
}

async function deleteEmbeddings(ids) {
  await supabase.from("embeddings").delete().in("document_id", ids);
}



export {
  processTextContent,
  insertAndEnhanceDocumentData,
  processTextDocuments,
  fetchDocumentData,
  deleteEmbeddings,

};

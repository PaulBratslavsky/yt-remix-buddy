import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { CharacterTextSplitter } from "langchain/text_splitter";
import { fetchTranscript } from "~/lib/youtube-transcript";

const openAIApiKey = process.env.OPEN_AI_API_KEY;

export async function chat(videoId: string, query: string) {
  
  const embeddingsConfig = {
    openAIApiKey: openAIApiKey,
    model: "text-embedding-ada-002",
    maxTokens: 8000,
  };

  const chatConfig = {
    modelName: "gpt-3.5-turbo-16k",
    temperature: 0.9,
    openAIApiKey: openAIApiKey,
  };

  const embeddings = new OpenAIEmbeddings(embeddingsConfig);
  const llm = new ChatOpenAI(chatConfig);

  const transcript = await fetchTranscript(videoId);
  const transformed = transformData(transcript);
  const processed = await splitText(transformed.text, videoId);

  const vectorStore = await MemoryVectorStore.fromDocuments(
    processed,
    embeddings
  );

  const response = await chatWithData(
    query,
    llm,
    vectorStore
  );

  return response;
}


function transformData(data: any) {
  let text = "";

  data.forEach((item: any) => {
    text += item.text + " ";
  });

  return {
    data: data,
    text: text.trim(),
  };
}


async function splitText(text: any, videoId: any) {
  const splitter = new CharacterTextSplitter({
    separator: " ",
    chunkSize: 4000,
    chunkOverlap: 200,
  });

  const texts = [text];
  const metadata = {
    documentId: videoId,
  };

  const documents = await splitter.createDocuments(texts, [], {
    chunkHeader: `VIDEO ID: ${videoId}\n\n---\n\n`,
    appendChunkOverlapHeader: true,
  });

  const withMeta = documents.map((document, index) => {
    return {
      ...document,
      metadata: { ...metadata, documentCount: index },
    };
  });

  return withMeta;
}

async function chatWithData(query: string, model: any, vectorStore: any) {
  try {
    let chain = ConversationalRetrievalQAChain.fromLLM(
      model,
      vectorStore.asRetriever(),
      // { returnSourceDocuments: true }
    );

    const response = await chain.call({ question: query, chat_history: [] });
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
  }
}

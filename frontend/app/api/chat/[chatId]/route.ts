// app/api/chat/[chatId]/route.ts
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { QdrantVectorStore } from '@langchain/qdrant';
import { auth } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

export async function GET(
  request: NextRequest,
  { params }: { params: { chatId: string } }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });
    
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const chatId = params.chatId;
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query');
    const id = searchParams.get('id');
    
    if (!query) {
      return NextResponse.json(
        { statusCode: 400, message: 'query is required', data: null },
        { status: 400 }
      );
    }

    const pastMessages = await prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: "asc" },
    });

    const chatSession = await ai.chats.create({
      model: "gemini-2.0-flash",
      history: pastMessages.map((msg) => ({
        role: msg.role,
        parts: [{ text: msg.content }],
      })),
    });

    // Add the current user message to the database
    await prisma.message.create({
      data: {
        chatId,
        role: "user",
        content: query,
      },
    });

    // Get vector embeddings for the query
    const embeddings = new GoogleGenerativeAIEmbeddings({
      model: "text-embedding-004",
      apiKey: process.env.GOOGLE_API_KEY
    });
    
    const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
      url: process.env.QDRANT_URL || 'http://localhost:6333',
      collectionName: `user-${id}`,
    });

    const response = vectorStore.asRetriever({
      k: 2,
    });

    const result = await response.invoke(query);
    
    const system_prompt = `you are helpful ai assistant who answers the user query based on the available context from pdf file and the chat history of the user that u have based on the conversation
    Context:
    ${JSON.stringify(result)}`;

    const stream = await chatSession.sendMessageStream({
      message: query,
      config: {
        systemInstruction: system_prompt
      }
    });

    let modelResponse = "";
    for await (const chunk of stream) {
      modelResponse += chunk.text;
    }

    // Save model response
    await prisma.message.create({
      data: {
        chatId,
        role: "model",
        content: modelResponse,
      },
    });

    return NextResponse.json({
      statusCode: 200,
      data: { res: modelResponse, docs: result },
      message: 'success'
    });
  } catch (error) {
    console.error('Error in chat/[chatId]:', error);
    return NextResponse.json(
      { statusCode: 500, message: 'Internal server error', data: null },
      { status: 500 }
    );
  }
}
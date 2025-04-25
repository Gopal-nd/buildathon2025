// import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import fs from "fs/promises";
import axios from "axios";
import path from "path";
import os from "os";
import { QdrantVectorStore } from "@langchain/qdrant";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";


export async function POST(req: NextRequest) {
  try {

    const body = await req.json();
    const { fileURL, filename } = body;

     
  let tempFilePath: string | null = null;

  const session = await auth.api.getSession({
    headers: await headers() // you need to pass the headers object.
})
const userId = session?.user.id
if (!session || !session.user) {
  return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
}
if (!fileURL || !userId) {
return NextResponse.json({ error: 'Missing fileURL or userId' }, { status: 400 });
}
  try {

    // Step 1: Download to temp file
    const tempDir = os.tmpdir();
    tempFilePath = path.join(tempDir, `${Date.now()}-${filename}`);
    const response = await axios.get(fileURL, { responseType: "arraybuffer" });

    await fs.writeFile(tempFilePath, response.data);
    console.log(" File downloaded to:", tempFilePath);

    // Step 2: Load and embed
    const loader = new PDFLoader(tempFilePath);
    const docs = await loader.load();
    console.log(" Loaded documents:", docs.length);

    const embeddings = new GoogleGenerativeAIEmbeddings({
      model: "text-embedding-004",
      apiKey: process.env.GOOGLE_API_KEY!,
    });
    console.log(" Embeddings initialized");
    const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
      url: "http://localhost:6333",
      collectionName: `user-${userId}`,
    });

    const result = await vectorStore.addDocuments(docs);
    console.log(" Documents added to Qdrant",result);
  } catch (err) {
    console.error(" Error during processing:", err);
  } finally {
    // Step 3: Cleanup
    if (tempFilePath) {
      try {
        await fs.unlink(tempFilePath);
        console.log(" Temp file cleaned:", tempFilePath);
      } catch (cleanupErr) {
        console.error(" Failed to clean temp file:", cleanupErr);
      }
    }
  }

   

    const dataSet = await prisma.dataSet.create({
      data: {
        fileURL,
        filename: filename || 'Untitled',
        userId,
      },
    });

    return NextResponse.json({ message: 'Document uploaded successfully', data: dataSet.fileURL });
  } catch (error) {
    console.error('[UPLOAD_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

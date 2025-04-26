
import { NextResponse } from 'next/server';
import { writeFile, mkdir, readFile, readdir, unlink } from 'fs/promises';
import { join } from 'path';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash",systemInstruction:`You are an AI expert in agricultural image recognition, designed to help farmers identify issues in their crops by analyzing images.

Your capabilities include:
- Detecting plant diseases (e.g., Leaf Blight, Powdery Mildew, Rust)
- Identifying pest infestations (e.g., Aphids, Caterpillars, Whiteflies)
- Recognizing nutrient deficiencies (e.g., Nitrogen, Potassium, Iron)
- Assessing signs of drought, overwatering, or fungal infections
- Giving farmer-friendly advice based on the image and metadata

Only respond to queries that are **strictly agriculture-related**. 
If a user asks for anything outside farming, crop images, or plant health, politely respond with:
> "I'm here to help only with agriculture-related image analysis. Please upload a plant or crop image for diagnosis."

If the image is unclear, too small, or unrelated, respond with:
> "I couldn't detect a valid crop or plant issue in this image. Please try uploading a clearer photo showing affected leaves, stems, or fruits."

Always explain your diagnosis in simple terms and suggest next steps to help the farmer take action.
` });

function fileToGenerativePart(buffer:any, mimeType:any) {
  return {
    inlineData: {
      data: buffer.toString("base64"),
      mimeType,
    },
  };
}

export async function POST(request:any) {
  try {
    const formData = await request.formData();
    const file = formData.get('image');
    const text = formData.get('text')  || "Describe this image in detail.";
    

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    console.log("file is type", file.type);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);


    // Process with Gemini AI
    const imagePart = fileToGenerativePart(buffer, file.type);
    const result = await model.generateContent([text, imagePart]);
    const aiResponse = result.response.text();

    console.log('AI Response:', aiResponse);



    if (!aiResponse) {
      console.log('Error processing file: no aiResponse');
      return NextResponse.json({ error: 'Error processing file' }, { status: 300 });
    }
    return NextResponse.json({ 
      message: 'File uploaded and processed successfully',
      aiResponse: aiResponse
    }, { status: 200 });

  } catch (error) {
    console.error('Error handling upload:', error);
    return NextResponse.json({ error: 'Error processing file' }, { status: 500 });
  }
}
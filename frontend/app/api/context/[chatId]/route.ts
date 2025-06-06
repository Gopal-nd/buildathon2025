// app/api/chat/[chatId]/route.ts
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { QdrantVectorStore } from '@langchain/qdrant';
import { auth } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { GoogleGenAI } from "@google/genai";
import axios from 'axios';

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
type Params = Promise<{ chatId: string }>
 
 
export async function GET(
  request: NextRequest,
  segmentData: { params: Params }
) {
  const params = segmentData.params
  const chatId = (await params).chatId
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });
    
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query');
    const id = searchParams.get('id');
    
    if (!query) {
      return NextResponse.json(
        { statusCode: 400, message: 'query is required', data: null },
        { status: 400 }
      );
    }

    const pastMessages = await prisma.contextMessage.findMany({
      where: { chatId },
      orderBy: { createdAt: "asc" },
    });

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id
      }
    })

     // Weather data fetch with proper error handling
    // let weatherData = null;
    // try {
    //   if (user?.latitude && user?.longitude) {
    //     const weatherResponse = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
    //       params: {
    //         lat: user.latitude,
    //         lon: user.longitude,
    //         appid: process.env.OPEN_WEATHER_API_KEY,
    //         units: 'metric',
    //       },
    //     });
    //     weatherData = weatherResponse.data;
    //   }
    // } catch (weatherError) {
    //   console.error("Weather API error:", weatherError);
    //   // Continue execution even if weather fetch fails
    // }
    const system_prompt = `You are an AI Agricultural Weather Advisor for farmers. 
    Your goal is to provide clear, accurate, and actionable farming advice based on localized weather data.
    
    You will receive:
    1. Current and forecasted weather data (temperature, rainfall, humidity, wind, etc.)
    2. Historical weather patterns
    3. Crop type and growth stage
    4. Location (latitude and longitude)
    5.user farm details
    
    user details:
    Name: ${user?.name}
    Location: ${user?.location}
    Crop Type: ${user?.cropType}
    Farm Size: ${user?.farmSize}
    Current Crop: ${user?.currentCrop}
    cropts intrested to grow: ${user?.cropType}
    water related resourse or availability : ${user?.waterResourse}


    Your task is to:
    - Analyze this data to give timely and localized agricultural guidance
    - Recommend whether to sow, irrigate, fertilize, harvest, or apply pesticides
    - Warn about risks like heavy rainfall, high winds, or temperature drops
    - Tailor advice based on the specific crop and region
    
    Always explain your reasoning in simple terms, and highlight any urgent warnings.
    `
    

    const chatSession = await ai.chats.create({
      model: "gemini-2.0-flash",
      history: pastMessages.map((msg) => ({
        role: msg.role,
        parts: [{ text: msg.content }],
      })),
      config: {
        systemInstruction:system_prompt
      }
    });

    // Add the current user message to the database
    await prisma.contextMessage.create({
      data: {
        chatId,
        role: "user",
        content: query,
      },
    });



    const stream = await chatSession.sendMessageStream({
      message: query,

    });

    let modelResponse = "";
    for await (const chunk of stream) {
      modelResponse += chunk.text;
    }

    // Save model response
    await prisma.contextMessage.create({
      data: {
        chatId,
        role: "model",
        content: modelResponse,
      },
    });

    return NextResponse.json({
      statusCode: 200,
      data: { res: modelResponse },
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
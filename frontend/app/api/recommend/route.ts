// app/api/recommend/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { tree } from 'next/dist/build/templates/app-page'
import axios, { AxiosError } from 'axios'
import { GoogleGenAI, Type } from "@google/genai"



const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });


export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json([], { status: 401 })

  const recs = await prisma.recommendation.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(recs)
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Fetch user + previous recommendations
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        location: true,
        latitude: true,
        longitude: true,
        farmSize: true,
        cropType: true,
        currentCrop: true,
        recommendation: true
      },
    })

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    // Weather data fetch with proper error handling
    let weatherData = null;
    try {
      if (user.latitude && user.longitude) {
        const weatherResponse = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
          params: {
            lat: user.latitude,
            lon: user.longitude,
            appid: process.env.OPEN_WEATHER_API_KEY,
            units: 'metric',
          },
        });
        weatherData = weatherResponse.data;
      }
    } catch (weatherError) {
      console.error("Weather API error:", weatherError);
      // Continue execution even if weather fetch fails
    }
    // Current weather:

    // Build Prompt with weather data if available
    const promptText = `
You are an agriculture advisor for Indian country, now you are given the following information.
User profile might contain previous recommendations:
${JSON.stringify(user, null, 2)}

Current weather:
${weatherData ? JSON.stringify(weatherData, null, 2) : "Weather data not available"}

Analyze this data to give timely and localized agricultural guidance
- Recommend whether to sow, irrigate, fertilize, harvest, or apply pesticides
- Warn about risks like heavy rainfall, high winds, or temperature drops
- Tailor advice based on the specific crop and region

Now give 1 new and different recommendation with main focus on weather, harvesting, user soil and crop type they are interested in, and best recommendations.

Return the result in this JSON format:

{
  "what": "what is the recommendation",
  "why": "and why is it recommended"
}
`.trim();

    // Check if we have a valid API key
    if (!process.env.GEMINI_API_KEY) {
      console.error("Missing Google AI API key");
      // Fallback recommendation if no API key is available
      const fallbackRecommendation = {
        what: "Regular soil testing",
        why: "Regular soil testing helps monitor nutrient levels and soil health, ensuring optimal growing conditions for your crops."
      };
      
      const save = await prisma.recommendation.create({
        data: {
          userId: session.user.id,
          what: fallbackRecommendation.what,
          why: fallbackRecommendation.why,
        },
      });
      
      return NextResponse.json(save);
    }
    // Gemini Call - updated to match the example syntax
    console.log(process.env.GEMINI_API_KEY)
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: promptText,
            config:{
                maxOutputTokens: 500,
                responseMimeType: "application/json",
                responseSchema: {
                  type: Type.OBJECT,
                  properties: {
                    what: {
                      type: Type.STRING,
                      description: 'what it is ',
                      nullable: false,
                    },
                    why: {
                      type: Type.STRING,
                      description: 'why it is ',
                      nullable: false,
                    },
                  },
                  required: ['what', 'why'],
                },
            }
          });
          console.log(response.text);

      
 

      const data = JSON.parse(response.text as string);
      
      const save = await prisma.recommendation.create({
        data: {
          userId: session.user.id,
          what: data.what,
          why: data.why,
        },
      });
      
      return NextResponse.json(save);
    } catch (aiError) {
      console.error("AI API error:", aiError);
      
      // Provide a fallback recommendation when AI fails
      const fallbackRecommendation = {
        what: "Implement water conservation techniques",
        why: "Water management is critical for crop success in variable weather conditions."
      };
      
      const save = await prisma.recommendation.create({
        data: {
          userId: session.user.id,
          what: fallbackRecommendation.what,
          why: fallbackRecommendation.why,
        },
      });
      
      return NextResponse.json(save);
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Axios error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    console.error("Server error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
export async function DELETE(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 })

  await prisma.recommendation.deleteMany({
    where: { id, userId: session.user.id },
  })

  return NextResponse.json({ success: true })
}

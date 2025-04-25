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



// export async function POST(req: NextRequest) {
//     try {
//   const session = await auth.api.getSession({ headers: await headers() })
//   if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

 



//   // Fetch user + previous recommendations
//   const user = await prisma.user.findUnique({
//     where: { id: session.user.id },
//     select: {
//       location: true,
//       latitude: true,
//       longitude: true,
//       farmSize: true,
//       cropType: true,
//       currentCrop: true,
//       recommendation:true
//     },

//   })

//     // const weather_data = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
//     //     params: {
//     //       lat: user?.latitude,
//     //       lon: user?.longitude,
//     //       appid: process.env.OPEN_WEATHER_API_KEY,
//     //       units: 'metric',
//     //     },
//     //   })
 


//   if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })



//   // Build Prompt
//   const prompt = `
// You are a agriculture advisor for Indian country , now you are given the following information.
// User profile might contain previous recommendations.:
// ${JSON.stringify(user, null, 2)}

// curennt weather:


// Now give 1 new and different recommendations for the main focuse of weather, harvesting user soild and crop type he is interested in., and best recomandations 

// Return the result in this JSON format:

//   {
//     "what": "what is the recomandation",
//     "why": "and why is it recomanded"
//   }

// `.trim()

//   // Gemini Call

//   const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash',systemInstruction:prompt });

//   const result = await model.generateContent(prompt);
//   const response = result.response.text();
//   console.log("Gemini says:", response);
//   function extractJSON(str:any) {
//     try {
//       // Remove code block formatting (```json ... ```)
//       const cleaned = str.replace(/```json|```/g, '').trim();
      
//       // Parse and return JSON
//       console.log('cleaned', cleaned)
//       return JSON.parse(cleaned);
//     } catch (error:any) {
//       console.error("Invalid JSON input:", error.message);
//       return null;
//     }
//   }

//   const data = extractJSON(response);
  

  
//    const save = await    prisma.recommendation.create({
//         data: {
//           userId: session.user.id,
//           what: data.what,
//           why: data.why,
//         },
//       })
    
  

//   return NextResponse.json(save)
// } catch (error) {
//     if(error instanceof AxiosError){
//         console.log(error)
//         return NextResponse.json(error.response?.data)
//     }
//     console.log(error)
//   return NextResponse.json({ message: "Internal server error" }, { status: 500 })

//   }
// }


// export async function POST(req: NextRequest) {
//     try {
//       const session = await auth.api.getSession({ headers: await headers() })
//       if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
//       // Fetch user + previous recommendations
//       const user = await prisma.user.findUnique({
//         where: { id: session.user.id },
//         select: {
//           location: true,
//           latitude: true,
//           longitude: true,
//           farmSize: true,
//           cropType: true,
//           currentCrop: true,
//           recommendation: true
//         },
//       })
  
//       if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
  
//       // Weather data fetch with proper error handling
//       let weatherData = null;
//       try {
//         if (user.latitude && user.longitude) {
//           const weatherResponse = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
//             params: {
//               lat: user.latitude,
//               lon: user.longitude,
//               appid: process.env.OPEN_WEATHER_API_KEY,
//               units: 'metric',
//             },
//           });
//           weatherData = weatherResponse.data;
//         }
//       } catch (weatherError) {
//         console.error("Weather API error:", weatherError);
//         // Continue execution even if weather fetch fails
//       }
  
//       // Build Prompt with weather data if available
//       const prompt = `
//   You are an agriculture advisor for Indian country, now you are given the following information.
//   User profile might contain previous recommendations:
//   ${JSON.stringify(user, null, 2)}
  
//   Current weather:
//   ${weatherData ? JSON.stringify(weatherData, null, 2) : "Weather data not available"}
  
//   Now give 1 new and different recommendation with main focus on weather, harvesting, user soil and crop type they are interested in, and best recommendations.
  
//   Return the result in this JSON format:
  
//   {
//     "what": "what is the recommendation",
//     "why": "and why is it recommended"
//   }
//   `.trim()
  
//       // Gemini Call
//       const model = genAI.getGenerativeModel({ 
//         model: 'gemini-1.5-flash'
//       });
  
//       const result = await model.generateContent(prompt);
//       const response = result.response.text();
      
//       function extractJSON(str: any) {
//         try {
//           // Remove code block formatting (```json ... ```)
//           const cleaned = str.replace(/```json|```/g, '').trim();
          
//           // Parse and return JSON
//           return JSON.parse(cleaned);
//         } catch (error: any) {
//           console.error("Invalid JSON input:", error.message);
//           // Return a fallback JSON if parsing fails
//           return {
//             what: "Unable to generate a specific recommendation",
//             why: "There was an issue processing the recommendation data"
//           };
//         }
//       }
  
//       const data = extractJSON(response);
      
//       const save = await prisma.recommendation.create({
//         data: {
//           userId: session.user.id,
//           what: data.what,
//           why: data.why,
//         },
//       })
      
//       return NextResponse.json(save)
//     } catch (error) {
//       if (error instanceof AxiosError) {
//         console.error("Axios error:", error.message);
//         return NextResponse.json({ error: error.message }, { status: 500 });
//       }
//       console.error("Server error:", error);
//       return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//     }
//   }



// Initialize Google Generative AI with API key from env
// const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "");

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

    // // Weather data fetch with proper error handling
    // let weatherData = null;
    // try {
    //   if (user.latitude && user.longitude) {
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
    // Current weather:
// ${weatherData ? JSON.stringify(weatherData, null, 2) : "Weather data not available"}

    // Build Prompt with weather data if available
    const promptText = `
You are an agriculture advisor for Indian country, now you are given the following information.
User profile might contain previous recommendations:
${JSON.stringify(user, null, 2)}



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

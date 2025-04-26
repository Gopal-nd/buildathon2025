import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


type Params = Promise<{ slug: string }>
export async function GET(
  req: NextRequest,
  segmentData: { params: Params }
) {
    const params = await segmentData.params
    const slug = params.slug
    const chatId = slug
  console.log("Query Params:", req.nextUrl.searchParams.toString(), "get specific user chat history");

  try {
    const history = await prisma.context.findMany({
      where: {
        id: chatId,
      },
      include: {
        contextMessages: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json({

        data: history[0]?.contextMessages ?? [],

  });
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return NextResponse.json({
 
        message: "Internal Server Error",

  });
  }
}

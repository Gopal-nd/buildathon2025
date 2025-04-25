// import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fileURL, filename } = body;

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

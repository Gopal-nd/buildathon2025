import { auth } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers";
import prisma from "@/lib/prisma";





export async function GET() {
  try {
    // Get the authenticated user session
    const session = await auth.api.getSession({
        headers: await headers() // you need to pass the headers object.
    })
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Get the user ID from the session
    const userId = session.user.id
    console.log(userId)

    const data = await prisma.context.findMany({
      where: { userId: userId },

        orderBy: { createdAt: "asc" },
        select:{
            id:true,
            contextMessages:{
                select:{
                    chatId: true,
                    content:true,
                    context:true,
                    id:true,
                    role:true
                }
            }
        }

    })
    console.log(data)
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

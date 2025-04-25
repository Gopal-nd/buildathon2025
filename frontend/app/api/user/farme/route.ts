import { auth } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers";
import prisma from "@/lib/prisma";



export async function POST(req: NextRequest) {
  try {
const session = await auth.api.getSession({
    headers: await headers() // you need to pass the headers object.
})

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Get the user ID from the session
    const userId = session.user.id

    // Parse the request body
    const body = await req.json()
    console.log(body)

    // Validate the data (basic validation, more comprehensive validation should be done)
    const { location, latitude, longitude, farmSize, cropType, currentCrop } = body

    
    const res = await prisma.user.update({
      where: { id: userId },
      data: {
        location:location,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        farmSize: farmSize ? parseFloat(farmSize) : null,
        cropType:cropType,
        currentCrop:currentCrop,
      },
    })
   

    return NextResponse.json(res)
  } catch (error) {
    console.error("Error updating user profile:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

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

    const data = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        location: true,
        latitude: true,
        longitude: true,
        farmSize: true,
        cropType: true,
        currentCrop: true,
      },
    })

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

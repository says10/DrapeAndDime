import { connectToDB } from "@/lib/mongoDB";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

import Collection from "@/lib/models/Collection";

export const POST = async (req: NextRequest) => {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse(
        JSON.stringify({ 
          success: false, 
          message: "Unauthorized" 
        }), 
        { 
          status: 403,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
    }

    await connectToDB()

    const { title, description, image } = await req.json()

    const existingCollection = await Collection.findOne({ title })

    if (existingCollection) {
      return new NextResponse(
        JSON.stringify({ 
          success: false, 
          message: "Collection already exists" 
        }), 
        { 
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
    }

    if (!title || !image) {
      return new NextResponse(
        JSON.stringify({ 
          success: false, 
          message: "Title and image are required" 
        }), 
        { 
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
    }

    const newCollection = await Collection.create({
      title,
      description,
      image,
    })

    await newCollection.save()

    return NextResponse.json(newCollection, { status: 200 })
  } catch (err: any) {
    console.error("❌ Error creating collection:", err);
    return new NextResponse(
      JSON.stringify({ 
        success: false, 
        message: "Internal Server Error",
        error: err?.message || "Unknown error"
      }), 
      { 
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

export const GET = async (req: NextRequest) => {
  try {
    await connectToDB()

    const collections = await Collection.find().sort({ createdAt: "desc" })

    return NextResponse.json(collections, { status: 200 })
  } catch (err: any) {
    console.error("❌ Error fetching collections:", err);
    return new NextResponse(
      JSON.stringify({ 
        success: false, 
        message: "Internal Server Error",
        error: err?.message || "Unknown error"
      }), 
      { 
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

export const dynamic = "force-dynamic";

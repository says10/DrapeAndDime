export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { connectToDB } from "@/lib/mongoDB";
import CartSession from "@/lib/models/CartSession";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDB();
    const body = await request.json();
    const { action, cartItems, userEmail, userName } = body;

    switch (action) {
      case "create_session":
        // Create new cart session
        const session = await CartSession.create({
          userId,
          userEmail,
          userName,
          cartItems: cartItems.map((item: any) => ({
            productId: item.item._id,
            quantity: item.quantity,
            price: item.item.price,
            title: item.item.title,
            image: item.item.images[0],
            size: item.size,
            color: item.color
          })),
          totalValue: cartItems.reduce((sum: number, item: any) => sum + (item.item.price * item.quantity), 0),
          status: "active",
          lastActivity: new Date()
        });

        return NextResponse.json({ sessionId: session._id });

      case "update_activity":
        // Update last activity for existing session
        const updatedSession = await CartSession.findOneAndUpdate(
          { userId, status: "active" },
          { lastActivity: new Date() },
          { new: true }
        );

        return NextResponse.json({ success: true });

      case "mark_abandoned":
        // Mark cart as abandoned
        await CartSession.findOneAndUpdate(
          { userId, status: "active" },
          { 
            status: "abandoned",
            abandonedAt: new Date()
          }
        );

        return NextResponse.json({ success: true });

      case "mark_recovered":
        // Mark cart as recovered (user returned and purchased)
        await CartSession.findOneAndUpdate(
          { userId, status: "abandoned" },
          { 
            status: "recovered",
            recoveredAt: new Date()
          }
        );

        return NextResponse.json({ success: true });

      case "mark_purchased":
        // Mark cart as purchased
        await CartSession.findOneAndUpdate(
          { userId, status: { $in: ["active", "abandoned"] } },
          { 
            status: "purchased",
            purchasedAt: new Date()
          }
        );

        return NextResponse.json({ success: true });

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Cart tracking error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDB();
    
    // Get user's cart sessions
    const sessions = await CartSession.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10);

    return NextResponse.json({ sessions });
  } catch (error) {
    console.error("Cart tracking error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 
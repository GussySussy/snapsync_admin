import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET all events
export async function GET() {
  try {
    const events = await prisma.events.findMany({
      orderBy: { created_at: "desc" },
    });
    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

// POST (Create a new event)
export async function POST(req: NextRequest) {
  try {
    const { name, date, description } = await req.json();
    const newEvent = await prisma.events.create({
      data: { name, date: new Date(date), description },
    });
    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}

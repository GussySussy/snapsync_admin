import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// PUT (Update an event)
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { name, date, description } = await req.json();

    const updatedEvent = await prisma.events.update({
      where: { id },
      data: { name, date: new Date(date), description },
    });

    return NextResponse.json(updatedEvent);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 }
    );
  }
}

// DELETE (Delete an event)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await prisma.events.delete({ where: { id } });
    return NextResponse.json({ message: "Event deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete event" },
      { status: 500 }
    );
  }
}

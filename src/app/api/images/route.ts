import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET all images
export async function GET() {
  try {
    const images = await prisma.images.findMany({
      include: { events: true, users: true },
      orderBy: { created_at: "desc" },
    });

    const formattedImages = images.map((image) => ({
      id: image.id,
      name: image.name,
      imageUrl: `data:image/png;base64,${Buffer.from(image.image_data).toString(
        "base64"
      )}`,
      eventName: image.events?.name ?? "Unknown Event",
      createdBy: image.users?.clerk_id ?? "Unknown",
      createdAt: image.created_at,
    }));

    return NextResponse.json(formattedImages);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 }
    );
  }
}

// POST (Create a new image)
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("images") as File[];
    const event_id = formData.get("event_id") as string;
    const created_by = formData.get("created_by") as string;

    if (!files.length || !event_id || !created_by) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 🔍 Validate if the user exists
    const userExists = await prisma.users.findUnique({
      where: { clerk_id: created_by },
    });

    if (!userExists) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    // Upload images
    const uploadedImages = [];
    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const newImage = await prisma.images.create({
        data: {
          name: file.name,
          image_data: buffer,
          event_id,
          created_by,
        },
      });

      uploadedImages.push(newImage);
    }

    return NextResponse.json(uploadedImages, { status: 201 });
  } catch (error) {
    console.error("Error uploading images:", error);
    return NextResponse.json(
      { error: "Failed to upload images" },
      { status: 500 }
    );
  }
}

// PATCH (Update image name)
export async function PATCH(req: Request) {
  try {
    const { id, name } = await req.json();
    const updatedImage = await prisma.images.update({
      where: { id },
      data: { name },
    });
    return NextResponse.json(updatedImage);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update image" },
      { status: 500 }
    );
  }
}

// DELETE (Remove an image)
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await prisma.images.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    );
  }
}

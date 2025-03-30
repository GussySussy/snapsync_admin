"use client";

import { useState } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import Image from "next/image";

interface ImageItem {
  id: string;
  name: string;
  imageUrl: string;
  eventName?: string;
  createdBy: string;
  createdAt?: string;
}

interface ImagesTableProps {
  images: ImageItem[];
  fetchImages: () => void;
}

export function ImagesTable({ images, fetchImages }: ImagesTableProps) {
  const [search, setSearch] = useState("");

  async function handleDelete(id: string) {
    try {
      const res = await fetch("/api/images", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed to delete image");
      fetchImages();
    } catch (error) {
      console.error(error);
    }
  }

  const filteredImages = images.filter(
    (img) =>
      img.name.toLowerCase().includes(search.toLowerCase()) ||
      (img.eventName &&
        img.eventName.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="flex justify-between mb-4">
        <Input
          type="text"
          placeholder="Search images or events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-1/3"
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Event</TableHead>
            <TableHead>Uploaded By</TableHead>
            <TableHead>Uploaded At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredImages.length > 0 ? (
            filteredImages.map((image) => (
              <TableRow key={image.id}>
                <TableCell>
                  <Image
                    src={image.imageUrl}
                    alt={image.name}
                    width={50}
                    height={50}
                    className="rounded-md"
                  />
                </TableCell>
                <TableCell>{image.name}</TableCell>
                <TableCell>{image.eventName || "N/A"}</TableCell>
                <TableCell>{image.createdBy}</TableCell>
                <TableCell>
                  {image.createdAt
                    ? format(new Date(image.createdAt), "PPP p")
                    : "-"}
                </TableCell>
                <TableCell className="flex space-x-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(image.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-gray-500">
                No images found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

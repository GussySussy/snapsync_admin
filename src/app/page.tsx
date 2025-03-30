"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImagesTable } from "@/components/app/images-table";

interface Event {
  id: string;
  name: string;
}

export default function ImagesPage() {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [images, setImages] = useState([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string>("");

  useEffect(() => {
    fetchImages();
    fetchEvents();
  }, []);

  async function fetchImages() {
    const res = await fetch("/api/images");
    if (res.ok) {
      setImages(await res.json());
    }
  }

  async function fetchEvents() {
    const res = await fetch("/api/events");
    if (res.ok) {
      setEvents(await res.json());
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(event.target.files);
    }
  };

  const handleUpload = async () => {
    if (!selectedFiles || !selectedEvent) return;
    const formData = new FormData();
    Array.from(selectedFiles).forEach((file) => {
      formData.append("images", file);
    });
    formData.append("eventId", selectedEvent);

    try {
      const res = await fetch("/api/images", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to upload images");
      setSelectedFiles(null);
      setSelectedEvent("");
      alert("Images uploaded successfully!");
      fetchImages();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Images</h1>
      <div className="p-4 bg-white rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Upload Images</h2>
        <div className="flex items-center space-x-4">
          <select
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">Select Event</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.name}
              </option>
            ))}
          </select>
          <input
            id="fileInput"
            type="file"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
          <Button onClick={() => document.getElementById("fileInput")?.click()}>
            Browse...
          </Button>
          <span>
            {selectedFiles
              ? Array.from(selectedFiles)
                  .map((file) => file.name)
                  .join(", ")
              : "No file selected"}
          </span>
          <Button
            onClick={handleUpload}
            disabled={!selectedFiles || !selectedEvent}
          >
            Upload
          </Button>
        </div>
      </div>
      <ImagesTable images={images} fetchImages={fetchImages} />
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ImagesTable } from "@/components/app/images-table";

interface ImageItem {
  id: string;
  name: string;
  imageUrl: string;
  eventName?: string;
  createdBy: string;
  createdAt?: string;
}

export default function ImagesPage() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [events, setEvents] = useState<{ id: string; name: string }[]>([]);
  const [users, setUsers] = useState<{ clerk_id: string; name?: string }[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFileNames, setSelectedFileNames] = useState<string[]>([]);

  useEffect(() => {
    fetchData();
  }, []);
  
  async function fetchData() {
    setLoading(true);
    try {
      await Promise.all([
        fetchImages(),
        fetchEvents(),
        fetchUsers()
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function fetchImages() {
    try {
      const res = await fetch("/api/images");
      if (res.ok) {
        const data = await res.json();
        setImages(data);
      } else {
        console.error("Failed to fetch images");
      }
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  }

  async function fetchEvents() {
    try {
      const res = await fetch("/api/events");
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      } else {
        console.error("Failed to fetch events");
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  }

  async function fetchUsers() {
    try {
      const res = await fetch("/api/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      } else {
        console.error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(event.target.files);
      setSelectedFileNames(
        Array.from(event.target.files).map((file) => file.name)
      );
    }
  };

  const handleUpload = async () => {
    if (!selectedFiles || !selectedEvent || !selectedUser) return;

    const formData = new FormData();
    Array.from(selectedFiles).forEach((file) => {
      formData.append("images", file);
    });
    formData.append("event_id", selectedEvent);
    formData.append("created_by", selectedUser);

    try {
      setLoading(true);
      const res = await fetch("/api/images", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to upload images");

      setSelectedFiles(null);
      setSelectedEvent("");
      setSelectedUser("");
      setIsModalOpen(false);
      await fetchImages();
    } catch (error) {
      console.error("Error uploading images:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Images</h1>
        {/* <Button onClick={() => setIsModalOpen(true)}>Upload an Image</Button> */}
      </div>

      {/* Upload Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload an Image</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* File Upload Button */}
            <Button
              onClick={() => document.getElementById("fileInput")?.click()}
            >
              Select Image
            </Button>
            <input
              id="fileInput"
              type="file"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />

            {/* Display selected filenames */}
            {selectedFileNames.length > 0 && (
              <div className="text-sm text-gray-500">
                <strong>Selected Files:</strong> {selectedFileNames.join(", ")}
              </div>
            )}

            {/* Select Event */}
            <Select onValueChange={setSelectedEvent}>
              <SelectTrigger>
                <SelectValue placeholder="Select an Event" />
              </SelectTrigger>
              <SelectContent>
                {events.map((event) => (
                  <SelectItem key={event.id} value={event.id}>
                    {event.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Select User */}
            <Select onValueChange={setSelectedUser}>
              <SelectTrigger>
                <SelectValue placeholder="Select a User" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.clerk_id} value={user.clerk_id}>
                    {user.name || user.clerk_id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Upload Button */}
            <Button
              onClick={handleUpload}
              disabled={!selectedFiles || !selectedEvent || !selectedUser}
            >
              Upload
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ImagesTable 
        images={images} 
        fetchImages={fetchImages} 
        isLoading={loading}
      />
    </div>
  );
}

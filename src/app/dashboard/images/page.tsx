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

export default function ImagesPage() {
  const [images, setImages] = useState([]);
  const [events, setEvents] = useState<{ id: string; name: string }[]>([]);
  const [users, setUsers] = useState<{ clerk_id: string; name?: string }[]>([]);

  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFileNames, setSelectedFileNames] = useState<string[]>([]);

  useEffect(() => {
    fetchImages();
    fetchEvents();
    fetchUsers();
  }, []);

  async function fetchImages() {
    const res = await fetch("/api/images");
    if (res.ok) setImages(await res.json());
  }

  async function fetchEvents() {
    const res = await fetch("/api/events"); // Adjust API endpoint
    if (res.ok) setEvents(await res.json());
  }

  async function fetchUsers() {
    const res = await fetch("/api/users"); // Adjust API endpoint
    if (res.ok) setUsers(await res.json());
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
      const res = await fetch("/api/images", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to upload images");

      setSelectedFiles(null);
      setSelectedEvent("");
      setSelectedUser("");
      setIsModalOpen(false);
      fetchImages();
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Images</h1>

      {/* Upload Button */}
      <Button onClick={() => setIsModalOpen(true)}>Upload an Image</Button>

      {/* Upload Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload an Image</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* File Upload Button */}
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
                    {user.name || user.clerk_id}{" "}
                    {/* Show name if available, otherwise ID */}
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

      <ImagesTable images={images} fetchImages={fetchImages} />
    </div>
  );
}

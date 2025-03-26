"use client";

import { useEffect, useState } from "react";
import { EventsTable } from "@/components/app/events-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

interface Event {
  id: string;
  name: string;
  date: string;
  description?: string;
  created_at?: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [creatingEvent, setCreatingEvent] = useState<boolean>(false);
  const [newEvent, setNewEvent] = useState({
    name: "",
    date: "",
    description: "",
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    try {
      const res = await fetch("/api/events");
      if (!res.ok) throw new Error("Failed to fetch events");
      const data: Event[] = await res.json();
      setEvents(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleEdit(updatedEvent: Event) {
    try {
      const res = await fetch(`/api/events/${updatedEvent.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedEvent),
      });
      if (!res.ok) throw new Error("Failed to update event");
      fetchEvents();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete event");
      setEvents(events?.filter((event) => event.id !== id) || []);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleCreate() {
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEvent),
      });
      if (!res.ok) throw new Error("Failed to create event");
      setNewEvent({ name: "", date: "", description: "" });
      setCreatingEvent(false);
      fetchEvents();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Events</h1>
      <Button onClick={() => setCreatingEvent(true)} className="mb-4">
        + Create Event
      </Button>

      {loading ? (
        <Skeleton className="h-64 w-full" />
      ) : events && events.length > 0 ? (
        <EventsTable
          events={events}
          onEdit={setEditingEvent}
          onDelete={handleDelete}
        />
      ) : (
        <p className="text-gray-500">No events found.</p>
      )}

      {/* Edit Event Dialog */}
      <Dialog open={!!editingEvent} onOpenChange={() => setEditingEvent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (editingEvent) handleEdit(editingEvent);
              setEditingEvent(null);
            }}
          >
            <Input
              value={editingEvent?.name || ""}
              onChange={(e) =>
                setEditingEvent((prev) =>
                  prev ? { ...prev, name: e.target.value } : null
                )
              }
              placeholder="Event Name"
              className="mb-2"
              required
            />
            <Input
              type="date"
              value={editingEvent?.date.split("T")[0] || ""}
              onChange={(e) =>
                setEditingEvent((prev) =>
                  prev ? { ...prev, date: e.target.value } : null
                )
              }
              className="mb-2"
              required
            />
            <Input
              value={editingEvent?.description || ""}
              onChange={(e) =>
                setEditingEvent((prev) =>
                  prev ? { ...prev, description: e.target.value } : null
                )
              }
              placeholder="Description"
              className="mb-2"
            />
            <DialogFooter>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Create Event Dialog */}
      <Dialog open={creatingEvent} onOpenChange={() => setCreatingEvent(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Event</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCreate();
            }}
          >
            <Input
              value={newEvent.name}
              onChange={(e) =>
                setNewEvent({ ...newEvent, name: e.target.value })
              }
              placeholder="Event Name"
              className="mb-2"
              required
            />
            <Input
              type="date"
              value={newEvent.date}
              onChange={(e) =>
                setNewEvent({ ...newEvent, date: e.target.value })
              }
              className="mb-2"
              required
            />
            <Input
              value={newEvent.description}
              onChange={(e) =>
                setNewEvent({ ...newEvent, description: e.target.value })
              }
              placeholder="Description"
              className="mb-2"
            />
            <DialogFooter>
              <Button type="submit">Create Event</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

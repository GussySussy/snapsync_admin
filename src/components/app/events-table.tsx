import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useState } from "react";

// Define the Event type
interface Event {
  id: string;
  name: string;
  date: string;
  description?: string;
  created_at?: string;
}

interface EventsTableProps {
  events: Event[];
  onEdit: (event: Event) => void;
  onDelete: (id: string) => void;
}

export function EventsTable({ events, onEdit, onDelete }: EventsTableProps) {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Event Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id}>
              <TableCell>{event.name}</TableCell>
              <TableCell>{format(new Date(event.date), "PPP")}</TableCell>
              <TableCell>{event.description || "N/A"}</TableCell>
              <TableCell>
                {event.created_at
                  ? format(new Date(event.created_at), "PPP p")
                  : "-"}
              </TableCell>
              <TableCell className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(event)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(event.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

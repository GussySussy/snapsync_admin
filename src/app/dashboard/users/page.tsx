"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function UsersPage() {
  const [users, setUsers] = useState<
    { id: number; name: string; email: string; clerk_id: string }[]
  >([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<{
    id?: number;
    name: string;
    email: string;
    clerk_id?: string;
  }>({
    name: "",
    email: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    const res = await fetch("/api/users");
    if (res.ok) setUsers(await res.json());
  }

  const handleSaveUser = async () => {
    if (!editingUser.name || !editingUser.email) return;

    const method = editingUser.id ? "PUT" : "POST";
    const res = await fetch("/api/users", {
      method,
      body: JSON.stringify(editingUser),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      fetchUsers();
      setModalOpen(false);
      setEditingUser({ name: "", email: "" });
    }
  };

  const handleDeleteUser = async (id: number) => {
    const res = await fetch("/api/users", {
      method: "DELETE",
      body: JSON.stringify({ id }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) fetchUsers();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Users</h1>

      <Table className="mt-4">
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditingUser(user);
                    setModalOpen(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDeleteUser(user.id)}
                  className="ml-2"
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

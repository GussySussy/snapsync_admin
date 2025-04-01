"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  }

  const handleSaveUser = async () => {
    if (!editingUser.name || !editingUser.email) return;

    setIsLoading(true);
    try {
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
      } else {
        console.error("Failed to save user");
      }
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  const handleDeleteUser = async (id: number) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/users", {
        method: "DELETE",
        body: JSON.stringify({ id }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        setUsers(users.filter(user => user.id !== id));
      } else {
        console.error("Failed to delete user");
        fetchUsers(); // Refresh the list if the optimistic update fails
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      fetchUsers(); // Refresh the list if an error occurs
    } finally {
      setIsLoading(false);
    }
  };

  // Table row skeleton for loading state
  const TableRowSkeleton = () => (
    <TableRow className="h-[53px]">
      <TableCell>
        <div className="h-4 w-8 bg-gray-200 animate-pulse rounded"></div>
      </TableCell>
      <TableCell>
        <div className="h-4 w-28 bg-gray-200 animate-pulse rounded"></div>
      </TableCell>
      <TableCell>
        <div className="h-4 w-48 bg-gray-200 animate-pulse rounded"></div>
      </TableCell>
      <TableCell>
        <div className="flex space-x-2">
          <div className="h-8 w-12 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
        </div>
      </TableCell>
    </TableRow>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Users</h1>
        {/* <Button 
          onClick={() => {
            setEditingUser({ name: "", email: "" });
            setModalOpen(true);
          }}
        >
          Add User
        </Button> */}
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[10%]">ID</TableHead>
              <TableHead className="w-[30%]">Name</TableHead>
              <TableHead className="w-[40%]">Email</TableHead>
              <TableHead className="w-[20%]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Show skeleton rows while loading
              <>
                <TableRowSkeleton />
                <TableRowSkeleton />
                <TableRowSkeleton />
                <TableRowSkeleton />
                <TableRowSkeleton />
              </>
            ) : users.length > 0 ? (
              users.map((user) => (
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
                      disabled={isLoading}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteUser(user.id)}
                      className="ml-2"
                      disabled={isLoading}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-gray-500">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit/Add User Dialog */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingUser.id ? "Edit User" : "Add User"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="name">Name</label>
              <Input
                id="name"
                value={editingUser.name}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email">Email</label>
              <Input
                id="email"
                type="email"
                value={editingUser.email}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, email: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveUser} disabled={isLoading}>
              {editingUser.id ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

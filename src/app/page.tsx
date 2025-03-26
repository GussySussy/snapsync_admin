"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "password123";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (localStorage.getItem("isAuthenticated") === "true") {
      router.push("/dashboard/");
    }
  }, [router]);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      localStorage.setItem("isAuthenticated", "true");
      router.push("/dashboard");
    } else {
      setError("Invalid username or password");
    }
  }

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-80">
        <h2 className="text-2xl font-semibold mb-4 text-center">Admin Login</h2>
        {error && (
          <p className="text-red-500 text-sm text-center mb-2">{error}</p>
        )}
        <form onSubmit={handleLogin} className="space-y-3">
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
      </div>
    </div>
  );
}

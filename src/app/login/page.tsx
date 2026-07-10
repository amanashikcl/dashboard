"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      localStorage.setItem("auth", "true");
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Mock Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <Input 
            placeholder="Enter username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
          />
          <Input type="password" placeholder="Enter any password" required />
          <Button type="submit" className="w-full">Sign In</Button>
        </form>
      </Card>
    </div>
  );
}
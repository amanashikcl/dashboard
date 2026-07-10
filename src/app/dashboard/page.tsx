"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTasks } from "@/context/TaskContext";
import { Task, TaskStatus } from "@/types";

// shadcn UI imports
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function DashboardPage() {
  const router = useRouter();
  const { tasks, addTask, updateTask, deleteTask } = useTasks();


  useEffect(() => {
    if (!localStorage.getItem("auth")) {
      router.push("/login");
    }
  }, [router]);


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState<TaskStatus>("Todo");

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [sortOrder, setSortOrder] = useState<string>("none");

  let displayTasks = tasks.filter((t) => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (statusFilter !== "All") {
    displayTasks = displayTasks.filter((t) => t.status === statusFilter);
  }

  if (sortOrder !== "none") {
    displayTasks.sort((a, b) => {
      const dateA = new Date(a.dueDate).getTime();
      const dateB = new Date(b.dueDate).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
  }


  const handleLogout = () => {
    localStorage.removeItem("auth");
    router.push("/login");
  };

  const openModal = (task?: Task) => {
    if (task) {
      setEditingTask(task);
      setTitle(task.title);
      setDescription(task.description);
      setDueDate(task.dueDate);
      setStatus(task.status);
    } else {
      setEditingTask(null);
      setTitle("");
      setDescription("");
      setDueDate("");
      setStatus("Todo");
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTask) {
      updateTask({ ...editingTask, title, description, dueDate, status });
    } else {
      addTask(title, description, dueDate, status);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Task Management</h1>
          <div className="flex gap-4">
            <Button onClick={() => openModal()}>+ Create Task</Button>
            <Button variant="outline" onClick={handleLogout}>Logout</Button>
          </div>
        </div>

        <Card className="p-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-1">
              <Label>Search</Label>
              <Input 
                placeholder="Search by title..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="space-y-1">
              <Label>Filter by Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="Todo">Todo</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label>Sort by Due Date</Label>
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger>
                  <SelectValue placeholder="No Sorting" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="asc">Earliest First</SelectItem>
                  <SelectItem value="desc">Latest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>


        {displayTasks.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            No tasks found. Create one to get started!
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {displayTasks.map((task) => (
              <Card key={task.id} className="flex flex-col justify-between">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-xl font-semibold line-clamp-1">{task.title}</CardTitle>
                    <span className={`px-2 py-1 text-xs rounded-full font-medium whitespace-nowrap
                      ${task.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                        task.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' : 
                        'bg-slate-100 text-slate-700'}`}>
                      {task.status}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-red-500 pt-1">Due: {task.dueDate}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 line-clamp-3">{task.description}</p>
                </CardContent>
                <CardFooter className="flex justify-end gap-2 border-t bg-slate-50/50 p-4 mt-auto">
                  <Button variant="outline" size="sm" onClick={() => openModal(task)}>Edit</Button>
                  <Button variant="destructive" size="sm" onClick={() => deleteTask(task.id)}>Delete</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}


        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editingTask ? "Edit Task" : "Create New Task"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input required value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <textarea 
                  required 
                  className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label>Due Date</Label>
                <Input required type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={status} onValueChange={(val) => setStatus(val as TaskStatus)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Todo">Todo</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit">{editingTask ? "Save Changes" : "Create Task"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}
"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, TaskStatus } from '@/types';

interface TaskContextType {
  tasks: Task[];
  addTask: (title: string, description: string, dueDate: string, status: TaskStatus) => void;
  updateTask: (updatedTask: Task) => void;
  deleteTask: (id: string) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('tasks');
    if (stored) setTasks(JSON.parse(stored));
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks, isLoaded]);

  const addTask = (title: string, description: string, dueDate: string, status: TaskStatus) => {
    setTasks([{ id: crypto.randomUUID(), title, description, dueDate, status }, ...tasks]);
  };

  const updateTask = (updatedTask: Task) => {
    setTasks(tasks.map(t => (t.id === updatedTask.id ? updatedTask : t)));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask }}>
      {children}
    </TaskContext.Provider>
  );
}

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error("useTasks must be used within TaskProvider");
  return context;
};
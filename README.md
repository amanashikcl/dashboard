# Simple Task Management Dashboard

A modern, responsive task management application built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **shadcn/ui**. The application features mock authentication, local storage state persistence, dynamic task filtering/sorting, and complete CRUD capability.


# FOLDER STUCTURE

*   **`src/app/`**: Contains the core application pages.
    *   `login/page.tsx`: The login interface.
    *   `dashboard/page.tsx`: The main task management dashboard.
    *   `layout.tsx`: The root layout for the application.
*   **`src/components/ui/`**: Custom UI components from `shadcn/ui`.
*   **`src/context/TaskContext.tsx`**: Manages task state using React Context and persists data to `localStorage`.
*   **`src/types/index.ts`**: TypeScript type definitions for `Task` and `TaskStatus`.

---

# AUTHENTICATION 

*   **Mock Authentication**: The application uses mock credentials for login (`admin` / `password`).
*   **State Persistence**: All task data is stored in the browser's `localStorage`, ensuring data persists across page reloads.
*   **Navigation**: The application enforces navigation restrictions; users are redirected to the login page if they attempt to access `/dashboard` without being authenticated.

---

# UI AND STYLING

*   **Framework**: Built with **Next.js 16** using the **App Router**.
*   **Styling**: **Tailwind CSS** is used for utility-first styling.
*   **Component Library**: **shadcn/ui** provides accessible and customizable components like Buttons, Cards, Inputs, and Dialogs.

---

## CONFIGURATION

*   **TypeScript**: The project is fully typed with TypeScript for better type safety.
*   **Linting**: ESLint is configured for code quality.


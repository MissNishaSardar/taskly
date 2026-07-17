import { TaskForm } from "@/components/TaskForm";
import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/shadcnui/button";
import { cn } from "@/lib/utils";
import { ChevronLeftIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "New Task",
  description: "Create a new task.",
};

const NewTaskPage = () => (
  <div className="mx-auto flex w-full max-w-lg flex-col gap-6 py-6">
    <div>
      <Link
        href="/tasks"
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "mb-4 -ml-2",
        )}>
        <ChevronLeftIcon />
        Back to tasks
      </Link>
      <h1 className="text-2xl font-medium">New task</h1>
      <p className="text-muted-foreground text-sm">
        Fill in the details below to create a new task.
      </p>
    </div>

    <TaskForm />
  </div>
);

export default NewTaskPage;

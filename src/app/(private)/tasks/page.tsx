import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import { headers } from "next/headers";
import Link from "next/link";
import { buttonVariants } from "@/components/shadcnui/button";
import { cn } from "@/lib/utils";
import { PlusIcon } from "lucide-react";
import { TaskCard } from "@/components/TaskCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tasks",
  description: "Manage your tasks.",
};

const TasksPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id;

  const tasks =
    userId ?
      await prisma.task.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 py-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium">Tasks</h1>
          <p className="text-muted-foreground text-sm">
            {tasks.length} {tasks.length === 1 ? "task" : "tasks"} total
          </p>
        </div>
        <Link
          href="/tasks/new"
          className={cn(buttonVariants(), "inline-flex items-center gap-1.5")}>
          <PlusIcon />
          New task
        </Link>
      </header>

      {tasks.length === 0 ?
        <div className="flex flex-col items-center gap-2 py-16">
          <p className="text-muted-foreground text-sm">No tasks yet.</p>
          <Link
            href="/tasks/new"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "inline-flex items-center gap-1.5",
            )}>
            Create your first task
          </Link>
        </div>
      : <div className="grid gap-3">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task as never}
            />
          ))}
        </div>
      }
    </div>
  );
};

export default TasksPage;

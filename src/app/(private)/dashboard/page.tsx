import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import { headers } from "next/headers";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shadcnui/card";
import { TaskCard } from "@/components/TaskCard";
import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/shadcnui/button";
import { cn } from "@/lib/utils";
import { PlusIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your tasks and projects.",
};

const DashboardPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id;

  const tasks =
    userId ?
      await prisma.task.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      })
    : [];

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "done").length;
  const inProgressTasks = tasks.filter(
    (t) => t.status === "in_progress",
  ).length;
  const overdueTasks = tasks.filter(
    (t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "done",
  ).length;

  const recentTasks = tasks.slice(0, 5);

  const statsData = [
    { label: "Total Tasks", value: totalTasks },
    { label: "Completed", value: completedTasks },
    { label: "In Progress", value: inProgressTasks },
    { label: "Overdue", value: overdueTasks },
  ];

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 py-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium">Dashboard</h1>
          <p className="text-muted-foreground text-sm">
            Welcome back! Here&apos;s your overview.
          </p>
        </div>
        <Link
          href="/tasks/new"
          className={cn(buttonVariants(), "inline-flex items-center gap-1.5")}>
          <PlusIcon />
          New task
        </Link>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat) => (
          <Card key={stat.label}>
            <CardHeader>
              <CardTitle className="text-muted-foreground text-sm font-normal">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-medium">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Tasks</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          {recentTasks.length === 0 ?
            <p className="text-muted-foreground text-sm">
              No tasks yet.{" "}
              <Link
                href="/tasks/new"
                className="text-primary underline-offset-4 hover:underline">
                Create your first task
              </Link>
              .
            </p>
          : recentTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task as never}
              />
            ))
          }
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;

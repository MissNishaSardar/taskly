import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import Link from "next/link";
import { buttonVariants } from "@/components/shadcnui/button";
import { cn } from "@/lib/utils";
import { ChevronLeftIcon } from "lucide-react";
import { TaskDetailClient } from "@/components/TaskDetailClient";
import type { Metadata } from "next";

type TaskDetailPageProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "Task",
  description: "View task details.",
};

const TaskDetailPage = async ({ params }: TaskDetailPageProps) => {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id;

  const task =
    userId ?
      await prisma.task.findFirst({
        where: { id, userId },
      })
    : null;

  if (!task) notFound();

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 py-6">
      <Link
        href="/tasks"
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "-ml-2 w-fit",
        )}>
        <ChevronLeftIcon />
        Back to tasks
      </Link>

      <TaskDetailClient task={task as never} />
    </div>
  );
};

export default TaskDetailPage;

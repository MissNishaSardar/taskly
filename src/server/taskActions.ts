"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import {
  createTaskSchema,
  updateTaskSchema,
  type CreateTaskType,
  type UpdateTaskType,
  type TaskData,
} from "@/lib/zodSchema";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

const getSession = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session;
};

export const getTasks = async (): Promise<TaskData[]> => {
  const session = await getSession();

  const tasks = await prisma.task.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return tasks as unknown as TaskData[];
};

export const getTaskById = async (id: string): Promise<TaskData | null> => {
  const session = await getSession();

  const task = await prisma.task.findFirst({
    where: { id, userId: session.user.id },
  });

  return task as unknown as TaskData | null;
};

export const createTask = async (data: CreateTaskType): Promise<TaskData> => {
  const session = await getSession();

  const parsed = createTaskSchema.parse(data);

  const task = await prisma.task.create({
    data: {
      title: parsed.title,
      description: parsed.description ?? null,
      priority: parsed.priority ?? "medium",
      dueDate: parsed.dueDate ? new Date(parsed.dueDate) : null,
      userId: session.user.id,
    },
  });

  revalidatePath("/tasks");
  revalidatePath("/dashboard");

  return task as unknown as TaskData;
};

export const updateTask = async (
  id: string,
  data: UpdateTaskType,
): Promise<TaskData> => {
  const session = await getSession();

  const parsed = updateTaskSchema.parse(data);

  const existing = await prisma.task.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!existing) throw new Error("Task not found");

  const task = await prisma.task.update({
    where: { id },
    data: {
      ...(parsed.title !== undefined && { title: parsed.title }),
      ...(parsed.description !== undefined && {
        description: parsed.description ?? null,
      }),
      ...(parsed.status !== undefined && { status: parsed.status }),
      ...(parsed.priority !== undefined && { priority: parsed.priority }),
      ...(parsed.dueDate !== undefined && {
        dueDate: parsed.dueDate ? new Date(parsed.dueDate) : null,
      }),
    },
  });

  revalidatePath("/tasks");
  revalidatePath("/dashboard");

  return task as unknown as TaskData;
};

export const deleteTask = async (id: string): Promise<void> => {
  const session = await getSession();

  const existing = await prisma.task.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!existing) throw new Error("Task not found");

  await prisma.task.delete({ where: { id } });

  revalidatePath("/tasks");
  revalidatePath("/dashboard");
};

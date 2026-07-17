"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteTask, updateTask } from "@/server/taskActions";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";
import { TASK_STATUSES, type TaskData } from "@/lib/zodSchema";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/shadcnui/alert-dialog";
import { Button } from "@/components/shadcnui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shadcnui/card";
import {
  CalendarIcon,
  PencilIcon,
  Trash2Icon,
  CheckIcon,
  Loader2Icon,
} from "lucide-react";
import { TaskForm } from "./TaskForm";

const statusConfig = {
  todo: {
    label: "To do",
    class: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  in_progress: {
    label: "In progress",
    class: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  done: {
    label: "Done",
    class: "bg-green-500/10 text-green-600 dark:text-green-400",
  },
} as const;

const priorityConfig = {
  low: { label: "Low", class: "text-muted-foreground" },
  medium: { label: "Medium", class: "text-amber-600 dark:text-amber-400" },
  high: { label: "High", class: "text-red-600 dark:text-red-400" },
} as const;

type TaskDetailClientProps = {
  task: TaskData;
};

const TaskDetailClient = ({ task }: TaskDetailClientProps) => {
  const { replace, refresh } = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const status =
    statusConfig[task.status as keyof typeof statusConfig] ?? statusConfig.todo;
  const priority =
    priorityConfig[task.priority as keyof typeof priorityConfig] ??
    priorityConfig.medium;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteTask(task.id);
      toast.success("Task deleted!");
      replace("/tasks");
    } catch {
      toast.error("Failed to delete task.");
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  const handleStatusChange = async (status: string) => {
    try {
      await updateTask(task.id, { status: status as TaskData["status"] });
      toast.success("Status updated!");
      refresh();
    } catch {
      toast.error("Failed to update status.");
    }
  };

  if (isEditing) {
    return (
      <div>
        <TaskForm task={task} />
        <Button
          variant="ghost"
          className="mt-4"
          onClick={() => setIsEditing(false)}>
          Cancel editing
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-xl">{task.title}</CardTitle>
            {task.description && (
              <p className="text-muted-foreground mt-1 text-sm">
                {task.description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => setIsEditing(true)}>
              <PencilIcon />
            </Button>
            <AlertDialog
              open={deleteDialogOpen}
              onOpenChange={setDeleteDialogOpen}>
              <AlertDialogTrigger
                render={
                  <Button
                    variant="outline"
                    size="icon-sm">
                    <Trash2Icon />
                  </Button>
                }
              />
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogMedia>
                    <Trash2Icon />
                  </AlertDialogMedia>
                  <AlertDialogTitle>Delete task</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete &ldquo;{task.title}&rdquo;?
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel variant="outline">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={isDeleting}>
                    {isDeleting ?
                      <Loader2Icon className="animate-spin" />
                    : <Trash2Icon />}
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4">
            <span
              className={cn(
                "rounded-full px-2.5 py-0.5 text-xs font-medium",
                status.class,
              )}>
              {status.label}
            </span>
            <span className={cn("text-xs font-medium", priority.class)}>
              {priority.label}
            </span>
            {task.dueDate && (
              <span className="text-muted-foreground flex items-center gap-1 text-xs">
                <CalendarIcon className="size-3" />
                {new Date(task.dueDate).toLocaleString()}
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {TASK_STATUSES.map((s) => {
              const cfg = statusConfig[s];
              const isActive = task.status === s;
              return (
                <Button
                  key={s}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleStatusChange(s)}
                  disabled={isActive}>
                  {isActive && <CheckIcon />}
                  {cfg.label}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Details</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-foreground font-medium">Created</p>
            <p>{new Date(task.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-foreground font-medium">Updated</p>
            <p>{new Date(task.updatedAt).toLocaleDateString()}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { TaskDetailClient };

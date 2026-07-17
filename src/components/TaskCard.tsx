import { Card, CardContent } from "@/components/shadcnui/card";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import Link from "next/link";
import type { TaskData } from "@/lib/zodSchema";

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

type TaskCardProps = {
  task: TaskData;
};

const TaskCard = ({ task }: TaskCardProps) => {
  const status =
    statusConfig[task.status as keyof typeof statusConfig] ?? statusConfig.todo;
  const priority =
    priorityConfig[task.priority as keyof typeof priorityConfig] ??
    priorityConfig.medium;

  return (
    <Link href={`/tasks/${task.id}`}>
      <Card className="hover:bg-muted/50 transition-colors">
        <CardContent className="flex items-center gap-4 p-4">
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <p className="truncate font-medium">{task.title}</p>
            {task.description && (
              <p className="text-muted-foreground line-clamp-1 text-sm">
                {task.description}
              </p>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-3">
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
    </Link>
  );
};

export { TaskCard };

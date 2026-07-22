"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createTaskSchema,
  TASK_PRIORITIES,
  type CreateTaskType,
} from "@/lib/zodSchema";
import { createTask, updateTask } from "@/server/taskActions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Loader2Icon, SaveIcon } from "lucide-react";
import { DatePicker } from "@/components/DatePicker";
import { Button } from "@/components/shadcnui/button";
import { Field, FieldError, FieldLabel } from "@/components/shadcnui/field";
import { Input } from "@/components/shadcnui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/shadcnui/select";
import type { TaskData } from "@/lib/zodSchema";

type TaskFormProps = {
  task?: TaskData;
};

const TaskForm = ({ task }: TaskFormProps) => {
  const { replace } = useRouter();
  const isEdit = !!task;

  const {
    handleSubmit,
    control,
    formState: { isSubmitting, isValid },
  } = useForm<CreateTaskType>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: task?.title ?? "",
      description: task?.description ?? "",
      priority: (task?.priority as CreateTaskType["priority"]) ?? "medium",
      dueDate:
        task?.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : "",
    },
    mode: "all",
  });

  const onSubmit = async (data: CreateTaskType) => {
    try {
      if (isEdit && task) {
        await updateTask(task.id, data);
        toast.success("Task updated!");
        replace(`/tasks/${task.id}`);
      } else {
        await createTask(data);
        toast.success("Task created!");
        replace("/tasks");
      }
    } catch {
      toast.error(`Failed to ${isEdit ? "update" : "create"} task.`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-6"
      noValidate>
      <Controller
        name="title"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Title</FieldLabel>
            <Input
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid}
              placeholder="Enter task title"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="description"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Description</FieldLabel>
            <Input
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid}
              placeholder="Enter description (optional)"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <Controller
          name="priority"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Priority</FieldLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}>
                <SelectTrigger
                  id={field.name}
                  aria-invalid={fieldState.invalid}>
                  <span className="flex flex-1 text-left">
                    {field.value.charAt(0).toUpperCase() + field.value.slice(1)}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  {TASK_PRIORITIES.map((p) => (
                    <SelectItem
                      key={p}
                      value={p}>
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="dueDate"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Due date</FieldLabel>
              <DatePicker
                value={field.value ?? ""}
                onChange={field.onChange}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>

      <Button
        className="w-full"
        type="submit"
        disabled={isSubmitting || !isValid}>
        {isSubmitting ?
          <>
            <Loader2Icon className="animate-spin" />
            {isEdit ? "Saving..." : "Creating..."}
          </>
        : <>
            <SaveIcon />
            {isEdit ? "Save changes" : "Create task"}
          </>
        }
      </Button>
    </form>
  );
};

export { TaskForm };

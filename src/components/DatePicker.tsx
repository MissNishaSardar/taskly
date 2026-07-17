"use client";

import { useState, useCallback } from "react";
import { format, isValid, parse } from "date-fns";
import { CalendarIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants, Button } from "@/components/shadcnui/button";
import { Calendar } from "@/components/shadcnui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/shadcnui/popover";
import { Input } from "@/components/shadcnui/input";

type DatePickerProps = {
  value: string;
  onChange: (value: string) => void;
};

const DatePicker = ({ value, onChange }: DatePickerProps) => {
  const [open, setOpen] = useState(false);

  const parsedDate =
    value ? parse(value, "yyyy-MM-dd'T'HH:mm", new Date()) : undefined;
  const date = parsedDate && isValid(parsedDate) ? parsedDate : undefined;
  const time = date ? format(date, "HH:mm") : "";

  const handleSelectDate = useCallback(
    (day: Date | undefined) => {
      if (!day) {
        onChange("");
        return;
      }
      if (time) {
        const [hours, minutes] = time.split(":");
        const merged = new Date(day);
        merged.setHours(
          Number.parseInt(hours, 10),
          Number.parseInt(minutes, 10),
          0,
          0,
        );
        onChange(format(merged, "yyyy-MM-dd'T'HH:mm"));
      } else {
        onChange(format(day, "yyyy-MM-dd'T'HH:mm"));
      }
    },
    [time, onChange],
  );

  const handleTimeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newTime = e.target.value;
      if (date && newTime) {
        const [hours, minutes] = newTime.split(":");
        const merged = new Date(date);
        merged.setHours(
          Number.parseInt(hours, 10),
          Number.parseInt(minutes, 10),
          0,
          0,
        );
        onChange(format(merged, "yyyy-MM-dd'T'HH:mm"));
      }
    },
    [date, onChange],
  );

  const handleClear = useCallback(() => {
    onChange("");
    setOpen(false);
  }, [onChange]);

  const displayText =
    date ? format(date, "MMM d, yyyy HH:mm") : "Pick a date and time";

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}>
      <PopoverTrigger
        className={cn(
          buttonVariants({ variant: "outline" }),
          "w-full justify-start gap-2",
          !date && "text-muted-foreground",
        )}>
        <CalendarIcon className="size-4" />
        <span>{displayText}</span>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelectDate}
        />
        <div className="flex items-center gap-3 pt-3">
          <span className="text-muted-foreground text-sm">Time</span>
          <Input
            type="time"
            value={time}
            onChange={handleTimeChange}
            className="flex-1"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="shrink-0">
            <XIcon />
            Clear
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export { DatePicker };

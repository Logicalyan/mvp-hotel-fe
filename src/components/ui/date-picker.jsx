"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function DatePicker({ selected, onSelect, placeholder }) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="w-full text-left border rounded-md p-3"
          onClick={() => setOpen(true)}
        >
          {selected ? format(selected, "PPP") : placeholder}
        </button>
      </PopoverTrigger>

      <PopoverContent className="p-0">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={(value) => {
            onSelect(value)
            setOpen(false)
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}

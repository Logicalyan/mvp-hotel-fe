"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { X, Plus } from "lucide-react"
import { Button } from "../ui/button"

export default function FacilitiesField({ facilities, value = [], onChange }) {
    const [customFacility, setCustomFacility] = useState("")

    const toggleFacility = (facility) => {
        if (value.includes(facility)) {
            onChange(value.filter((f) => f !== facility))
        } else {
            onChange([...value, facility])
        }
    }

    const addCustomFacility = () => {
        if (customFacility.trim() && !value.includes(customFacility)) {
            onChange([...value, customFacility.trim()])
            setCustomFacility("")
        }
    }

    return (
        <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
                {facilities.map((f) => {
                    const selected = value.includes(String(f.id))
                    return (
                        <Badge
                            key={f.id}
                            variant={selected ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => toggleFacility(String(f.id))}
                        >
                            {f.name}
                            {selected && <X className="ml-1 h-3 w-3" />}
                        </Badge>
                    )
                })}
            </div>

            {/* Custom facility input */}
            <div className="flex gap-2 items-center">
                <Input
                    placeholder="Add new facility"
                    value={customFacility}
                    onChange={(e) => setCustomFacility(e.target.value)}
                />
                <Button
                    type="button"
                    onClick={addCustomFacility}
                    className="p-2 rounded"
                    variant="outline"
                >
                    <Plus className="w-4 h-4" />
                </Button>
            </div>

            {/* Show selected facilities (existing + custom) */}
            <div className="flex flex-wrap gap-2">
                {value.map((f, idx) => (
                    <Badge key={idx} variant="secondary">
                        {f}
                        <X
                            className="ml-1 h-3 w-3 cursor-pointer"
                            onClick={() => toggleFacility(f)}
                        />
                    </Badge>
                ))}
            </div>
        </div>
    )
}

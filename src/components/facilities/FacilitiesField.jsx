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
        if (customFacility.trim() && !value.includes(customFacility.trim())) {
            onChange([...value, customFacility.trim()])
            setCustomFacility("")
        }
    }

    return (
        <div className="space-y-2">
            {/* Pilihan facilities bawaan */}
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

            {/* Input custom facility */}
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
            <div className="flex flex-wrap gap-2 mt-2">
                {value.map((f, idx) => {
                    // cek apakah facility bawaan (id) atau custom string
                    const found = facilities.find((fa) => String(fa.id) === String(f))
                    const label = found ? found.name : f

                    return (
                        <Badge
                            key={idx}
                            variant="secondary"
                            className="flex items-center gap-1 pr-1"
                        >
                            {label}
                            <button
                                type="button"
                                onClick={() => onChange(value.filter((v) => v !== f))}
                                className="ml-1 cursor-pointer"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>

                    )
                })}
            </div>


        </div>
    )
}

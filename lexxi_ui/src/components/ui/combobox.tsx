"use client"

import * as React from "react"
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export interface ComboboxOption {
  value: string
  label: string
}

interface ComboboxProps {
  options: ComboboxOption[]
  value: string
  onChange: (value: string) => void
  onAddNew?: (value: string) => void
  placeholder?: string
  emptyText?: string
  className?: string
  displayValue?: (value: string) => string
}

export function Combobox({
  options,
  value,
  onChange,
  onAddNew,
  placeholder = "Select option...",
  emptyText = "No option found.",
  className,
  displayValue,
  optionKey = 'id',
  optionLabel = 'name',
}: ComboboxProps & { optionKey?: string, optionLabel?: string }) {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")

  const filteredOptions = React.useMemo(() => {
    return options.filter((option: any) =>
      option[optionLabel]?.toLowerCase()?.includes(searchQuery.toLowerCase())
    )
  }, [options, searchQuery, optionLabel])

  const handleSelect = (selectedValue: string) => {
    const selectedOption = options.find((option: any) => option[optionKey] === selectedValue)
    if (selectedOption) {
      onChange(selectedOption[optionKey])
    } else if (onAddNew) {
      onAddNew(searchQuery)
    }
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          {value 
            ? options.find((option: any) => option[optionKey] === value)?.[optionLabel] || value
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput 
            placeholder={`Search ${placeholder.toLowerCase()}...`} 
            onValueChange={(value) => {
              setSearchQuery(value)
              onChange(value)
            }}
          />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {filteredOptions.map((option: any) => (
                <CommandItem
                  key={option[optionKey]}
                  value={option[optionKey]}
                  onSelect={handleSelect}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option[optionKey] ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option[optionLabel]}
                </CommandItem>
              ))}
            </CommandGroup>
            {onAddNew && searchQuery && !filteredOptions.length && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => handleSelect(searchQuery)}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add "{searchQuery}"
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormPopoverProps {
  triggerText: string;
  labelText: string;
  placeholderText: string;
  onSubmit: (value: string) => void;
}

export function FormPopover({ triggerText, labelText, placeholderText, onSubmit }: FormPopoverProps) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSubmit(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">{triggerText}</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <form onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="input-value">{labelText}</Label>
            <Input
              id="input-value"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={placeholderText}
            />
          </div>
          <Button type="submit" className="mt-2">Add</Button>
        </form>
      </PopoverContent>
    </Popover>
  );
}
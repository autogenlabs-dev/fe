import * as React from "react";
import { cn } from "@/lib/utils";

import { Check, X, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

function MultiSelect({
  options,
  selected,
  onChange,
  placeholder,
  className,
  ...props
}) {
  const [open, setOpen] = React.useState(false);

  const handleUnselect = (item) => {
    onChange(selected.filter((i) => i !== item));
  };
  const handleSelectAll = () => {
    if (selected.length === options.length) {
      onChange([]); // Unselect all if all options are selected
    } else {
      onChange(options.map((option) => option.id)); // Select all if not all options are selected
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen} {...props}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          // className={`w-full justify-between ${
          //   selected.length > 1 ? "h-full" : "h-10"
          // }`}
          className={`w-[360px] justify-between h-auto `}
          onClick={() => setOpen(!open)}
        >
          <div className="flex gap-1 flex-wrap">
            {selected.length > 0
              ? selected.map((item) => (
                  <Badge
                    variant="primary"
                    key={item}
                    className="mr-1 mb-1 bg-main text-primary-foreground hover:bg-main/90"
                    onClick={() => handleUnselect(item)}
                  >
                    {options.find((option) => item === option.id)?.name}
                    <div
                      className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleUnselect(item);
                        }
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onClick={() => handleUnselect(item)}
                    >
                      <X className="h-3 w-3 text-white hover:text-foreground " />
                    </div>
                  </Badge>
                ))
              : placeholder}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 z-[9999]">
        <Command className={className}>
          <CommandInput placeholder="Search ..." />
          <CommandEmpty>No item found.</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-auto">
            <CommandItem onSelect={handleSelectAll}>
              <Check
                className={cn(
                  "mr-2 h-4 w-4",
                  selected.length === options.length
                    ? "opacity-100"
                    : "opacity-0"
                )}
              />
              Select All
            </CommandItem>
            {options.map((option) => (
              <CommandItem
                key={option.id}
                onSelect={() => {
                  onChange(
                    selected.includes(option.id)
                      ? selected.filter((item) => item !== option.id)
                      : [...selected, option.id]
                  );
                  setOpen(true);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selected.includes(option.id) ? "opacity-100" : "opacity-0"
                  )}
                />
                {option.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export { MultiSelect };

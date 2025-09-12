"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { useBoards } from "../hooks";

type Props = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export function AddMembersDialog({ isOpen, setIsOpen }: Props) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const [tableParams, setTableParams] = useState({
    page: 1,
    limit: 10,
    search: "",
  });

  const { useUserList } = useBoards();
  const { data } = useUserList({
    search: tableParams.search,
    page: tableParams.page,
    limit: tableParams.limit,
    enabled: isOpen,
  });

  const frameworks = [
    {
      value: "next.js",
      label: "Next.js",
    },
    {
      value: "sveltekit",
      label: "SvelteKit",
    },
    {
      value: "nuxt.js",
      label: "Nuxt.js",
    },
    {
      value: "remix",
      label: "Remix",
    },
    {
      value: "astro",
      label: "Astro",
    },
  ];
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          size={"sm"}
          className="shadow-sm bg-amber-600 rounded hover:bg-amber-700 text-white text-xs"
        >
          Add Project Member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl">Add New Project Member</DialogTitle>
          <DialogDescription>
            Fill out the details below to add new project member
          </DialogDescription>
          <Separator />
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="member"
              className="text-sm font-medium flex items-center gap-1"
            >
              Member Name
            </Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="justify-between"
                >
                  {value
                    ? frameworks.find((framework) => framework.value === value)
                        ?.label
                    : "Select framework..."}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput
                    placeholder="Search framework..."
                    className="h-9"
                  />
                  <CommandList>
                    <CommandEmpty>No framework found.</CommandEmpty>
                    <CommandGroup>
                      {frameworks.map((framework) => (
                        <CommandItem
                          key={framework.value}
                          value={framework.value}
                          onSelect={(currentValue) => {
                            setValue(
                              currentValue === value ? "" : currentValue
                            );
                            setOpen(false);
                          }}
                        >
                          {framework.label}
                          <Check
                            className={cn(
                              "ml-auto",
                              value === framework.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <Separator />

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            onClick={() => setIsOpen(false)}
            // disabled={isLoading}
            variant="outline"
            className="flex-1 sm:flex-none"
          >
            Cancel
          </Button>
          <Button
            // disabled={isLoading}
            // onClick={onSubmit}
            className="flex-1 sm:flex-none shadow-sm"
          >
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

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
import { toast } from "sonner";
import { AxiosErrorType, handleApiError } from "@/app/axios/axios-error";
import { ActiveBoardT } from "@/app/(auth)/types";

type Props = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  active_board: ActiveBoardT;
};

export function AddMembersDialog({ isOpen, setIsOpen, active_board }: Props) {
  const { addBoardMemberMutation } = useBoards();
  const { mutateAsync: addMemberAction, isPending } = addBoardMemberMutation;
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [search, setSearch] = useState("");
  const [tableParams] = useState({
    page: 1,
    limit: 5,
  });

  const { useUserList } = useBoards();
  const { data } = useUserList({
    search: search,
    page: tableParams.page,
    limit: tableParams.limit,
    enabled: isOpen,
  });

  const displaySelectedName = (value: string) => {
    const user = data?.data.users.find((user) => user.id === value);
    if (!user) {
      return "No user Found";
    }

    return `${user.first_name} ${user.middle_name || ""} ${user.last_name}`
      .trim()
      .replace(/\s+/g, " ");
  };

  const handleSubmit = async () => {
    if (!value || !active_board) return toast.error("Invalid data");
    try {
      await addMemberAction(
        {
          user_id: value,
          board_id: active_board?.id,
        },
        {
          onSuccess: () => {
            toast.success("Board member added successfully!");
            setValue("");
            setSearch("");
            setIsOpen(false);
          },
        }
      );
    } catch (err) {
      handleApiError(err as AxiosErrorType);
    }
  };

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
                  {value ? displaySelectedName(value) : "Select user..."}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[250px] p-0">
                <Command shouldFilter={false}>
                  <CommandInput
                    placeholder="Search user..."
                    className="h-9"
                    onValueChange={setSearch} // Update search state directly
                  />
                  <CommandList>
                    <CommandEmpty>No user found.</CommandEmpty>
                    <CommandGroup>
                      {data?.data.users?.map((user) => (
                        <CommandItem
                          key={user.id}
                          value={user.id}
                          onSelect={(currentValue) => {
                            setValue(
                              currentValue === value ? "" : currentValue
                            );
                            setOpen(false);
                          }}
                        >
                          {user.first_name} {user.last_name}
                          <Check
                            className={cn(
                              "ml-auto",
                              value === user.id ? "opacity-100" : "opacity-0"
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
            disabled={isPending}
            variant="outline"
            className="flex-1 sm:flex-none"
          >
            Cancel
          </Button>
          <Button
            disabled={isPending}
            onClick={handleSubmit}
            className="flex-1 sm:flex-none shadow-sm"
          >
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

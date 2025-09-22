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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

type Props = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: () => void;
  isLoading: boolean;
};

export function AddNewProjectDialog({
  isOpen,
  setIsOpen,
  title,
  setTitle,
  onSubmit,
  isLoading,
}: Props) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          size={"sm"}
          className="shadow-sm bg-green-600 rounded hover:bg-green-700 text-white text-xs"
        >
          Add New Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl">
            Create New Project Board
          </DialogTitle>
          <DialogDescription>
            Fill out the details below to create a new task name for your
            project.
          </DialogDescription>
          <Separator />
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Task Details Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="title"
                className="text-sm font-medium flex items-center gap-1"
              >
                Project title
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a clear, descriptive title..."
                className="h-10"
              />
            </div>
          </div>
        </div>

        <Separator />

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
            variant="outline"
            className="flex-1 sm:flex-none"
          >
            Cancel
          </Button>
          <Button
            disabled={isLoading}
            onClick={onSubmit}
            className="flex-1 sm:flex-none shadow-sm"
          >
            {isLoading ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useState } from "react";
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

export function AddNewProjectDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");

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
          <Button variant="outline" className="flex-1 sm:flex-none">
            Cancel
          </Button>
          <Button className="flex-1 sm:flex-none shadow-sm">Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

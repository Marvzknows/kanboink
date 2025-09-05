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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { prioritiesOptions, taskLists } from "./types";

interface AddNewTaskDialogProps {
  onTaskAdd?: (task: {
    title: string;
    description?: string;
    listName: string;
    priority?: string;
    assignee?: string;
  }) => void;
}

export function AddNewTaskDialog({ onTaskAdd }: AddNewTaskDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedAssignee, setSelectedAssignee] = useState<string>(" ");
  const [selectedList, setSelectedList] = useState<string>(" ");
  const [prioLevel, setPrioLevel] = useState<string>(" ");

  const assignees = [
    { name: "Clark Kent", value: "clark-kent" },
    { name: "Lex Luthor", value: "lex-luthor" },
    { name: "Diana Prince", value: "diana-prince" },
    { name: "Bruce Wayne", value: "bruce-wayne" },
  ];

  const handleSubmit = () => {
    if (!title.trim() || !selectedList) return;

    const newTask = {
      title: title.trim(),
      description: description.trim(),
      listName: selectedList,
      priority: prioLevel || undefined,
      assignee: selectedAssignee || undefined,
    };

    onTaskAdd?.(newTask);
    handleReset();
  };

  const handleReset = () => {
    setTitle("");
    setDescription("");
    setSelectedList("");
    setPrioLevel("");
    setSelectedAssignee("");
    setIsOpen(false);
  };

  const isFormValid = title.trim() && selectedList;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size={"sm"}
          variant="secondary"
          className="shadow-sm rounded text-xs"
        >
          Add New Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl">Create New Task</DialogTitle>
          <DialogDescription>
            Fill out the details below to create a new task for your project.
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
                Task Title
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

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description
                <span className="text-muted-foreground text-xs ml-1">
                  (optional)
                </span>
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add any additional details or context..."
                rows={3}
                className="resize-none"
              />
            </div>
          </div>

          <Separator />

          {/* Assignment Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Task Assignment
            </h4>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="list"
                  className="text-sm font-medium flex items-center gap-1"
                >
                  List
                  <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={selectedList}
                  onValueChange={(val) => setSelectedList(val)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a list..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={" "}>--</SelectItem>
                    {taskLists.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority" className="text-sm font-medium">
                  Priority
                  <span className="text-muted-foreground text-xs ml-1">
                    (optional)
                  </span>
                </Label>
                <Select
                  value={prioLevel}
                  onValueChange={(val) => setPrioLevel(val)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Set priority level..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={" "}>--</SelectItem>
                    {prioritiesOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="assignee" className="text-sm font-medium">
                  Assignee
                  <span className="text-muted-foreground text-xs ml-1">
                    (optional)
                  </span>
                </Label>
                <Select
                  value={selectedAssignee}
                  onValueChange={(val) => setSelectedAssignee(val)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Assign to team member..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={" "}>--</SelectItem>
                    {assignees.map((person) => (
                      <SelectItem key={person.value} value={person.value}>
                        {person.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={handleReset}
            className="flex-1 sm:flex-none"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isFormValid}
            className="flex-1 sm:flex-none shadow-sm"
          >
            Create Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

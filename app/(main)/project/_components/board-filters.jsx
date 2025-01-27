"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import React, { useEffect, useState } from "react";

const priorities = ["LOW", "MEDIUM", "HIGH", "URGENT"];

const BoardFilters = ({ issues, onFilterChange }) => {
  const [searchItem, setSearchItem] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [selectedAssignees, setSelectedAssignees] = useState([]);

  const assignees = issues
    .map((issue) => issue.assignee)
    .filter(
      (item, index, self) => index === self.findIndex((t) => t.id === item.id)
    );

  const clearFilters = () => {
    setSearchItem("");
    setSelectedPriority("");
    setSelectedAssignees([]);
  };

  useEffect(() => {
    const filteredIssues = issues.filter(
      (issue) =>
        issue.title.toLowerCase().includes(searchItem.toLowerCase()) &&
        (selectedAssignees.length === 0 ||
          selectedAssignees.includes(issue.assignee?.id)) &&
        (selectedPriority === "" || issue.priority === selectedPriority)
    );

    onFilterChange(filteredIssues);
  }, [searchItem, selectedAssignees, selectedPriority, issues]);

  const toggleAssignee = (assigneeId) => {
    setSelectedAssignees((prev) =>
      prev.includes(assigneeId)
        ? prev.filter((id) => id !== assigneeId)
        : [...prev, assigneeId]
    );
  };

  const isFiltersApplied =
    searchItem !== "" ||
    selectedPriority !== "" ||
    selectedAssignees.length > 0;

  return (
    <div>
      <div className="flex flex-col pr-2 sm:flex-row gap-4 sm:gap-6 mt-6">
        <Input
          className="w-full sm:w-72"
          placeholder="Search issue..."
          value={searchItem}
          onChange={(e) => setSearchItem(e.target.value)}
        />
        <div className="flex-shrink-0 ">
          <div className="flex gap-2 flex-wrap">
            {assignees.map((assignee, i) => {
              const selected = selectedAssignees.includes(assignee.id);
              return (
                <div
                  key={assignee.id}
                  className={`rounded-full ring ${
                    selected ? "ring-blue-600" : "ring-black"
                  } ${i > 0 ? "-ml-6" : ""}`}
                  style={{ zIndex: i }}
                  onClick={() => toggleAssignee(assignee.id)}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={assignee.imageUrl} alt={assignee.name} />
                    <AvatarFallback>{assignee.name[0]}</AvatarFallback>
                  </Avatar>
                </div>
              );
            })}
          </div>
        </div>
        <Select value={selectedPriority} onValueChange={setSelectedPriority}>
          <SelectTrigger className="w-full sm:w-52">
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            {priorities.map((priority) => (
              <SelectItem key={priority} value={priority}>
                {priority}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {isFiltersApplied && (
          <Button
            variant="ghost"
            onClick={clearFilters}
            className="flex items-center"
          >
            <X className="h-4 w-4" /> Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
};

export default BoardFilters;

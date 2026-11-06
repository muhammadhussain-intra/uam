
"use client";

import { Search, CalendarDays, RotateCcw } from "lucide-react";

import TextField from "@/components/ui/TextField";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";

import {
  userRoleOptions,
  userStatusOptions,
} from "../users.constants";

import type { UsersFilterValues } from "../users.schema";

interface UserFiltersProps {
  filters: UsersFilterValues;
  onChange: (filters: UsersFilterValues) => void;
  onReset: () => void;
}

export default function UserFilters({
  filters,
  onChange,
  onReset,
}: UserFiltersProps) {
  function handleChange(
    field: keyof UsersFilterValues,
    value: string,
  ) {
    onChange({
      ...filters,
      [field]: value,
    });
  }

  return (
    <section className="rounded-xl border border-border-default bg-white p-4 shadow-card sm:p-5">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-text-primary">
          Filters
        </h2>
        <p className="mt-1 text-xs text-text-secondary">
          Search and filter users by different criteria.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {/* Search */}
        <div className="xl:col-span-2">
          <TextField
            label="Search Users"
            placeholder="Search by name, email or ID..."
            value={filters.search}
            onChange={(event) =>
              handleChange("search", event.target.value)
            }
            leftIcon={<Search size={17} />}
            inputSize="md"
          />
        </div>

        {/* Role */}
        <Select
          label="Role"
          value={filters.role}
          onChange={(event) =>
            handleChange("role", event.target.value)
          }
          options={userRoleOptions}
        />

        {/* Status */}
        <Select
          label="Status"
          value={filters.status}
          onChange={(event) =>
            handleChange("status", event.target.value)
          }
          options={userStatusOptions}
        />

        {/* From Date */}
        <TextField
          label="From Date"
          type="date"
          value={filters.fromDate}
          onChange={(event) =>
            handleChange("fromDate", event.target.value)
          }
          inputSize="md"
          leftIcon={<CalendarDays size={16} />}
        />

        {/* To Date */}
        <TextField
          label="To Date"
          type="date"
          value={filters.toDate}
          min={filters.fromDate || undefined}
          onChange={(event) =>
            handleChange("toDate", event.target.value)
          }
          inputSize="md"
          leftIcon={<CalendarDays size={16} />}
        />
      </div>

      <div className="mt-4 flex justify-end">
        <Button
          variant="outline"
          size="sm"
          leftIcon={<RotateCcw size={15} />}
          onClick={onReset}
        >
          Reset Filters
        </Button>
      </div>
    </section>
  );
}

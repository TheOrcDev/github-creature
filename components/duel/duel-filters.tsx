"use client";

import { Cancel01Icon, Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQueryStates } from "nuqs";
import { useTransition } from "react";

import {
  duelSearchParams,
  POWER_LEVEL_RANGES,
  SORT_OPTIONS,
  type PowerLevelRange,
  type SortOption,
} from "@/app/duel/search-params";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type DuelFiltersProps = {
  totalCount: number;
  currentCount: number;
};

export default function DuelFilters({
  totalCount,
  currentCount,
}: DuelFiltersProps) {
  const [isPending, startTransition] = useTransition();
  const [params, setParams] = useQueryStates(duelSearchParams, {
    shallow: false,
    startTransition,
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParams({ search: e.target.value, page: 1 });
  };

  const handlePowerChange = (value: PowerLevelRange | null) => {
    if (value) {
      setParams({ power: value, page: 1 });
    }
  };

  const handleSortChange = (value: SortOption | null) => {
    if (value) {
      setParams({ sort: value, page: 1 });
    }
  };

  const handleClearFilters = () => {
    setParams({
      search: "",
      power: "all",
      sort: "powerLevel",
      page: 1,
    });
  };

  const hasActiveFilters =
    params.search !== "" ||
    params.power !== "all" ||
    params.sort !== "powerLevel";

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        {/* Search input */}
        <div className="relative flex-1 w-full sm:max-w-xs">
          <HugeiconsIcon
            icon={Search01Icon}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
          />
          <Input
            type="text"
            placeholder="Search by GitHub username..."
            value={params.search}
            onChange={handleSearchChange}
            className="pl-8"
          />
        </div>

        {/* Power level filter */}
        <Select value={params.power} onValueChange={handlePowerChange}>
          <SelectTrigger className="w-full sm:w-auto min-w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(POWER_LEVEL_RANGES) as PowerLevelRange[]).map(
              (key) => (
                <SelectItem key={key} value={key}>
                  {POWER_LEVEL_RANGES[key].label}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>

        {/* Sort dropdown */}
        <Select value={params.sort} onValueChange={handleSortChange}>
          <SelectTrigger className="w-full sm:w-auto min-w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(SORT_OPTIONS) as SortOption[]).map((key) => (
              <SelectItem key={key} value={key}>
                {SORT_OPTIONS[key].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Clear filters button */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="gap-1.5"
          >
            <HugeiconsIcon icon={Cancel01Icon} className="w-4 h-4" />
            Clear
          </Button>
        )}
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Showing {currentCount} of {totalCount} creatures
          {isPending && " (loading...)"}
        </span>
      </div>
    </div>
  );
}

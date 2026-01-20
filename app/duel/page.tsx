import { Metadata } from "next";
import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";

import DuelArena from "@/components/duel/duel-arena";
import DuelFilters from "@/components/duel/duel-filters";
import DuelPagination from "@/components/duel/duel-pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { getFilteredCreatures } from "@/server/creatures";

import {
  CREATURES_PER_PAGE,
  duelSearchParamsCache,
  POWER_LEVEL_RANGES,
  SORT_OPTIONS,
} from "./search-params";

export const metadata: Metadata = {
  title: "GitHub Creature - Duel Arena",
  description:
    "Select your creatures and battle against opponents in the duel arena!",
};

function DuelSkeleton() {
  return (
    <div className="w-full space-y-6">
      <Skeleton className="h-8 w-64 mx-auto" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array.from({ length: 10 }, (_, index) => (
          <Skeleton key={index} className="aspect-square rounded-lg" />
        ))}
      </div>
    </div>
  );
}

type DuelPageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function DuelPage({ searchParams }: DuelPageProps) {
  const params = await duelSearchParamsCache.parse(searchParams);
  const powerRange = POWER_LEVEL_RANGES[params.power];
  const sortOption = SORT_OPTIONS[params.sort];

  const result = await getFilteredCreatures({
    search: params.search,
    powerMin: powerRange.min,
    powerMax: powerRange.max,
    sortField: sortOption.field as
      | "powerLevel"
      | "contributions"
      | "followers"
      | "stars",
    sortDirection: sortOption.direction as "asc" | "desc",
    page: params.page,
    limit: CREATURES_PER_PAGE,
  });

  return (
    <main className="flex flex-col items-center justify-start min-h-screen gap-6 max-w-7xl mx-auto px-4 py-10 w-full mt-20">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Duel Arena</h1>
        <p className="text-muted-foreground">
          Select 3 creatures to battle against matched opponents
        </p>
      </div>

      <DuelFilters
        totalCount={result.totalCount}
        currentCount={result.creatures.length}
      />

      <Suspense fallback={<DuelSkeleton />}>
        <DuelArena creatures={result.creatures} />
      </Suspense>

      <DuelPagination totalCount={result.totalCount} />
    </main>
  );
}

"use client";

import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  MoreHorizontalIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQueryStates } from "nuqs";
import { useTransition } from "react";

import { duelSearchParams, CREATURES_PER_PAGE } from "@/app/duel/search-params";
import { Button } from "@/components/ui/button";

type DuelPaginationProps = {
  totalCount: number;
};

export default function DuelPagination({ totalCount }: DuelPaginationProps) {
  const [isPending, startTransition] = useTransition();
  const [params, setParams] = useQueryStates(duelSearchParams, {
    shallow: false,
    startTransition,
  });

  const totalPages = Math.ceil(totalCount / CREATURES_PER_PAGE);
  const currentPage = params.page;

  if (totalPages <= 1) {
    return null;
  }

  const handlePageChange = (page: number) => {
    setParams({ page });
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Generate page numbers to display
  const getPageNumbers = (): (number | "ellipsis")[] => {
    const pages: (number | "ellipsis")[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push("ellipsis");
      }

      // Show pages around current
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("ellipsis");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-1">
      {/* Previous button */}
      <Button
        variant="outline"
        size="icon-sm"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage <= 1 || isPending}
        aria-label="Previous page"
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} className="w-4 h-4" />
      </Button>

      {/* Page numbers */}
      <div className="flex items-center gap-1">
        {pageNumbers.map((page, index) => {
          if (page === "ellipsis") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-2 text-muted-foreground"
              >
                <HugeiconsIcon icon={MoreHorizontalIcon} className="w-4 h-4" />
              </span>
            );
          }

          const isCurrentPage = page === currentPage;
          return (
            <Button
              key={page}
              variant={isCurrentPage ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageChange(page)}
              disabled={isPending}
              aria-label={`Page ${page}`}
              aria-current={isCurrentPage ? "page" : undefined}
            >
              {page}
            </Button>
          );
        })}
      </div>

      {/* Next button */}
      <Button
        variant="outline"
        size="icon-sm"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= totalPages || isPending}
        aria-label="Next page"
      >
        <HugeiconsIcon icon={ArrowRight01Icon} className="w-4 h-4" />
      </Button>
    </div>
  );
}

"use client";

import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

import type { SelectCreature } from "@/db/schema";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type FeaturedCreaturesCarouselProps = {
  creatures: SelectCreature[];
};

export default function FeaturedCreaturesCarousel({
  creatures,
}: FeaturedCreaturesCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative group px-12">
      {/* Navigation Buttons - positioned outside */}
      <Button
        variant="outline"
        size="icon"
        className="absolute -left-6 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
        onClick={() => scroll("left")}
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} className="w-5 h-5" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute -right-6 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
        onClick={() => scroll("right")}
      >
        <HugeiconsIcon icon={ArrowRight01Icon} className="w-5 h-5" />
      </Button>

      {/* Carousel Container */}
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto scrollbar-hide scroll-smooth px-1 py-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {creatures.map((creature) => {
          const username = creature.githubProfileUrl.split("/").pop() || "";
          return (
            <Link
              key={creature.id}
              href={`/${username}`}
              className="flex-shrink-0 w-80 group/card"
            >
              <Card className="overflow-hidden border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={creature.image}
                    alt={creature.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover/card:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

                  {/* Featured Badge */}
                  <Badge className="absolute top-3 left-3 bg-primary/90 backdrop-blur-sm border-white/20 font-bold">
                    FEATURED
                  </Badge>

                  {/* Power Badge */}
                  <Badge className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white border-white/20 font-bold">
                    ⚡ {creature.powerLevel.toFixed(1)}
                  </Badge>
                </div>

                <CardContent className="p-5">
                  <h3 className="font-bold text-xl mb-3 leading-tight">
                    {creature.name}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      👥 {creature.followers.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      ⭐ {creature.stars.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      📊 {creature.contributions.toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Carousel Indicators */}
      <div className="flex justify-center gap-2 mt-4">
        {creatures.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              index === 0
                ? "bg-primary w-6"
                : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

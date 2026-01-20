import { Metadata } from "next";
import Link from "next/link";
import { Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FeaturedCreaturesCarousel from "@/components/featured-creatures-carousel";
import CreatureGridCard from "@/components/creature-grid-card";
import {
  getRandomCreatures,
  getCreaturesStats,
  getLeaderboard,
} from "@/server/creatures";

export const metadata: Metadata = {
  title: "Discover Creatures - GitHub Creature",
  description:
    "Explore the mystical beings forged from code and creativity. Search, filter, and discover creatures.",
};

export default async function CreaturesPage() {
  const creatures = await getRandomCreatures(20);
  const stats = await getCreaturesStats();
  const featuredCreatures = await getLeaderboard();

  return (
    <main className="min-h-screen w-full">
      {/* Hero Section with Search */}
      <section className="bg-muted/30 border-b px-4 py-16 text-center">
        <div className="mx-auto max-w-4xl space-y-6">
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight">
            Discover GitHub Creatures
          </h1>
          <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Explore the mystical beings forged from code and creativity. Search,
            filter, and discover your next favorite developer's creature.
          </p>

          {/* Search Bar */}
          <div className="mx-auto max-w-2xl flex gap-2">
            <div className="relative flex-1">
              <HugeiconsIcon
                icon={Search01Icon}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"
              />
              <Input
                placeholder="Search by creature name or username..."
                className="pl-10 h-12 text-base"
              />
            </div>
            <Button size="lg" className="h-12 px-8">
              Search
            </Button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 space-y-12">
        {/* Featured Creatures Carousel */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="text-3xl font-bold flex items-center gap-2">
              ⭐ Featured Creatures
            </h2>
            <Link
              href="/leaderboard"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors underline"
            >
              View all featured →
            </Link>
          </div>
          <FeaturedCreaturesCarousel creatures={featuredCreatures} />
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Creatures
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.totalCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg Power Level
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.averagePowerLevel}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                New This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">47</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Top Contributor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold truncate">
                {stats.topContributor
                  ? stats.topContributor.githubProfileUrl.split("/").pop()
                  : "N/A"}
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Tabs Navigation */}
        <section className="space-y-6">
          <div className="border-b flex gap-0 overflow-x-auto">
            <button className="px-6 py-3 border-b-2 border-primary font-semibold whitespace-nowrap">
              All Creatures ({stats.totalCount})
            </button>
            <button className="px-6 py-3 border-b-2 border-transparent hover:border-muted-foreground/50 text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">
              Top Power (100)
            </button>
            <button className="px-6 py-3 border-b-2 border-transparent hover:border-muted-foreground/50 text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">
              Recent (50)
            </button>
            <button className="px-6 py-3 border-b-2 border-transparent hover:border-muted-foreground/50 text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">
              Most Active (75)
            </button>
          </div>

          {/* Content Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="text-lg font-semibold">
              Showing {creatures.length} of {stats.totalCount} creatures
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Sort:</label>
                <Select defaultValue="powerLevel">
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="powerLevel">
                      Power Level (High to Low)
                    </SelectItem>
                    <SelectItem value="recent">Recent</SelectItem>
                    <SelectItem value="contributions">Contributions</SelectItem>
                    <SelectItem value="followers">Followers</SelectItem>
                    <SelectItem value="stars">Stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Filter:</label>
                <Select defaultValue="all">
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="legendary">Legendary (9-10)</SelectItem>
                    <SelectItem value="advanced">Advanced (6-8)</SelectItem>
                    <SelectItem value="intermediate">
                      Intermediate (3-5)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Creatures Grid */}
          {creatures.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {creatures.map((creature) => (
                <CreatureGridCard key={creature.id} creature={creature} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">
                  No creatures found. Try adjusting your filters.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2 pt-6">
            <Button variant="outline" size="sm" disabled>
              ← Prev
            </Button>
            <Button variant="default" size="sm">
              1
            </Button>
            <Button variant="outline" size="sm">
              2
            </Button>
            <Button variant="outline" size="sm">
              3
            </Button>
            <span className="px-2">...</span>
            <Button variant="outline" size="sm">
              40
            </Button>
            <Button variant="outline" size="sm">
              Next →
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}

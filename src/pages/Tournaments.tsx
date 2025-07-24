import {
  Trophy,
  Calendar,
  Users,
  MapPin,
  Clock,
  Award,
  Target,
} from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

// Types
interface Category {
  _id: string;
  name: string;
  icon?: string;
}

interface MenuItem {
  _id: string;
  name: string;
  icon: string;
}

interface Tournament {
  _id: string;
  name: string;
  description: string;
  date: string;
  format: string;
  teams: number;
  location: string;
  entryFee: string;
  prizePool: string;
  winner?: string;
  runnerUp?: string;
  totalTeams?: number;
  highlights?: string;
}

const Tournaments = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState<string>("");
  const [menuItemId, setMenuItemId] = useState<string>("");
  const [categoryTournaments, setCategoryTournaments] = useState<{
    [categoryId: string]: Tournament[];
  }>({});

  useEffect(() => {
    async function fetchMenuAndCategories() {
      try {
        const res = await fetch("http://localhost:4000/api/menuitems");
        const data = await res.json();

        const tournamentMenu = (data.menuItems as MenuItem[]).find(
          (item) => item.name.toLowerCase().trim() === "tournaments"
        );

        if (tournamentMenu) {
          setMenuItemId(tournamentMenu._id);

          const catRes = await fetch(
            `http://localhost:4000/api/categories/menuitem/${tournamentMenu._id}`
          );
          const catData = await catRes.json();

          const limited = (catData.categories as Category[]).filter(
            (cat) => cat && cat._id && cat.name
          );

          setCategories(limited);
          if (limited.length > 0) {
            setActiveTab(limited[0]._id);
            fetchTournamentsForCategories(limited);
          }
        }
      } catch (err) {
        console.error("Error fetching menu or categories", err);
      }
    }

    async function fetchTournamentsForCategories(cats: Category[]) {
      const newCategoryTournaments: {
        [categoryId: string]: Tournament[];
      } = {};

      await Promise.all(
        cats.map(async (cat) => {
          try {
            const res = await fetch(
              `http://localhost:4000/api/tournaments/category/${cat._id}`
            );
            const data = await res.json();
            newCategoryTournaments[cat._id] = data.tournaments || [];
          } catch (err) {
            console.error(`Error fetching tournaments for ${cat.name}`, err);
            newCategoryTournaments[cat._id] = [];
          }
        })
      );

      setCategoryTournaments(newCategoryTournaments);
    }

    fetchMenuAndCategories();
  }, []);

  // ✅ Fixed useEffect: only depends on activeTab
  useEffect(() => {
    async function fetchTournamentsIfNeeded() {
      if (!activeTab || categoryTournaments[activeTab]) return;

      try {
        console.log("Fetching tournaments for tab:", activeTab);
        const res = await fetch(
          `http://localhost:4000/api/tournaments/category/${activeTab}`
        );
        const data = await res.json();
        setCategoryTournaments((prev) => ({
          ...prev,
          [activeTab]: data.tournaments || [],
        }));
      } catch (err) {
        console.error(`Error fetching tournaments for tab ${activeTab}`, err);
      }
    }

    fetchTournamentsIfNeeded();
  }, [activeTab]);

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function renderTabContent(tabId: string) {
    const cat = categories.find((c) => c._id === tabId);
    if (!cat) return null;

    const tournaments = categoryTournaments[tabId] || [];
    const name = cat.name.toLowerCase();

    // Optional debug
    console.log("Rendering Tab:", cat.name, tournaments);

    if (name.includes("upcoming")) {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {tournaments.length === 0 && (
            <p className="text-muted-foreground col-span-full text-center">
              No upcoming tournaments.
            </p>
          )}
          {tournaments.map((tournament) => (
            <Card key={tournament._id} className="service-card overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary to-accent text-white">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    Upcoming
                  </Badge>
                  <Trophy className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl">{tournament.name}</CardTitle>
                <CardDescription className="text-white/90">
                  {tournament.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>{formatDate(tournament.date)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>{tournament.format}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-primary" />
                    <span>{tournament.teams}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>{tournament.location}</span>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Prize Pool:</span>
                    <span className="text-2xl font-bold text-accent">
                      ₹{tournament.prizePool}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Registration Fee:
                    </span>
                    <span className="text-sm font-medium">
                      ₹{tournament.entryFee}
                    </span>
                  </div>
                </div>
                <Button className="w-full btn-hero">Register Team</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    } else if (name.includes("league")) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tournaments.length === 0 && (
            <p className="text-muted-foreground col-span-full text-center">
              No league tournaments available.
            </p>
          )}
          {tournaments.map((league) => (
            <Card key={league._id} className="service-card text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl">{league.name}</CardTitle>
                <Badge variant="outline" className="mx-auto">
                  {league.format}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Teams:</span>
                    <span className="font-medium">{league.teams}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Location:</span>
                    <span className="font-medium">{league.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span className="font-medium">
                      {formatDate(league.date)}
                    </span>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <div className="text-2xl font-bold text-primary mb-2">
                    ₹{league.entryFee}
                  </div>
                  <Button className="w-full" variant="outline">
                    Join League
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    } else if (name.includes("past")) {
      return (
        <div className="space-y-6">
          {tournaments.length === 0 && (
            <p className="text-muted-foreground text-center">
              No past tournaments available.
            </p>
          )}
          {tournaments.map((tournament) => (
            <Card key={tournament._id} className="service-card">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      {tournament.name}
                    </h3>
                    <p className="text-muted-foreground">
                      {formatDate(tournament.date)}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Trophy className="w-5 h-5 text-accent" />
                      <span className="font-semibold">Winner</span>
                    </div>
                    <p className="text-foreground">
                      {tournament.winner || "-"}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Award className="w-5 h-5 text-primary" />
                      <span className="font-semibold">Runner-up</span>
                    </div>
                    <p className="text-foreground">
                      {tournament.runnerUp || "-"}
                    </p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">
                      {tournament.totalTeams || tournament.teams}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Teams Participated
                    </p>
                    <p className="text-sm text-accent mt-2">
                      {tournament.highlights || ""}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    return (
      <div className="text-center text-muted-foreground py-12">
        No content for this category.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <Navigation />

      <section className="hero-3d py-20 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl md:text-6xl font-bold text-primary-foreground mb-6">
            Competitive Cricket
            <span className="block text-accent">Tournaments & Leagues</span>
          </h1>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-3xl mx-auto">
            Join our exciting tournaments and leagues. From casual matches to
            professional competitions, find your perfect cricket challenge and
            compete with the best.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {categories.length > 0 ? (
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList
                className={`grid w-full mb-12 bg-muted/50 p-2 rounded-2xl max-w-md mx-auto 
                  ${categories.length === 1 ? "grid-cols-1" : ""}
                  ${categories.length === 2 ? "grid-cols-2" : ""}
                  ${categories.length >= 3 ? "grid-cols-3" : ""}`}
              >
                {categories.map((cat) => (
                  <TabsTrigger
                    key={cat._id}
                    value={cat._id}
                    className="rounded-xl"
                  >
                    {cat.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              {categories.map((cat) => (
                <TabsContent
                  key={cat._id}
                  value={cat._id}
                  className="space-y-8"
                >
                  <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-foreground mb-4">
                      {cat.name}
                    </h2>
                    <p className="text-xl text-muted-foreground">
                      Explore all {cat.name.toLowerCase()} tournaments
                    </p>
                  </div>
                  {renderTabContent(cat._id)}
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              Loading tournament categories...
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Tournaments;

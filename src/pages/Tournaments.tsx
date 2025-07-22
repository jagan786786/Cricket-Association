import { Trophy, Calendar, Users, MapPin, Clock, Award, Star, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Tournaments = () => {
  const upcomingTournaments = [
    {
      name: "Summer T20 Championship",
      date: "June 15-25, 2024",
      format: "T20",
      teams: "16 Teams",
      prize: "₹50,000",
      status: "Registration Open",
      location: "Main Ground",
      description: "Fast-paced T20 tournament featuring the best local teams",
      registrationFee: "₹3,000 per team"
    },
    {
      name: "Youth Cricket League",
      date: "July 10-20, 2024",
      format: "One Day",
      teams: "12 Teams",
      prize: "₹25,000",
      status: "Early Bird",
      location: "Practice Ground",
      description: "Under-19 cricket league to nurture young talent",
      registrationFee: "₹2,000 per team"
    },
    {
      name: "Women's Cricket Cup",
      date: "August 5-15, 2024",
      format: "50 Over",
      teams: "8 Teams",
      prize: "₹30,000",
      status: "Registration Open",
      location: "Main Ground",
      description: "Empowering women through competitive cricket",
      registrationFee: "₹2,500 per team"
    }
  ];

  const pastTournaments = [
    {
      name: "Winter Premier League",
      date: "December 2023",
      winner: "Cricket Warriors",
      runnerUp: "Storm Riders",
      totalTeams: "20",
      highlights: "Record attendance of 2,000+ spectators"
    },
    {
      name: "Monsoon Cup",
      date: "September 2023",
      winner: "Thunder Bolts",
      runnerUp: "Lightning Strikes",
      totalTeams: "16",
      highlights: "First tournament with live streaming"
    },
    {
      name: "Independence Day Cup",
      date: "August 2023",
      winner: "Freedom Fighters",
      runnerUp: "Patriots XI",
      totalTeams: "12",
      highlights: "Special match with veteran players"
    }
  ];

  const leagues = [
    {
      name: "Premier Division",
      teams: "10 Teams",
      format: "Round Robin + Playoffs",
      duration: "3 Months",
      skill: "Professional/Advanced",
      fee: "₹15,000 per team"
    },
    {
      name: "Division A",
      teams: "12 Teams",
      format: "League + Knockout",
      duration: "2 Months",
      skill: "Intermediate",
      fee: "₹10,000 per team"
    },
    {
      name: "Division B",
      teams: "16 Teams",
      format: "Group Stage + Finals",
      duration: "6 Weeks",
      skill: "Beginner/Amateur",
      fee: "₹7,500 per team"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <Navigation />
      {/* Hero Section */}
      <section className="hero-3d py-20 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Badge variant="outline" className="mb-6 text-primary border-primary">
            🏆 Tournament Central
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-primary-foreground mb-6">
            Competitive Cricket
            <span className="block text-accent">Tournaments & Leagues</span>
          </h1>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-3xl mx-auto">
            Join our exciting tournaments and leagues. From casual matches to professional competitions, 
            find your perfect cricket challenge and compete with the best.
          </p>
        </div>
      </section>

      {/* Tournament Navigation */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-12 bg-muted/50 p-2 rounded-2xl max-w-md mx-auto">
              <TabsTrigger value="upcoming" className="rounded-xl">Upcoming</TabsTrigger>
              <TabsTrigger value="leagues" className="rounded-xl">Leagues</TabsTrigger>
              <TabsTrigger value="past" className="rounded-xl">Past Events</TabsTrigger>
            </TabsList>

            {/* Upcoming Tournaments */}
            <TabsContent value="upcoming" className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-foreground mb-4">
                  Upcoming Tournaments
                </h2>
                <p className="text-xl text-muted-foreground">
                  Register now for these exciting upcoming cricket tournaments
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {upcomingTournaments.map((tournament, index) => (
                  <Card key={index} className="service-card overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-primary to-accent text-white">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="bg-white/20 text-white">
                          {tournament.status}
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
                          <span>{tournament.date}</span>
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
                          <span className="text-2xl font-bold text-accent">{tournament.prize}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Registration Fee:</span>
                          <span className="text-sm font-medium">{tournament.registrationFee}</span>
                        </div>
                      </div>

                      <Button className="w-full btn-hero">
                        Register Team
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* League Information */}
            <TabsContent value="leagues" className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-foreground mb-4">
                  League Divisions
                </h2>
                <p className="text-xl text-muted-foreground">
                  Regular competitive leagues for different skill levels
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {leagues.map((league, index) => (
                  <Card key={index} className="service-card text-center">
                    <CardHeader>
                      <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Target className="w-8 h-8 text-primary-foreground" />
                      </div>
                      <CardTitle className="text-2xl">{league.name}</CardTitle>
                      <Badge variant="outline" className="mx-auto">
                        {league.skill}
                      </Badge>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span>Teams:</span>
                          <span className="font-medium">{league.teams}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Format:</span>
                          <span className="font-medium">{league.format}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Duration:</span>
                          <span className="font-medium">{league.duration}</span>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <div className="text-2xl font-bold text-primary mb-2">{league.fee}</div>
                        <Button className="w-full" variant="outline">
                          Join League
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="bg-muted/50 rounded-2xl p-8 text-center">
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  League Benefits
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {[
                    "Regular competitive matches",
                    "Performance statistics tracking",
                    "Awards and recognition",
                    "Team building opportunities"
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Star className="w-5 h-5 text-accent" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Past Tournaments */}
            <TabsContent value="past" className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-foreground mb-4">
                  Tournament History
                </h2>
                <p className="text-xl text-muted-foreground">
                  Celebrating our past champions and memorable moments
                </p>
              </div>

              <div className="space-y-6">
                {pastTournaments.map((tournament, index) => (
                  <Card key={index} className="service-card">
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                        <div>
                          <h3 className="text-xl font-bold text-foreground mb-2">
                            {tournament.name}
                          </h3>
                          <p className="text-muted-foreground">{tournament.date}</p>
                        </div>

                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <Trophy className="w-5 h-5 text-accent" />
                            <span className="font-semibold">Winner</span>
                          </div>
                          <p className="text-foreground">{tournament.winner}</p>
                        </div>

                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <Award className="w-5 h-5 text-primary" />
                            <span className="font-semibold">Runner-up</span>
                          </div>
                          <p className="text-foreground">{tournament.runnerUp}</p>
                        </div>

                        <div>
                          <div className="text-2xl font-bold text-primary">{tournament.totalTeams}</div>
                          <p className="text-sm text-muted-foreground">Teams Participated</p>
                          <p className="text-sm text-accent mt-2">{tournament.highlights}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Tournament Features */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Why Participate in Our Tournaments?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Trophy,
                title: "Professional Organization",
                description: "Well-organized tournaments with proper scheduling and management"
              },
              {
                icon: Users,
                title: "Fair Play",
                description: "Certified umpires and strict adherence to cricket rules and regulations"
              },
              {
                icon: Award,
                title: "Recognition",
                description: "Certificates, trophies, and awards for winners and outstanding performers"
              },
              {
                icon: Star,
                title: "Networking",
                description: "Connect with fellow cricket enthusiasts and build lasting friendships"
              }
            ].map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-primary to-accent rounded-3xl p-12">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Compete?
            </h2>
            <p className="text-white/90 text-lg mb-8">
              Join our tournaments and leagues to test your skills against the best cricket teams in the region.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                Register Team
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-primary"
              >
                View Schedule
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Tournaments;
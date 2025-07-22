import { 
  GraduationCap, 
  Target, 
  Users, 
  Trophy, 
  Dumbbell, 
  Calendar, 
  MapPin, 
  Crown,
  ChevronRight,
  Clock,
  Award,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ServicesSection = () => {
  const services = [
    {
      icon: GraduationCap,
      title: "Cricket Coaching & Training",
      description: "Professional coaching for all skill levels and age groups",
      features: [
        "Structured coaching for U-12, U-16, U-19, Adults",
        "Certified Level 1 & Level 2 coaches",
        "Daily/Weekend training sessions",
        "Personalized one-on-one coaching"
      ],
      color: "bg-primary",
      badge: "Most Popular"
    },
    {
      icon: Target,
      title: "Practice Facilities",
      description: "World-class practice facilities with modern equipment",
      features: [
        "Full-sized turf and matting pitches",
        "Bowling machines for batting practice",
        "Floodlight nets for evening sessions",
        "Indoor practice during monsoon"
      ],
      color: "bg-accent",
      badge: "Premium"
    },
    {
      icon: Users,
      title: "Club Memberships",
      description: "Exclusive membership plans with amazing benefits",
      features: [
        "Annual & Seasonal membership plans",
        "Access to exclusive member matches",
        "Discounted coaching & facility usage",
        "Official club merchandise kit"
      ],
      color: "bg-primary",
      badge: "Exclusive"
    },
    {
      icon: Trophy,
      title: "Tournaments & Leagues",
      description: "Competitive cricket at all levels",
      features: [
        "Internal club tournaments (T20, One-day)",
        "Inter-club and inter-state leagues",
        "Player registration & statistics",
        "Live scoring and streaming support"
      ],
      color: "bg-accent",
      badge: "Competitive"
    },
    {
      icon: Dumbbell,
      title: "Fitness & Conditioning",
      description: "Cricket-specific fitness and conditioning programs",
      features: [
        "Cricket-specific fitness training",
        "Strength, agility & injury-prevention",
        "Nutrition & recovery guidance",
        "Professional physiotherapy support"
      ],
      color: "bg-primary",
      badge: "Wellness"
    },
    {
      icon: Calendar,
      title: "Events & Camps",
      description: "Special cricket events and training camps",
      features: [
        "Holiday cricket camps (Summer/Winter)",
        "Guest sessions by Ranji/International players",
        "Scouting camps for professional selections",
        "Skill development workshops"
      ],
      color: "bg-accent",
      badge: "Special"
    },
    {
      icon: MapPin,
      title: "Ground & Pitch Rental",
      description: "Rent our premium facilities for your events",
      features: [
        "Affordable hourly/daily rental rates",
        "Match officials and scorer arrangements",
        "Equipment rental available",
        "Catering services on request"
      ],
      color: "bg-primary",
      badge: "Flexible"
    },
    {
      icon: Crown,
      title: "Women & Girls Cricket",
      description: "Dedicated programs for women's cricket development",
      features: [
        "Special coaching batches for girls/women",
        "Participation in women's leagues",
        "Female coaching staff available",
        "Empowerment through sport initiatives"
      ],
      color: "bg-accent",
      badge: "Empowering"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
          <Badge variant="outline" className="mb-4 text-primary border-primary">
            🏏 Our Services
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Excellence in Every
            <span className="text-primary block">Cricket Service</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            From beginner coaching to professional tournaments, we offer comprehensive 
            cricket services designed to elevate your game and passion for cricket.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className="service-card group hover:shadow-2xl border-0 bg-gradient-to-br from-card to-card/50"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="relative">
                {service.badge && (
                  <Badge 
                    variant="secondary" 
                    className="absolute -top-2 -right-2 bg-accent text-accent-foreground"
                  >
                    {service.badge}
                  </Badge>
                )}
                
                <div className={`w-16 h-16 ${service.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <service.icon className="w-8 h-8 text-white" />
                </div>
                
                <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {service.title}
                </CardTitle>
                
                <CardDescription className="text-muted-foreground">
                  {service.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  variant="ghost" 
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
                >
                  Learn More
                  <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 animate-fade-in-up">
          <div className="bg-gradient-to-r from-primary to-accent rounded-2xl p-8 md:p-12 text-center">
            <h3 className="text-3xl font-bold text-white mb-4">
              Ready to Start Your Cricket Journey?
            </h3>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of cricket enthusiasts who have chosen us for their cricket development. 
              Start with a free trial session today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                <Clock className="mr-2 w-5 h-5" />
                Book Free Trial
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-primary"
              >
                <Award className="mr-2 w-5 h-5" />
                View Membership Plans
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
import { Award, Users, Target, Heart, CheckCircle, Star } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const About = () => {
  const stats = [
    { number: "15+", label: "Years of Excellence", icon: Award },
    { number: "500+", label: "Active Members", icon: Users },
    { number: "50+", label: "Tournaments Hosted", icon: Target },
    { number: "1000+", label: "Lives Touched", icon: Heart }
  ];

  const values = [
    {
      title: "Excellence",
      description: "We strive for excellence in everything we do, from coaching to facilities",
      icon: Star
    },
    {
      title: "Integrity",
      description: "Fair play, honesty, and sportsmanship are at the heart of our club",
      icon: CheckCircle
    },
    {
      title: "Community",
      description: "Building a strong cricket community that supports each member's growth",
      icon: Users
    },
    {
      title: "Development",
      description: "Focused on developing cricket skills and character in every player",
      icon: Target
    }
  ];

  const team = [
    {
      name: "Rajesh Kumar",
      role: "Head Coach & Director",
      experience: "Former State Player, 20+ years coaching",
      specialty: "Batting & Strategy"
    },
    {
      name: "Priya Sharma",
      role: "Women's Cricket Coach",
      experience: "Ex-International Player, 15 years coaching",
      specialty: "All-round Development"
    },
    {
      name: "Mohammed Ali",
      role: "Youth Development Coach",
      experience: "Level 2 Certified, 12 years experience",
      specialty: "Bowling & Fielding"
    },
    {
      name: "Sarah Johnson",
      role: "Fitness & Conditioning",
      experience: "Sports Science Graduate, 8 years experience",
      specialty: "Cricket Fitness"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <Navigation />
      {/* Hero Section */}
      <section className="hero-3d py-20 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Badge variant="outline" className="mb-6 text-primary border-primary">
            🏏 About Our Club
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-primary-foreground mb-6">
            Building Cricket
            <span className="block text-accent">Champions Since 2009</span>
          </h1>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-3xl mx-auto">
            We are more than just a cricket club. We're a community dedicated to nurturing talent, 
            building character, and promoting the beautiful game of cricket at all levels.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="w-10 h-10 text-primary-foreground" />
                </div>
                <div className="text-4xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-6">Our Story</h2>
              <div className="space-y-6 text-lg text-muted-foreground">
                <p>
                  Founded in 2009 by a group of passionate cricket enthusiasts, our Cricket Association 
                  began with a simple vision: to create a space where cricket lovers of all ages and 
                  skill levels could come together to learn, play, and grow.
                </p>
                <p>
                  What started as a small local club has now grown into one of the region's premier 
                  cricket institutions, known for our professional coaching, world-class facilities, 
                  and commitment to developing both cricketing skills and character.
                </p>
                <p>
                  Today, we pride ourselves on having nurtured hundreds of players who have gone on 
                  to represent their schools, colleges, and even state teams. But our greatest 
                  achievement remains building a community that values sportsmanship, friendship, 
                  and the pure joy of cricket.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-primary to-accent rounded-3xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                <p className="text-lg mb-6">
                  To provide comprehensive cricket development programs that nurture talent, 
                  build character, and create lifelong cricket enthusiasts while maintaining 
                  the highest standards of coaching and sportsmanship.
                </p>
                
                <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                <p className="text-lg">
                  To be the leading cricket association in the region, recognized for excellence 
                  in player development, community engagement, and promoting cricket as a sport 
                  that builds character and brings people together.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6">Our Core Values</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              These values guide everything we do and shape the character of our cricket community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="service-card text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-8 h-8 text-accent-foreground" />
                  </div>
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{value.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6">Meet Our Expert Team</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our team of certified coaches and cricket professionals are dedicated to your development
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="service-card text-center">
                <CardHeader>
                  <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-12 h-12 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <Badge variant="outline" className="mx-auto">{member.role}</Badge>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">{member.experience}</p>
                  <div className="pt-2">
                    <Badge variant="secondary" className="text-xs">
                      {member.specialty}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6">Our Achievements</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Best Cricket Academy 2023",
                description: "Awarded by State Cricket Board for excellence in cricket development",
                year: "2023"
              },
              {
                title: "Community Sports Award",
                description: "Recognized for outstanding contribution to community sports development",
                year: "2022"
              },
              {
                title: "Youth Development Excellence",
                description: "Certificate of appreciation for nurturing young cricket talent",
                year: "2021"
              }
            ].map((achievement, index) => (
              <Card key={index} className="service-card text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-accent-foreground" />
                  </div>
                  <Badge variant="outline" className="mb-2">{achievement.year}</Badge>
                  <CardTitle className="text-lg">{achievement.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{achievement.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-primary to-accent rounded-3xl p-12">
            <h2 className="text-4xl font-bold text-white mb-6">
              Join Our Cricket Family
            </h2>
            <p className="text-white/90 text-lg mb-8">
              Become part of our amazing cricket community and start your journey towards cricket excellence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Badge className="mx-auto mb-4 bg-white/20 text-white">
                ⭐ 15+ Years of Cricket Excellence ⭐
              </Badge>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
import { ArrowRight, Play, Users, Trophy, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import cricketHero from "@/assets/cricket-hero.jpg";

const Hero = () => {
  return (
    <section className="hero-3d relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Hero background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${cricketHero})`,
          filter: 'brightness(0.7)'
        }}
      ></div>
      
      {/* Animated background overlay */}
      <div className="absolute inset-0 cricket-pitch-lines opacity-10"></div>
      
      {/* 3D floating elements */}
      <div className="absolute top-20 left-10 cricket-ball-3d">
        <div className="w-16 h-16 bg-accent rounded-full shadow-lg flex items-center justify-center">
          <Target className="w-8 h-8 text-accent-foreground" />
        </div>
      </div>
      
      <div className="absolute top-32 right-20 cricket-ball-3d" style={{ animationDelay: '1s' }}>
        <div className="w-12 h-12 bg-primary rounded-full shadow-lg flex items-center justify-center">
          <Trophy className="w-6 h-6 text-primary-foreground" />
        </div>
      </div>
      
      <div className="absolute bottom-32 left-20 cricket-ball-3d" style={{ animationDelay: '2s' }}>
        <div className="w-20 h-20 bg-card rounded-full shadow-lg flex items-center justify-center border-4 border-primary">
          <Users className="w-10 h-10 text-primary" />
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8">
          {/* Main heading */}
          <div className="space-y-4 animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground leading-tight">
              Elite Cricket
              <span className="block text-accent">Association</span>
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-3xl mx-auto">
              Nurturing cricket talent through professional coaching, world-class facilities, 
              and competitive tournaments. Join the future of cricket today.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto animate-slide-in-right">
            {[
              { number: "500+", label: "Active Members" },
              { number: "15+", label: "Certified Coaches" },
              { number: "50+", label: "Tournaments" },
              { number: "10+", label: "Years Experience" },
            ].map((stat, index) => (
              <div key={index} className="card-3d bg-card/20 backdrop-blur-sm border border-white/20 rounded-xl p-6">
                <div className="text-3xl md:text-4xl font-bold text-accent">{stat.number}</div>
                <div className="text-primary-foreground/80 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-bounce-in">
            <Button size="lg" className="btn-hero text-lg px-8 py-4 group">
              Join Our Club
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-4 bg-white/10 backdrop-blur-sm border-white/30 text-primary-foreground hover:bg-white/20 group"
            >
              <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
              Watch Highlights
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
};

export default Hero;
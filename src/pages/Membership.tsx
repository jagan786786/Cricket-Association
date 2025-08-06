import { useEffect, useState } from "react";
import axios from "axios";

import {
  Check,
  Crown,
  Star,
  Users,
  Zap,
  Gift,
  Shield,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

// Icon mapping from backend strings to Lucide icons
const iconMap = {
  Users: Users,
  Star: Star,
  Crown: Crown,
  Zap: Zap,
  Shield: Shield,
  Gift: Gift,
  Clock: Clock,
};

const Membership = () => {
  const [membershipPlans, setMembershipPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch memberships from backend
  useEffect(() => {
    const fetchMemberships = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/memberships"); // Replace with your full API URL if needed
        const data = response.data.memberships;

        // Optional: Add icon and color mapping based on name or popularity
        const plans = data.map((plan) => ({
          ...plan,
          icon: iconMap[
            plan.name === "Elite"
              ? "Crown"
              : plan.name === "Champion"
              ? "Star"
              : "Users"
          ],
          color:
            plan.name === "Elite"
              ? "bg-accent"
              : plan.name === "Champion"
              ? "bg-primary"
              : "bg-muted",
        }));

        setMembershipPlans(plans);
      } catch (error) {
        console.error("Error fetching memberships:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMemberships();
  }, []);

  const benefits = [
    {
      icon: Zap,
      title: "Performance Tracking",
      description:
        "Advanced analytics to track your cricket performance and improvement over time",
    },
    {
      icon: Shield,
      title: "Insurance Coverage",
      description:
        "Comprehensive sports insurance coverage for all cricket-related activities",
    },
    {
      icon: Gift,
      title: "Exclusive Events",
      description:
        "Access to member-only events, workshops, and guest coaching sessions",
    },
    {
      icon: Clock,
      title: "Flexible Scheduling",
      description:
        "Book facilities and sessions through our convenient online platform",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <Navigation />

      {/* Hero Section */}
      <section className="hero-3d py-20 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl md:text-6xl font-bold text-primary-foreground mb-6">
            Join Our Cricket{" "}
            <span className="block text-accent">Community Today</span>
          </h1>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-3xl mx-auto">
            Choose the perfect membership plan that suits your cricket journey.
            Enjoy exclusive benefits, premium facilities, and be part of our
            growing cricket family.
          </p>
        </div>
      </section>

      {/* Membership Plans */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Choose Your Membership
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              All plans include access to our world-class facilities and expert
              guidance
            </p>
          </div>

          {loading ? (
            <p className="text-center text-lg">Loading memberships...</p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {membershipPlans.map((plan, index) => {
                const IconComponent = plan.icon || Users;

                return (
                  <Card
                    key={index}
                    className={`service-card relative ${
                      plan.isPopular ? "ring-2 ring-accent scale-105" : ""
                    } hover:shadow-2xl`}
                  >
                    {plan.isPopular && (
                      <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-accent text-accent-foreground px-6 py-2">
                        <Star className="w-4 h-4 mr-1" />
                        Most Popular
                      </Badge>
                    )}

                    <CardHeader className="text-center pb-8">
                      <div
                        className={`w-20 h-20 ${plan.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}
                      >
                        <IconComponent className="w-10 h-10 text-white" />
                      </div>

                      <CardTitle className="text-2xl font-bold">
                        {plan.name}
                      </CardTitle>
                      <CardDescription className="text-base">
                        {plan.description}
                      </CardDescription>

                      <div className="pt-4">
                        <div className="text-4xl font-bold text-primary">
                          ₹{plan.price}
                        </div>
                        <div className="text-muted-foreground">
                          {plan.duration}
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                      <ul className="space-y-4">
                        {plan.features.map((feature, featureIndex) => (
                          <li
                            key={featureIndex}
                            className="flex items-start space-x-3"
                          >
                            <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                            <span className="text-muted-foreground text-sm">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>

                      <Button
                        className={`w-full py-6 text-lg ${
                          plan.isPopular ? "btn-hero" : ""
                        }`}
                        variant={plan.isPopular ? "default" : "outline"}
                        size="lg"
                      >
                        {plan.isPopular
                          ? "Choose Champion"
                          : `Choose ${plan.name}`}
                      </Button>

                      {plan.isPopular && (
                        <div className="text-center text-sm text-muted-foreground">
                          30-day money-back guarantee
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Additional Benefits */}
          <div className="mt-20">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-foreground mb-4">
                All Members Enjoy
              </h3>
              <p className="text-lg text-muted-foreground">
                Exclusive benefits that come with every membership plan
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <benefit.icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h4 className="text-lg font-semibold text-foreground mb-2">
                    {benefit.title}
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA & Footer (unchanged) */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-primary to-accent rounded-3xl p-12">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Join Our Community?
            </h2>
            <p className="text-white/90 text-lg mb-8">
              Start your cricket journey with us today. Choose your plan and get
              access to premium facilities immediately.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="text-lg px-8 py-4"
              >
                Join Now
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-4">
                Schedule Tour
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Membership;

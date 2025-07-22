import React, { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircle, Star, Award, Shield, Clock, Zap } from "lucide-react";

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

const iconMap = {
  trophy: Award,
  shield: Shield,
  clock: Clock,
  zap: Zap,
  star: Star,
};

const Services = () => {
  const [categories, setCategories] = useState([]);
  const [modulesByCategory, setModulesByCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(null);

  useEffect(() => {
    const fetchCategoriesAndModules = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/categories"
        );
        const activeCategories = data.categories.filter((cat) => cat.active);
        setCategories(activeCategories);
        setActiveTab(activeCategories[0]?._id || null);

        const modulePromises = activeCategories.map((cat) =>
          axios.get(`http://localhost:4000/api/modules/category/${cat._id}`)
        );

        const moduleResponses = await Promise.all(modulePromises);
        const modulesData = {};

        moduleResponses.forEach((response, index) => {
          const categoryId = activeCategories[index]._id;
          modulesData[categoryId] = response.data.modules;
        });

        setModulesByCategory(modulesData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching services:", err);
        setLoading(false);
      }
    };

    fetchCategoriesAndModules();
  }, []);

  if (loading) {
    return <div className="p-10 text-center">Loading services...</div>;
  }

  const getGridCols = () => {
    const count = categories.length;
    if (count <= 2) return `grid-cols-${count}`;
    if (count === 3) return "grid-cols-3";
    return "grid-cols-4";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <Navigation />

      {/* Hero */}
      <section className="hero-3d py-20 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl md:text-6xl font-bold text-primary-foreground mb-6">
            Professional Cricket
            <span className="block text-accent">Services & Training</span>
          </h1>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-3xl mx-auto">
            Discover our comprehensive range of cricket services designed to
            elevate your game, from beginner coaching to professional tournament
            participation.
          </p>
        </div>
      </section>

      {/* Services Tabs */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs
            defaultValue={activeTab}
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList
              className={`grid w-full mb-12 bg-muted/50 p-2 rounded-2xl ${getGridCols()}`}
            >
              {categories.map((category) => {
                const Icon = iconMap[category.icon?.toLowerCase()] || Award;
                return (
                  <TabsTrigger
                    key={category._id}
                    value={category._id}
                    className="flex items-center space-x-2 py-3 px-4 rounded-xl transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <Icon className="w-5 h-5" />
                    <span className="hidden sm:inline">{category.name}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {categories.map((category) => {
              const Icon = iconMap[category.icon?.toLowerCase()] || Award;
              const modules = modulesByCategory[category._id] || [];

              return (
                <TabsContent
                  key={category._id}
                  value={category._id}
                  className="space-y-8"
                >
                  <div className="text-center mb-12">
                    <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Icon className="w-10 h-10 text-primary-foreground" />
                    </div>
                    <h2 className="text-3xl font-bold text-foreground mb-4">
                      {category.name} Services
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {modules.map((service, index) => (
                      <Card
                        key={index}
                        className={`service-card relative ${
                          service.isPopular ? "ring-2 ring-accent" : ""
                        }`}
                      >
                        {service.isPopular && (
                          <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-accent text-accent-foreground">
                            <Star className="w-3 h-3 mr-1" />
                            Most Popular
                          </Badge>
                        )}

                        <CardHeader>
                          <CardTitle className="text-xl font-bold">
                            {service.name}
                          </CardTitle>
                          <CardDescription>
                            {service.description}
                          </CardDescription>
                          <div className="text-3xl font-bold text-primary">
                           ₹{service.price}
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-6">
                          <ul className="space-y-3">
                            {service.skills.map((feature, featureIndex) => (
                              <li
                                key={featureIndex}
                                className="flex items-center space-x-3"
                              >
                                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                                <span className="text-muted-foreground">
                                  {feature}
                                </span>
                              </li>
                            ))}
                          </ul>

                          <Button
                            className={`w-full ${
                              service.isPopular ? "btn-hero" : ""
                            }`}
                            variant={service.isPopular ? "default" : "outline"}
                          >
                            {service.isPopular ? "Choose Plan" : "Learn More"}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Why Choose Our Services?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We provide comprehensive cricket services with modern facilities
              and expert coaching
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Award,
                title: "Certified Coaches",
                description:
                  "All our coaches are certified and have professional playing experience",
              },
              {
                icon: Shield,
                title: "Safety First",
                description:
                  "Comprehensive safety protocols and insurance coverage for all activities",
              },
              {
                icon: Clock,
                title: "Flexible Timing",
                description:
                  "Multiple session timings to fit your schedule, including weekends",
              },
              {
                icon: Zap,
                title: "Modern Equipment",
                description:
                  "Latest cricket equipment and technology for optimal training experience",
              },
            ].map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-primary to-accent rounded-3xl p-12">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Begin Your Cricket Journey?
            </h2>
            <p className="text-white/90 text-lg mb-8">
              Contact us today to discuss your cricket goals and find the
              perfect service package for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="text-lg px-8 py-4"
              >
                Schedule Consultation
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-primary"
              >
                Download Brochure
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;

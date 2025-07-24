import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import * as LucideIcons from "lucide-react";

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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  const location = useLocation();
  const menuItemId = location.state?.menuItemId || null;

  const [categories, setCategories] = useState([]);
  const [modulesByCategory, setModulesByCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    features: [],
    newFeature: "",
    category: "",
    isPopular: false,
  });

  const [formMessage, setFormMessage] = useState("");

  useEffect(() => {
    const fetchServicesData = async () => {
      try {
        if (!menuItemId) {
          setLoading(false);
          return;
        }

        const { data: categoryRes } = await axios.get(
          `http://localhost:4000/api/categories/menuitem/${menuItemId}`
        );

        const allCategories = categoryRes.categories || [];
        const activeCategories = allCategories.filter((cat) => cat.active);
        const limitedCategories = activeCategories.slice(0, 4);

        setCategories(limitedCategories);
        setActiveTab(limitedCategories[0]?._id || null);
        setFormData((prev) => ({
          ...prev,
          category: limitedCategories[0]?._id,
        }));

        const modulePromises = limitedCategories.map((cat) =>
          axios.get(`http://localhost:4000/api/modules/category/${cat._id}`)
        );

        const moduleResponses = await Promise.all(modulePromises);
        const modulesData = {};

        moduleResponses.forEach((res, idx) => {
          const categoryId = limitedCategories[idx]._id;
          modulesData[categoryId] = res.data.modules;
        });

        setModulesByCategory(modulesData);
        setLoading(false);
      } catch (err) {
        console.error("Error loading services:", err);
        setLoading(false);
      }
    };

    fetchServicesData();
  }, [menuItemId]);

  const getLucideIconByName = (iconName) => {
    return LucideIcons[iconName] || LucideIcons.Award;
  };

  const getGridCols = () => {
    const count = categories.length;
    if (count <= 2) return `grid-cols-${count}`;
    if (count === 3) return "grid-cols-3";
    return "grid-cols-4";
  };

  const handleAddService = async () => {
    setFormMessage("");

    if (formData.features.length < 3) {
      setFormMessage("Please provide at least 3 features.");
      return;
    }

    const payload = {
      menuItem: menuItemId,
      category: formData.category,
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      duration: formData.duration,
      features: formData.features,
      isPopular: formData.isPopular,
    };

    try {
      const res = await axios.post("http://localhost:4000/api/module", payload);
      setFormMessage("Module created successfully!");

      const updated = await axios.get(
        `http://localhost:4000/api/modules/category/${formData.category}`
      );
      setModulesByCategory((prev) => ({
        ...prev,
        [formData.category]: updated.data.modules,
      }));

      setFormData({
        name: "",
        description: "",
        price: "",
        duration: "",
        features: [],
        newFeature: "",
        category: formData.category,
        isPopular: false,
      });
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to add module.";
      setFormMessage(errorMsg);
    }
  };

  if (loading)
    return <div className="p-10 text-center">Loading services...</div>;

  if (!menuItemId || categories.length === 0) {
    return (
      <div className="p-10 text-center">
        No active categories available for this service.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <Navigation />

      <section className="hero-3d py-20 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl md:text-6xl font-bold text-primary-foreground mb-6">
            Professional Cricket
            <span className="block text-accent">Services & Training</span>
          </h1>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-3xl mx-auto">
            Discover our comprehensive range of cricket services designed to
            elevate your game.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs
            defaultValue={activeTab}
            value={activeTab}
            onValueChange={(val) => {
              setActiveTab(val);
              setFormData((prev) => ({ ...prev, category: val }));
            }}
          >
            <TabsList
              className={`grid w-full mb-12 bg-muted/50 p-2 rounded-2xl ${getGridCols()}`}
            >
              {categories.map((category) => {
                const Icon = getLucideIconByName(category.icon);
                return (
                  <TabsTrigger key={category._id} value={category._id}>
                    {category.logo ? (
                      <img
                        src={category.logo}
                        alt={`${category.name} logo`}
                        className="w-5 h-5 rounded-full object-contain"
                      />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                    <span className="hidden sm:inline">{category.name}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {categories.map((category) => {
              const modules = modulesByCategory[category._id] || [];

              return (
                <TabsContent
                  key={category._id}
                  value={category._id}
                  className="space-y-8"
                >
                  <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-foreground mb-4">
                      {category.name} Services
                    </h2>
                  </div>

                  {modules.length === 0 ? (
                    <div className="col-span-full text-center py-16 px-4 bg-muted/40 rounded-2xl border border-dashed border-muted">
                      <div className="flex flex-col items-center space-y-4">
                        <LucideIcons.PackageX className="w-12 h-12 text-muted-foreground" />
                        <h3 className="text-xl font-semibold text-foreground">
                          No modules available in this category
                        </h3>
                        <p className="text-muted-foreground max-w-md mx-auto">
                          We're working on adding services to this category.
                          Please check back later or explore other categories.
                        </p>
                      </div>
                    </div>
                  ) : (
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
                              {service.features.map((feature, idx) => (
                                <li
                                  key={idx}
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
                              className="w-full"
                              variant={
                                service.isPopular ? "default" : "outline"
                              }
                            >
                              {service.isPopular ? "Choose Plan" : "Learn More"}
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
              );
            })}
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;

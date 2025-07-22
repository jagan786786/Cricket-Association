import { Phone, Mail, MapPin, Clock, Send, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Contact = () => {
  const contactInfo = [
    {
      icon: Phone,
      title: "Phone Numbers",
      details: [
        "+91 98765 43210 (Office)",
        "+91 87654 32109 (Cricket Manager)",
        "+91 76543 21098 (Emergency)"
      ]
    },
    {
      icon: Mail,
      title: "Email Addresses",
      details: [
        "info@cricketassociation.com",
        "coaching@cricketassociation.com",
        "tournaments@cricketassociation.com"
      ]
    },
    {
      icon: MapPin,
      title: "Location",
      details: [
        "Cricket Association Ground,",
        "Sector 15, Sports Complex,",
        "City Name - 123456"
      ]
    },
    {
      icon: Clock,
      title: "Operating Hours",
      details: [
        "Monday - Friday: 6:00 AM - 10:00 PM",
        "Saturday - Sunday: 5:00 AM - 11:00 PM",
        "Holidays: 6:00 AM - 9:00 PM"
      ]
    }
  ];

  const departments = [
    {
      name: "General Inquiries",
      email: "info@cricketassociation.com",
      phone: "+91 98765 43210"
    },
    {
      name: "Coaching Programs",
      email: "coaching@cricketassociation.com",
      phone: "+91 87654 32109"
    },
    {
      name: "Membership Services",
      email: "membership@cricketassociation.com",
      phone: "+91 76543 21098"
    },
    {
      name: "Tournament Registration",
      email: "tournaments@cricketassociation.com",
      phone: "+91 65432 10987"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <Navigation />
      {/* Hero Section */}
      <section className="hero-3d py-20 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Badge variant="outline" className="mb-6 text-primary border-primary">
            📞 Get In Touch
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-primary-foreground mb-6">
            Contact Our
            <span className="block text-accent">Cricket Experts</span>
          </h1>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-3xl mx-auto">
            Have questions about our programs? Want to join our cricket family? 
            We're here to help you with all your cricket-related queries.
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactInfo.map((info, index) => (
              <Card key={index} className="service-card text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <info.icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-lg">{info.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {info.details.map((detail, detailIndex) => (
                      <p key={detailIndex} className="text-muted-foreground text-sm">
                        {detail}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="service-card">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center space-x-2">
                  <MessageCircle className="w-6 h-6 text-primary" />
                  <span>Send us a Message</span>
                </CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you within 24 hours
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="Enter your first name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Enter your last name" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="Enter your email" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="Enter your phone number" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="What can we help you with?" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea 
                    id="message" 
                    rows={6}
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>
                
                <Button className="w-full btn-hero text-lg py-6">
                  <Send className="w-5 h-5 mr-2" />
                  Send Message
                </Button>
              </CardContent>
            </Card>

            {/* Map & Quick Contact */}
            <div className="space-y-8">
              {/* Map Placeholder */}
              <Card className="service-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="w-6 h-6 text-primary" />
                    <span>Find Us Here</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted rounded-xl h-64 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
                      <p className="text-muted-foreground">Interactive Map</p>
                      <p className="text-sm text-muted-foreground">
                        Cricket Association Ground, Sector 15
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <Button variant="outline" className="w-full">
                      Get Directions
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Contact */}
              <Card className="service-card">
                <CardHeader>
                  <CardTitle>Quick Contact</CardTitle>
                  <CardDescription>
                    For immediate assistance, call us directly
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    <Button variant="outline" className="justify-start">
                      <Phone className="w-4 h-4 mr-2" />
                      +91 98765 43210
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <Mail className="w-4 h-4 mr-2" />
                      info@cricketassociation.com
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Department Contacts */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Department Contacts
            </h2>
            <p className="text-xl text-muted-foreground">
              Reach out to the right department for faster assistance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {departments.map((dept, index) => (
              <Card key={index} className="service-card">
                <CardHeader>
                  <CardTitle className="text-lg text-center">{dept.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-center space-y-2">
                    <Button variant="outline" size="sm" className="w-full text-xs">
                      <Mail className="w-3 h-3 mr-2" />
                      {dept.email}
                    </Button>
                    <Button variant="outline" size="sm" className="w-full text-xs">
                      <Phone className="w-3 h-3 mr-2" />
                      {dept.phone}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-6">
            {[
              {
                question: "What are your operating hours?",
                answer: "We're open Monday-Friday 6:00 AM - 10:00 PM, weekends 5:00 AM - 11:00 PM, and holidays 6:00 AM - 9:00 PM."
              },
              {
                question: "How can I register for coaching programs?",
                answer: "You can register online through our website, visit our office, or call our coaching department at +91 87654 32109."
              },
              {
                question: "Do you offer trial sessions?",
                answer: "Yes! We offer free trial sessions for new members. Contact us to schedule your trial session."
              },
              {
                question: "What should I bring for my first visit?",
                answer: "Just bring comfortable sports clothing and enthusiasm to learn! We provide all cricket equipment for trial sessions."
              }
            ].map((faq, index) => (
              <Card key={index} className="service-card">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-foreground mb-2 text-lg">{faq.question}</h4>
                  <p className="text-muted-foreground">{faq.answer}</p>
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
              Visit Us Today!
            </h2>
            <p className="text-white/90 text-lg mb-8">
              Come visit our facilities and see why we're the premier cricket destination. 
              Our team is ready to welcome you to our cricket family.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Badge className="mx-auto mb-4 bg-white/20 text-white">
                📍 Open 7 Days a Week
              </Badge>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
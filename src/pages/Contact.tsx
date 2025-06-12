
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Link } from 'react-router-dom';
import { Music, Mail, MapPin, Phone, Send, CheckCircle } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    console.log('Contact form submitted:', formData);
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass-effect-strong border-b border-border/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between p-6">
          <Link to="/" className="flex items-center space-x-3">
            <div className="relative">
              <Music className="h-8 w-8 text-primary animate-pulse-slow" />
              <div className="absolute inset-0 h-8 w-8 text-primary/30 animate-ping"></div>
            </div>
            <span className="text-2xl font-bold text-gradient">MyVibeLytics</span>
          </Link>
          <Link to="/">
            <Button variant="outline" className="border-primary/50 text-foreground hover:bg-primary/10 hover:border-primary">
              Back to Home
            </Button>
          </Link>
        </div>
      </nav>

      <div className="relative">
        <div className="absolute inset-0 bg-gradient-hero"></div>
        <div className="relative px-6 py-16">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-6xl font-bold text-gradient mb-4">
                Get in Touch
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Have questions about MyVibeLytics? We'd love to hear from you.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Contact Form */}
              <Card className="glass-effect border-border/50">
                <CardHeader>
                  <CardTitle className="text-foreground text-2xl">Send us a Message</CardTitle>
                </CardHeader>
                <CardContent>
                  {isSubmitted ? (
                    <div className="text-center py-8">
                      <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
                      <h3 className="text-foreground font-semibold text-lg mb-2">Message Sent!</h3>
                      <p className="text-muted-foreground">We'll get back to you as soon as possible.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name" className="text-foreground">Name</Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="bg-background/50 border-border text-foreground"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="email" className="text-foreground">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="bg-background/50 border-border text-foreground"
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="subject" className="text-foreground">Subject</Label>
                        <Input
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          className="bg-background/50 border-border text-foreground"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="message" className="text-foreground">Message</Label>
                        <Textarea
                          id="message"
                          name="message"
                          rows={5}
                          value={formData.message}
                          onChange={handleChange}
                          className="bg-background/50 border-border text-foreground resize-none"
                          required
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-spotify hover:scale-105 transform transition-all duration-200 shadow-lg hover:shadow-xl text-primary-foreground"
                      >
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>

              {/* Contact Information */}
              <div className="space-y-6">
                <Card className="glass-effect border-border/50">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <Mail className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-foreground font-semibold">Email</h3>
                        <p className="text-muted-foreground">aadityabansal1112@gmail.com</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-effect border-border/50">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <MapPin className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-foreground font-semibold">Address</h3>
                        <p className="text-muted-foreground">
                          2-3 Prakash Enclave<br />
                          Bypass Road<br />
                          Agra, India
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-effect border-border/50">
                  <CardContent className="p-6">
                    <h3 className="text-foreground font-semibold mb-4">Quick Links</h3>
                    <div className="space-y-3">
                      <Link to="/privacy" className="block text-muted-foreground hover:text-primary transition-colors">
                        Privacy Policy
                      </Link>
                      <Link to="/terms" className="block text-muted-foreground hover:text-primary transition-colors">
                        Terms of Service
                      </Link>
                      <Link to="/buy" className="block text-muted-foreground hover:text-primary transition-colors">
                        Pricing
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-20 border-t border-border/30 glass-effect-strong">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-6 md:mb-0">
              <Music className="h-6 w-6 text-primary" />
              <span className="text-foreground font-bold text-lg">MyVibeLytics</span>
            </div>
            <div className="flex space-x-8 text-muted-foreground">
              <Link to="/terms" className="hover:text-primary transition-colors duration-200 font-medium">Terms</Link>
              <Link to="/privacy" className="hover:text-primary transition-colors duration-200 font-medium">Privacy</Link>
              <Link to="/contact" className="hover:text-primary transition-colors duration-200 font-medium">Contact</Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border/20 text-center">
            <p className="text-muted-foreground text-sm">
              © 2024 MyVibeLytics. Discover your music DNA with beautiful analytics.
            </p>
            <p className="text-muted-foreground text-xs mt-2">
              Owned by Arnam Enterprises | GST: 09ABZFA4207B1ZG
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Contact;


import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Link } from 'react-router-dom';
import { Music, Mail, MessageSquare, Send, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Log the data we're sending
      console.log("Submitting contact form data:", formData);
      const { error, data } = await supabase
        .from('contact_requests')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            subject: formData.subject || null,
            message: formData.message,
            status: 'pending'
          }
        ]);

      // Log the response from supabase
      console.log("Supabase insert data:", data);
      console.log("Supabase error:", error);

      if (error) {
        // Show a more verbose error message
        toast({
          title: "Error",
          description: error.message || "Failed to send message. Please try again.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Message sent!",
        description: "We'll get back to you as soon as possible.",
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error: any) {
      console.error('Error submitting contact form:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Header */}
      <nav className="sticky top-0 z-50 glass-effect-strong border-b border-border/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between p-6">
          <Link to="/" className="flex items-center space-x-3">
            <div className="relative">
              <img src="/logo.png" alt="MyVibeLytics" className="h-8 w-8" />
            </div>
            <span className="text-2xl font-bold text-gradient">MyVibeLytics</span>
          </Link>
          <Link to="/">
            <Button variant="outline" className="border-primary/50 text-foreground hover:bg-primary/10">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </nav>

      <div className="relative">
        <div className="absolute inset-0 bg-gradient-hero"></div>
        <div className="relative px-6 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold text-gradient mb-6">Get in Touch</h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Have questions about MyVibeLytics? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <Card className="glass-effect border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-foreground">
                    <MessageSquare className="h-5 w-5" />
                    <span>Send us a Message</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name" className="text-foreground">Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="bg-background/50 border-border text-foreground"
                          placeholder="Your full name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-foreground">Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="bg-background/50 border-border text-foreground"
                          placeholder="your@email.com"
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
                        onChange={handleInputChange}
                        className="bg-background/50 border-border text-foreground"
                        placeholder="What's this about?"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="message" className="text-foreground">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        className="bg-background/50 border-border text-foreground min-h-[120px]"
                        placeholder="Tell us how we can help you..."
                        required
                      />
                    </div>
                    
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-spotify hover:scale-105 transform transition-all duration-200 shadow-lg hover:shadow-xl text-primary-foreground"
                    >
                      <Send className="mr-2 h-4 w-4" />
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <div className="space-y-8">
                <Card className="glass-effect border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-foreground">
                      <Mail className="h-5 w-5" />
                      <span>Contact Information</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="text-foreground font-medium mb-2">Email</h3>
                      <p className="text-muted-foreground">aadityabansal1112@gmail.com</p>
                    </div>
                    
                    <div>
                      <h3 className="text-foreground font-medium mb-2">Address</h3>
                      <p className="text-muted-foreground">
                        2-3 Prakash Enclave<br />
                        Bypass Road<br />
                        Agra, India
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-foreground font-medium mb-2">Response Time</h3>
                      <p className="text-muted-foreground">
                        We typically respond within 24 hours during business days.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-effect border-border/50">
                  <CardContent className="p-6">
                    <h3 className="text-foreground font-medium mb-4">Quick Questions?</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-foreground text-sm font-medium">About Premium Features</p>
                        <p className="text-muted-foreground text-sm">Check out our pricing page for detailed information.</p>
                      </div>
                      <div>
                        <p className="text-foreground text-sm font-medium">Technical Issues</p>
                        <p className="text-muted-foreground text-sm">Try refreshing your Spotify connection first.</p>
                      </div>
                      <div>
                        <p className="text-foreground text-sm font-medium">Account Problems</p>
                        <p className="text-muted-foreground text-sm">Include your email address in your message.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;


import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';
import { Music, ArrowLeft, Mail, MessageSquare, Send, MapPin, Clock } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 2000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <Link to="/" className="flex items-center space-x-2">
          <Music className="h-8 w-8 text-green-400" />
          <span className="text-2xl font-bold text-white">MyVibeLytics</span>
        </Link>
        <Link to="/">
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            Contact Us
          </h1>
          <p className="text-xl text-gray-300">
            We'd love to hear from you. Get in touch with our team.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Mail className="h-6 w-6 text-green-400" />
                  <h3 className="text-white font-semibold">Email Us</h3>
                </div>
                <p className="text-gray-300 text-sm mb-2">General inquiries</p>
                <p className="text-green-400">hello@myvibelytics.com</p>
                <p className="text-gray-300 text-sm mt-3 mb-2">Support</p>
                <p className="text-green-400">support@myvibelytics.com</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Clock className="h-6 w-6 text-blue-400" />
                  <h3 className="text-white font-semibold">Response Time</h3>
                </div>
                <p className="text-gray-300 text-sm mb-2">We typically respond within</p>
                <p className="text-blue-400 font-semibold">24 hours</p>
                <p className="text-gray-300 text-sm mt-3">Business hours: 9AM - 6PM UTC</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <MessageSquare className="h-6 w-6 text-purple-400" />
                  <h3 className="text-white font-semibold">Common Topics</h3>
                </div>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• Account and billing questions</li>
                  <li>• Technical support</li>
                  <li>• Feature requests</li>
                  <li>• Privacy and data questions</li>
                  <li>• Partnership inquiries</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white text-2xl">Send us a message</CardTitle>
                <p className="text-gray-300">Fill out the form below and we'll get back to you as soon as possible.</p>
              </CardHeader>
              <CardContent>
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Send className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-white text-xl font-semibold mb-2">Message Sent!</h3>
                    <p className="text-gray-300 mb-6">Thank you for contacting us. We'll get back to you within 24 hours.</p>
                    <Button 
                      onClick={() => setSubmitted(false)}
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="name" className="text-white">Full Name *</Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Your full name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-green-400"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-white">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-green-400"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="subject" className="text-white">Subject *</Label>
                      <Input
                        id="subject"
                        type="text"
                        placeholder="What's this about?"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-green-400"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="message" className="text-white">Message *</Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us more about your inquiry..."
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={6}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-green-400 resize-none"
                      />
                    </div>
                    
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-green-400 to-blue-400 hover:from-green-500 hover:to-blue-500 text-white py-3"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Sending...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Send className="h-4 w-4" />
                          <span>Send Message</span>
                        </div>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white text-2xl text-center">Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-white font-semibold mb-2">How do I cancel my subscription?</h4>
                    <p className="text-gray-300 text-sm">You can manage your subscription through your dashboard or contact us for assistance.</p>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2">Is my Spotify data secure?</h4>
                    <p className="text-gray-300 text-sm">Yes, we use industry-standard security measures and never store your Spotify credentials.</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-white font-semibold mb-2">Can I export my analytics data?</h4>
                    <p className="text-gray-300 text-sm">Premium users can export their data in various formats from the dashboard.</p>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2">Do you offer refunds?</h4>
                    <p className="text-gray-300 text-sm">We handle refunds on a case-by-case basis. Contact us to discuss your situation.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Contact;

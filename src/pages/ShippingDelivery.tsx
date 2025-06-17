
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Music, ArrowLeft, Truck, Zap, Globe, Clock } from 'lucide-react';

const ShippingDelivery = () => {
  return (
    <div className="min-h-screen bg-gradient-dark p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <Link to="/" className="flex items-center space-x-2">
          <Music className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold text-gradient">MyVibeLytics</span>
        </Link>
        <Link to="/">
          <Button variant="outline" className="border-border text-foreground hover:bg-muted">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>

      <div className="max-w-4xl mx-auto">
        <Card className="glass-effect border-border/50">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-gradient text-center flex items-center justify-center space-x-2">
              <Truck className="h-8 w-8 text-primary" />
              <span>Shipping & Delivery</span>
            </CardTitle>
            <p className="text-muted-foreground text-center">Effective Date: June 17, 2025</p>
          </CardHeader>
          <CardContent className="space-y-6 text-foreground">
            
            <div className="text-center p-6 bg-primary/10 rounded-lg border border-primary/20">
              <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-primary mb-2">Digital Service - Instant Delivery</h2>
              <p className="text-muted-foreground">
                MyVibeLytics is a 100% digital service. No physical products are shipped. All features are delivered instantly online.
              </p>
            </div>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">How MyVibeLytics Works</h2>
              <div className="text-muted-foreground leading-relaxed space-y-2">
                <p>
                  MyVibeLytics is a web-based music analytics platform that provides insights into your Spotify listening habits. 
                  Since we offer a digital service, there are no physical products to ship or deliver.
                </p>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div className="glass-effect border-border/30 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Globe className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold text-foreground">Web-Based Platform</h3>
                    </div>
                    <p>Access your music analytics from any device with internet connection</p>
                  </div>
                  <div className="glass-effect border-border/30 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Zap className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold text-foreground">Instant Access</h3>
                    </div>
                    <p>Premium features activate immediately after successful payment</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">Service Delivery Timeline</h2>
              <div className="text-muted-foreground leading-relaxed space-y-3">
                <div className="flex items-start space-x-3 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                  <Clock className="h-5 w-5 text-green-400 mt-0.5" />
                  <div>
                    <p className="font-semibold text-green-400">Free Tier: Immediate</p>
                    <p>Basic analytics are available instantly upon connecting your Spotify account.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <Zap className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold text-primary">Premium Upgrade: Instant Activation</p>
                    <p>Premium features unlock immediately after payment confirmation (usually within 1-2 minutes).</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">What You Receive</h2>
              <div className="text-muted-foreground leading-relaxed space-y-2">
                <p>When you purchase premium access, you receive:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Advanced music analytics and insights</li>
                  <li>Detailed listening behavior analysis</li>
                  <li>Personality and mood analytics</li>
                  <li>Shareable music cards and reports</li>
                  <li>AI-powered playlist generation</li>
                  <li>Special highlights and hidden gems discovery</li>
                  <li>24/7 access to all premium features</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">Technical Requirements</h2>
              <div className="text-muted-foreground leading-relaxed space-y-2">
                <p>To use MyVibeLytics, you need:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Active Spotify account (free or premium)</li>
                  <li>Internet connection</li>
                  <li>Modern web browser (Chrome, Firefox, Safari, Edge)</li>
                  <li>JavaScript enabled</li>
                </ul>
                <p className="mt-3">
                  No downloads, installations, or physical delivery required. Everything works directly in your browser.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">Support & Assistance</h2>
              <div className="text-muted-foreground leading-relaxed">
                <p className="mb-3">If you experience any issues accessing your premium features:</p>
                <div className="glass-effect border-border/30 p-4 rounded-lg">
                  <p>📧 Email: <a href="mailto:aadityabansal1112@gmail.com" className="text-primary hover:underline">aadityabansal1112@gmail.com</a></p>
                  <p>📝 Contact Form: <Link to="/contact" className="text-primary hover:underline">Contact Page</Link></p>
                  <p>📍 Address: 2-3 Prakash Enclave, Bypass Road, Agra, India</p>
                  <p className="mt-2 text-sm">We typically respond within 24 hours</p>
                </div>
              </div>
            </section>

            <div className="text-center pt-8 border-t border-border/20">
              <p className="text-muted-foreground text-sm">
                Since MyVibeLytics is a digital service, traditional shipping terms don't apply. 
                Your music insights are delivered instantly to your browser!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ShippingDelivery;


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Music, ArrowLeft, Heart, Users, Shield, Zap, Target, Star } from 'lucide-react';

const About = () => {
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
              <Heart className="h-8 w-8 text-primary" />
              <span>About MyVibeLytics</span>
            </CardTitle>
            <p className="text-muted-foreground text-center text-lg">
              Turning your music history into a story worth telling
            </p>
          </CardHeader>
          <CardContent className="space-y-8 text-foreground">
            
            {/* Mission Statement */}
            <section className="text-center">
              <h2 className="text-2xl font-semibold mb-4 text-primary">Our Mission</h2>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                MyVibeLytics is a personalized music analytics platform built to help you rediscover your music habits. 
                We combine Spotify's data with beautiful charts, stats, and insights to show you your true listening personality. 
                Whether you're a casual listener or an audiophile, we're here to turn your music history into a story worth telling.
              </p>
            </section>

            {/* Core Values */}
            <section>
              <h2 className="text-2xl font-semibold mb-6 text-primary text-center">What We Stand For</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-6 glass-effect border-border/30 rounded-lg">
                  <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">User-First</h3>
                  <p className="text-muted-foreground text-sm">Every feature we build is designed with you in mind. Your experience is our priority.</p>
                </div>
                <div className="text-center p-6 glass-effect border-border/30 rounded-lg">
                  <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">Privacy-Focused</h3>
                  <p className="text-muted-foreground text-sm">No tracking, no ads, no data selling. Just pure analytics focused on your music journey.</p>
                </div>
                <div className="text-center p-6 glass-effect border-border/30 rounded-lg">
                  <Star className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">Quality</h3>
                  <p className="text-muted-foreground text-sm">Beautiful, accurate, and meaningful insights that help you understand your music taste.</p>
                </div>
              </div>
            </section>

            {/* What We Do */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-primary">What We Do</h2>
              <div className="text-muted-foreground leading-relaxed space-y-4">
                <p>
                  We analyze your Spotify listening data to provide deep insights into your music preferences, habits, and trends. 
                  Our platform transforms raw listening data into beautiful visualizations and meaningful statistics.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 glass-effect border-border/30 rounded-lg">
                    <h3 className="font-semibold text-foreground mb-2 flex items-center space-x-2">
                      <Zap className="h-4 w-4 text-primary" />
                      <span>Real-Time Analytics</span>
                    </h3>
                    <p className="text-sm">Track your current listening habits and see how they evolve over time.</p>
                  </div>
                  <div className="p-4 glass-effect border-border/30 rounded-lg">
                    <h3 className="font-semibold text-foreground mb-2 flex items-center space-x-2">
                      <Target className="h-4 w-4 text-primary" />
                      <span>Personalized Insights</span>
                    </h3>
                    <p className="text-sm">Discover patterns and trends unique to your musical journey.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Our Promise */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-primary">Our Promise to You</h2>
              <div className="text-muted-foreground leading-relaxed space-y-3">
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <p className="font-semibold text-foreground mb-2">We are a user-first platform:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>No tracking:</strong> We don't track your behavior outside our platform</li>
                    <li><strong>No ads:</strong> Clean, distraction-free experience focused on your music</li>
                    <li><strong>Just vibes:</strong> Pure focus on helping you understand and enjoy your music more</li>
                  </ul>
                </div>
                <p>
                  Your data belongs to you. We only use it to provide the analytics and insights you've requested. 
                  We never sell your data to third parties or use it for advertising purposes.
                </p>
              </div>
            </section>

            {/* Team */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-primary">Built with Love</h2>
              <div className="text-muted-foreground leading-relaxed">
                <p className="mb-4">
                  MyVibeLytics is crafted by music lovers, for music lovers. We understand the emotional connection 
                  people have with their music, and we've built this platform to celebrate and explore that connection.
                </p>
                <div className="glass-effect border-border/30 p-4 rounded-lg">
                  <p className="text-foreground font-semibold mb-2">Contact Us:</p>
                  <p>📧 Email: <a href="mailto:aadityabansal1112@gmail.com" className="text-primary hover:underline">aadityabansal1112@gmail.com</a></p>
                  <p>📝 Contact Form: <Link to="/contact" className="text-primary hover:underline">Contact Page</Link></p>
                  <p>📍 Address: 2-3 Prakash Enclave, Bypass Road, Agra, India</p>
                </div>
              </div>
            </section>

            {/* Call to Action */}
            <section className="text-center pt-8 border-t border-border/20">
              <h2 className="text-xl font-semibold mb-4 text-primary">Ready to Discover Your Music DNA?</h2>
              <p className="text-muted-foreground mb-6">
                Join thousands of music lovers who have already discovered amazing insights about their listening habits.
              </p>
              <div className="flex justify-center space-x-4">
                <Link to="/auth">
                  <Button className="bg-gradient-spotify hover:scale-105 transform transition-all duration-200">
                    Get Started Free
                  </Button>
                </Link>
                <Link to="/buy">
                  <Button variant="outline" className="border-primary/50 text-foreground hover:bg-primary/10">
                    View Premium Features
                  </Button>
                </Link>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Music, ArrowLeft, Shield, Eye, Lock, Database, CheckCircle } from 'lucide-react';

const Privacy = () => {
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
              <Shield className="h-8 w-8 text-primary" />
              <span>Privacy Policy</span>
            </CardTitle>
            <p className="text-muted-foreground text-center">
              Effective Date: June 11, 2025 | Last Updated: June 11, 2025
            </p>
          </CardHeader>
          <CardContent className="space-y-6 text-foreground">
            
            {/* Our Commitments */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="text-center p-4 glass-effect border-border/30 rounded-lg">
                <Eye className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold text-primary">Transparent</h3>
                <p className="text-muted-foreground text-sm">You know exactly what data we collect and why</p>
              </div>
              <div className="text-center p-4 glass-effect border-border/30 rounded-lg">
                <Lock className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold text-primary">Secure</h3>
                <p className="text-muted-foreground text-sm">Your data is protected using industry-leading practices</p>
              </div>
              <div className="text-center p-4 glass-effect border-border/30 rounded-lg">
                <Database className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold text-primary">Controlled</h3>
                <p className="text-muted-foreground text-sm">You're in control of your data and how it's used</p>
              </div>
            </div>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">1. Information We Collect</h2>
              <div className="text-muted-foreground leading-relaxed space-y-3">
                <div className="glass-effect border-border/30 p-4 rounded-lg">
                  <h3 className="font-semibold text-foreground mb-2">Spotify Data (with your consent)</h3>
                  <p className="text-sm mb-2">We access your Spotify account data via Spotify's official API only after you authorize us. This includes:</p>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-center space-x-2"><CheckCircle className="h-3 w-3 text-primary" /><span>Top tracks, artists, and albums</span></li>
                    <li className="flex items-center space-x-2"><CheckCircle className="h-3 w-3 text-primary" /><span>Recently played songs and listening history</span></li>
                    <li className="flex items-center space-x-2"><CheckCircle className="h-3 w-3 text-primary" /><span>Your playlists and saved songs</span></li>
                    <li className="flex items-center space-x-2"><CheckCircle className="h-3 w-3 text-primary" /><span>Basic profile info (name, email, profile picture)</span></li>
                    <li className="flex items-center space-x-2"><CheckCircle className="h-3 w-3 text-primary" /><span>Current playback state and now playing track</span></li>
                  </ul>
                </div>
                <div className="glass-effect border-border/30 p-4 rounded-lg">
                  <h3 className="font-semibold text-foreground mb-2">Usage Data</h3>
                  <p className="text-sm mb-2">To improve our service, we collect data on:</p>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-center space-x-2"><CheckCircle className="h-3 w-3 text-primary" /><span>Your interactions with features</span></li>
                    <li className="flex items-center space-x-2"><CheckCircle className="h-3 w-3 text-primary" /><span>Preferences and selected settings</span></li>
                    <li className="flex items-center space-x-2"><CheckCircle className="h-3 w-3 text-primary" /><span>Device type, browser, IP address, and approximate location</span></li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">2. How We Use Your Data</h2>
              <div className="text-muted-foreground leading-relaxed space-y-2">
                <p><strong className="text-foreground">Personalized Insights:</strong> We process Spotify data to generate detailed listening trends, statistics, and other personalized features.</p>
                <p><strong className="text-foreground">Improve Experience:</strong> We analyze anonymized data to enhance features and performance.</p>
                <p><strong className="text-foreground">Communication:</strong> We may send essential service-related emails. You can opt out of any non-essential communication.</p>
                <p><strong className="text-foreground">Premium Features:</strong> Payment details for premium services are handled securely via PayU.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">3. Data Storage & Security</h2>
              <div className="text-muted-foreground leading-relaxed space-y-2">
                <p><strong className="text-foreground">Secure by Design:</strong> All data is stored using Supabase with encryption in transit and at rest.</p>
                <p><strong className="text-foreground">Limited Access:</strong> Only authorized team members can access your data—and only when necessary.</p>
                <p><strong className="text-foreground">No Password Storage:</strong> We do not store your Spotify credentials; Spotify manages all authentication.</p>
                <p><strong className="text-foreground">Backups:</strong> We regularly back up our database to prevent loss.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">4. Data Sharing</h2>
              <div className="text-muted-foreground leading-relaxed space-y-2">
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20 mb-4">
                  <p className="font-semibold text-foreground">We do not sell or trade your personal data.</p>
                </div>
                <p>We may share limited data only with:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><strong className="text-foreground">Spotify:</strong> For user data access, through its secure API.</li>
                  <li><strong className="text-foreground">PayU:</strong> For secure payment processing of premium features.</li>
                  <li><strong className="text-foreground">Supabase:</strong> As our secure database and authentication provider.</li>
                  <li><strong className="text-foreground">Analytics Tools:</strong> Aggregated and anonymized usage data may be used to help improve service quality.</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">5. Data Retention</h2>
              <p className="text-muted-foreground leading-relaxed">
                We keep your data only as long as needed: While your account is active and for a reasonable period after 
                deletion to comply with legal requirements. You can request data deletion at any time.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">6. International Data Transfers</h2>
              <p className="text-muted-foreground leading-relaxed">
                Your data may be stored or processed outside your country. Regardless of location, we apply the same 
                strong privacy and security standards.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">7. Children's Privacy</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our service is not intended for children under 13. We do not knowingly collect personal data from anyone 
                under this age. If you believe a child has provided us with personal data, contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">8. Updates to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this policy from time to time. We will post updates here with a revised effective date. 
                For major changes, we may notify you via email or in-app.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">9. Contact Us</h2>
              <div className="text-muted-foreground leading-relaxed">
                <p className="mb-3">If you have any questions or concerns about this Privacy Policy, contact us:</p>
                <div className="glass-effect border-border/30 p-4 rounded-lg">
                  <p>📧 Email: <a href="mailto:aadityabansal1112@gmail.com" className="text-primary hover:underline">aadityabansal1112@gmail.com</a></p>
                  <p>📝 Contact Form: <Link to="/contact" className="text-primary hover:underline">Contact Page</Link></p>
                  <p>📍 Address: 2-3 Prakash Enclave, Bypass Road, Agra, India</p>
                </div>
              </div>
            </section>

            <div className="text-center pt-8 border-t border-border/20">
              <p className="text-muted-foreground text-sm">
                Your privacy is important to us. We're committed to protecting and respecting your personal data.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Privacy;

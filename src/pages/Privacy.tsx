
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Music, ArrowLeft, Shield, Eye, Lock, Database } from 'lucide-react';

const Privacy = () => {
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

      <div className="max-w-4xl mx-auto">
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-white text-center flex items-center justify-center space-x-2">
              <Shield className="h-8 w-8 text-green-400" />
              <span>Privacy Policy</span>
            </CardTitle>
            <p className="text-gray-300 text-center">Last updated: December 12, 2024</p>
          </CardHeader>
          <CardContent className="space-y-6 text-white">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <Eye className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                <h3 className="font-semibold text-blue-400">Transparent</h3>
                <p className="text-gray-300 text-sm">We're clear about what data we collect</p>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <Lock className="h-8 w-8 text-green-400 mx-auto mb-2" />
                <h3 className="font-semibold text-green-400">Secure</h3>
                <p className="text-gray-300 text-sm">Your data is protected with industry standards</p>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <Database className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                <h3 className="font-semibold text-purple-400">Controlled</h3>
                <p className="text-gray-300 text-sm">You have control over your data</p>
              </div>
            </div>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-green-400">1. Information We Collect</h2>
              <div className="text-gray-300 leading-relaxed space-y-3">
                <div className="bg-white/5 p-4 rounded-lg">
                  <h3 className="font-semibold text-white mb-2">Spotify Data (with your permission)</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• Your top tracks, artists, and albums</li>
                    <li>• Recently played songs and listening history</li>
                    <li>• Playlists and saved music</li>
                    <li>• Basic profile information (name, email, profile picture)</li>
                    <li>• Playback state and current playing track</li>
                  </ul>
                </div>
                <div className="bg-white/5 p-4 rounded-lg">
                  <h3 className="font-semibold text-white mb-2">Usage Data</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• How you interact with our application</li>
                    <li>• Feature usage and preferences</li>
                    <li>• Device and browser information</li>
                    <li>• IP address and approximate location</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-green-400">2. How We Use Your Information</h2>
              <div className="text-gray-300 leading-relaxed space-y-2">
                <p><strong>Analytics and Insights:</strong> We analyze your Spotify data to generate personalized music statistics, trends, and insights.</p>
                <p><strong>Service Improvement:</strong> We use aggregated, anonymized data to improve our features and user experience.</p>
                <p><strong>Communication:</strong> We may send you service-related notifications and updates (you can opt out of marketing communications).</p>
                <p><strong>Premium Features:</strong> For paid users, we process payment information through Stripe to provide premium analytics.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-green-400">3. Data Storage and Security</h2>
              <div className="text-gray-300 leading-relaxed space-y-2">
                <p><strong>Secure Storage:</strong> Your data is stored securely using Supabase with encryption at rest and in transit.</p>
                <p><strong>Access Control:</strong> Only authorized personnel can access user data, and only when necessary for service operation.</p>
                <p><strong>Regular Backups:</strong> We maintain regular backups to prevent data loss.</p>
                <p><strong>No Credential Storage:</strong> We never store your Spotify login credentials - authentication is handled entirely by Spotify.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-green-400">4. Data Sharing and Third Parties</h2>
              <div className="text-gray-300 leading-relaxed space-y-2">
                <p><strong>We DO NOT sell your personal data.</strong></p>
                <p><strong>Spotify:</strong> We access your data through Spotify's official API with your consent.</p>
                <p><strong>Stripe:</strong> Payment processing is handled by Stripe for premium subscriptions.</p>
                <p><strong>Supabase:</strong> Our database and authentication provider with strong privacy protections.</p>
                <p><strong>Analytics:</strong> We may use aggregated, anonymized data for service analytics.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-green-400">5. Your Rights and Choices</h2>
              <div className="text-gray-300 leading-relaxed space-y-2">
                <p><strong>Access:</strong> You can view all the data we have about you through your dashboard.</p>
                <p><strong>Deletion:</strong> You can request deletion of your account and all associated data.</p>
                <p><strong>Revoke Access:</strong> You can revoke our access to your Spotify data at any time through Spotify's settings.</p>
                <p><strong>Data Portability:</strong> You can export your analytics data in standard formats.</p>
                <p><strong>Corrections:</strong> You can request corrections to any inaccurate personal information.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-green-400">6. Data Retention</h2>
              <p className="text-gray-300 leading-relaxed">
                We retain your data for as long as your account is active or as needed to provide services. 
                When you delete your account, we remove your personal data within 30 days, except where we're 
                required to retain certain information for legal compliance.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-green-400">7. International Data Transfers</h2>
              <p className="text-gray-300 leading-relaxed">
                Your data may be processed in countries other than your own. We ensure appropriate safeguards 
                are in place to protect your data in accordance with this privacy policy and applicable laws.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-green-400">8. Children's Privacy</h2>
              <p className="text-gray-300 leading-relaxed">
                Our service is not intended for children under 13. We do not knowingly collect personal 
                information from children under 13. If you're a parent and believe your child has provided 
                us with personal information, please contact us.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-green-400">9. Changes to This Policy</h2>
              <p className="text-gray-300 leading-relaxed">
                We may update this privacy policy from time to time. We will notify you of any changes by 
                posting the new policy on this page and updating the "last updated" date. For significant 
                changes, we may also send you an email notification.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-green-400">10. Contact Us</h2>
              <div className="text-gray-300 leading-relaxed">
                <p className="mb-3">If you have any questions about this Privacy Policy, please contact us:</p>
                <div className="bg-white/5 p-4 rounded-lg">
                  <p>Email: privacy@myvibelytics.com</p>
                  <p>Through our contact form: <Link to="/contact" className="text-green-400 hover:underline">Contact Page</Link></p>
                  <p>Address: MyVibeLytics Privacy Team</p>
                </div>
              </div>
            </section>

            <div className="text-center pt-8 border-t border-white/20">
              <p className="text-gray-400 text-sm">
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

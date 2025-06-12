
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Music, ArrowLeft } from 'lucide-react';

const TermsConditions = () => {
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
            <CardTitle className="text-3xl font-bold text-white text-center">
              Terms and Conditions
            </CardTitle>
            <p className="text-gray-300 text-center">Last updated: December 12, 2024</p>
          </CardHeader>
          <CardContent className="space-y-6 text-white">
            <section>
              <h2 className="text-xl font-semibold mb-3 text-green-400">1. Acceptance of Terms</h2>
              <p className="text-gray-300 leading-relaxed">
                By accessing and using MyVibeLytics, you accept and agree to be bound by the terms and provision of this agreement. 
                If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-green-400">2. Service Description</h2>
              <p className="text-gray-300 leading-relaxed">
                MyVibeLytics is a Spotify analytics platform that provides users with insights into their music listening habits. 
                Our service analyzes your Spotify data to provide personalized music statistics, trends, and recommendations.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-green-400">3. Data Usage and Privacy</h2>
              <div className="text-gray-300 leading-relaxed space-y-2">
                <p>
                  We access your Spotify data only with your explicit permission through Spotify's OAuth system.
                </p>
                <p>
                  Your data is used solely to provide the analytics and insights shown in our application.
                </p>
                <p>
                  We do not store your Spotify login credentials or sell your personal data to third parties.
                </p>
                <p>
                  For more details, please review our Privacy Policy.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-green-400">4. Premium Features</h2>
              <p className="text-gray-300 leading-relaxed">
                Some features of MyVibeLytics require a premium subscription. Premium features are clearly marked in the application. 
                Payment for premium features is processed through Stripe and is subject to their terms of service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-green-400">5. User Responsibilities</h2>
              <div className="text-gray-300 leading-relaxed space-y-2">
                <p>You are responsible for maintaining the confidentiality of your account.</p>
                <p>You agree not to use the service for any unlawful or prohibited activities.</p>
                <p>You will not attempt to reverse engineer or interfere with the service's functionality.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-green-400">6. Limitation of Liability</h2>
              <p className="text-gray-300 leading-relaxed">
                MyVibeLytics shall not be liable for any indirect, incidental, special, consequential, or punitive damages, 
                or any loss of profits or revenues, whether incurred directly or indirectly.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-green-400">7. Service Availability</h2>
              <p className="text-gray-300 leading-relaxed">
                We strive to maintain 99.9% uptime, but we do not guarantee uninterrupted service. 
                We may temporarily suspend the service for maintenance or updates.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-green-400">8. Cancellation and Refunds</h2>
              <p className="text-gray-300 leading-relaxed">
                Premium subscriptions can be cancelled at any time. You will continue to have access to premium features 
                until the end of your billing period. Refunds are handled on a case-by-case basis.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-green-400">9. Changes to Terms</h2>
              <p className="text-gray-300 leading-relaxed">
                We reserve the right to modify these terms at any time. Users will be notified of significant changes 
                via email or through the application interface.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-green-400">10. Contact Information</h2>
              <p className="text-gray-300 leading-relaxed">
                For questions about these Terms and Conditions, please contact us through our contact page 
                or email us at legal@myvibelytics.com.
              </p>
            </section>

            <div className="text-center pt-8 border-t border-white/20">
              <p className="text-gray-400 text-sm">
                By using MyVibeLytics, you acknowledge that you have read and understood these terms and agree to be bound by them.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TermsConditions;

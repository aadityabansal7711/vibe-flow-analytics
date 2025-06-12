
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Music, ArrowLeft, FileText, Shield, AlertTriangle } from 'lucide-react';

const TermsConditions = () => {
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
              <FileText className="h-8 w-8 text-primary" />
              <span>Terms & Conditions</span>
            </CardTitle>
            <p className="text-muted-foreground text-center">Effective Date: June 11, 2025</p>
          </CardHeader>
          <CardContent className="space-y-6 text-foreground">
            
            <div className="p-4 bg-primary/10 rounded-lg border border-primary/20 text-center">
              <p className="text-muted-foreground">
                By using MyVibeLytics, you agree to the following terms. If you disagree with any part of these terms, please do not use the service.
              </p>
            </div>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">1. Usage License</h2>
              <p className="text-muted-foreground leading-relaxed">
                You are granted a limited, non-exclusive, non-transferable license to use MyVibeLytics for personal, 
                non-commercial purposes. This license allows you to access and use our music analytics features in 
                accordance with these terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">2. Account Responsibility</h2>
              <div className="text-muted-foreground leading-relaxed space-y-2">
                <p>You are responsible for:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Maintaining the confidentiality of your Spotify account connection</li>
                  <li>All activities that occur through your account</li>
                  <li>Ensuring your account information is accurate and up to date</li>
                  <li>Notifying us immediately of any unauthorized account access</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">3. Acceptable Use</h2>
              <div className="text-muted-foreground leading-relaxed space-y-2">
                <p>You agree not to misuse the service. Prohibited activities include:</p>
                <div className="glass-effect border-red-500/30 p-4 rounded-lg">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Reverse engineering or attempting to extract source code</li>
                    <li>Attempting unauthorized access to our systems or other users' accounts</li>
                    <li>Using the service for any illegal or harmful activities</li>
                    <li>Interfering with or disrupting the service's functionality</li>
                    <li>Creating fake accounts or impersonating others</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">4. Modifications</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update the platform, add new features, or modify these terms from time to time. Continued use 
                of MyVibeLytics after any changes implies acceptance of the updated terms. We will notify users of 
                significant changes via email or in-app notifications.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">5. Termination</h2>
              <div className="text-muted-foreground leading-relaxed space-y-2">
                <p>We reserve the right to suspend or terminate access if these terms are violated. Grounds for termination include:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Violation of acceptable use policies</li>
                  <li>Fraudulent or illegal activities</li>
                  <li>Repeated violations after warnings</li>
                  <li>Failure to pay for premium services</li>
                </ul>
                <p className="mt-3">
                  Upon termination, your right to use the service ceases immediately, but these terms will continue 
                  to apply to any prior use of the service.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">6. Third-Party Services</h2>
              <div className="text-muted-foreground leading-relaxed space-y-2">
                <div className="flex items-start space-x-3 p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                  <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">Important Notice</p>
                    <p>Spotify and PayU are third-party platforms. We are not liable for issues originating from their services.</p>
                  </div>
                </div>
                <p>
                  Our service integrates with Spotify for music data and PayU for payment processing. Your use of these 
                  third-party services is governed by their respective terms of service and privacy policies.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">7. Service Availability</h2>
              <p className="text-muted-foreground leading-relaxed">
                While we strive to maintain high availability, we do not guarantee uninterrupted service. We may 
                temporarily suspend the service for maintenance, updates, or due to circumstances beyond our control. 
                We will provide advance notice when possible.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">8. Intellectual Property</h2>
              <p className="text-muted-foreground leading-relaxed">
                MyVibeLytics and its features, design, and content are protected by intellectual property rights. 
                You may not copy, modify, distribute, or create derivative works based on our service without 
                explicit permission.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">9. Limitation of Liability</h2>
              <div className="text-muted-foreground leading-relaxed">
                <div className="p-4 glass-effect border-border/30 rounded-lg">
                  <p className="font-semibold text-foreground mb-2">Disclaimer</p>
                  <p className="text-sm">
                    MyVibeLytics is provided "as is" without warranties of any kind. We shall not be liable for any 
                    indirect, incidental, special, consequential, or punitive damages, or any loss of profits or 
                    revenues, whether incurred directly or indirectly.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">10. Contact Information</h2>
              <div className="text-muted-foreground leading-relaxed">
                <p className="mb-3">For questions about these Terms and Conditions:</p>
                <div className="glass-effect border-border/30 p-4 rounded-lg">
                  <p>📧 Email: <a href="mailto:aadityabansal1112@gmail.com" className="text-primary hover:underline">aadityabansal1112@gmail.com</a></p>
                  <p>📝 Contact Form: <Link to="/contact" className="text-primary hover:underline">Contact Page</Link></p>
                  <p>📍 Address: 2-3 Prakash Enclave, Bypass Road, Agra, India</p>
                </div>
              </div>
            </section>

            <div className="text-center pt-8 border-t border-border/20">
              <p className="text-muted-foreground text-sm">
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

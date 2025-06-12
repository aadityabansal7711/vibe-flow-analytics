
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Music, ArrowLeft, CreditCard, XCircle } from 'lucide-react';

const RefundPolicy = () => {
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
              <XCircle className="h-8 w-8 text-red-400" />
              <span>Refund Policy</span>
            </CardTitle>
            <p className="text-muted-foreground text-center">Effective Date: June 11, 2025</p>
          </CardHeader>
          <CardContent className="space-y-6 text-foreground">
            
            <div className="text-center p-6 bg-red-500/10 rounded-lg border border-red-500/20">
              <CreditCard className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-red-400 mb-2">No Refund Policy</h2>
              <p className="text-muted-foreground">
                Since MyVibeLytics is a digital service with premium access features, we maintain a strict no-refund policy once a payment is processed.
              </p>
            </div>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">Before You Purchase</h2>
              <div className="text-muted-foreground leading-relaxed space-y-2">
                <p>
                  We strongly encourage all users to thoroughly explore our free version before upgrading to premium. 
                  The free tier provides access to basic analytics and gives you a good understanding of what our service offers.
                </p>
                <p>
                  By using the free version, you can evaluate whether MyVibeLytics meets your needs before making any financial commitment.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">Why No Refunds?</h2>
              <div className="text-muted-foreground leading-relaxed space-y-2">
                <p><strong>Digital Nature:</strong> MyVibeLytics is a digital service that provides immediate access to premium features upon payment.</p>
                <p><strong>Data Processing:</strong> Once you purchase premium access, our systems immediately begin processing your Spotify data to generate advanced analytics.</p>
                <p><strong>Instant Access:</strong> Premium features are activated immediately after successful payment, providing you with instant value.</p>
                <p><strong>Free Trial Alternative:</strong> Our comprehensive free tier serves as an extended trial period.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">Exceptional Circumstances</h2>
              <div className="text-muted-foreground leading-relaxed space-y-2">
                <p>
                  While we maintain a strict no-refund policy, we may consider refunds in the following exceptional circumstances:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Technical issues on our end that prevent you from accessing premium features</li>
                  <li>Duplicate payments due to payment processing errors</li>
                  <li>Unauthorized transactions (subject to verification)</li>
                </ul>
                <p className="mt-3">
                  If you believe you qualify for a refund under these exceptional circumstances, please contact us immediately 
                  at <a href="mailto:aadityabansal1112@gmail.com" className="text-primary hover:underline">aadityabansal1112@gmail.com</a> 
                  with your payment details and a detailed explanation.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">Subscription Management</h2>
              <div className="text-muted-foreground leading-relaxed space-y-2">
                <p>
                  You can cancel your premium subscription at any time to prevent future charges. However, cancellation 
                  does not entitle you to a refund for the current billing period.
                </p>
                <p>
                  After cancellation, you will continue to have access to premium features until the end of your current billing period.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">Contact Us</h2>
              <div className="text-muted-foreground leading-relaxed">
                <p className="mb-3">If you have questions about this refund policy or need assistance:</p>
                <div className="glass-effect border-border/30 p-4 rounded-lg">
                  <p>📧 Email: <a href="mailto:aadityabansal1112@gmail.com" className="text-primary hover:underline">aadityabansal1112@gmail.com</a></p>
                  <p>📝 Contact Form: <Link to="/contact" className="text-primary hover:underline">Contact Page</Link></p>
                  <p>📍 Address: 2-3 Prakash Enclave, Bypass Road, Agra, India</p>
                </div>
              </div>
            </section>

            <div className="text-center pt-8 border-t border-border/20">
              <p className="text-muted-foreground text-sm">
                By purchasing premium access, you acknowledge that you have read and agree to this refund policy.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RefundPolicy;

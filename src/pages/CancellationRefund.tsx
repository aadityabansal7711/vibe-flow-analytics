
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Music, ArrowLeft, Calendar, XCircle, Clock, CreditCard } from 'lucide-react';

const CancellationRefund = () => {
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
              <Calendar className="h-8 w-8 text-primary" />
              <span>Cancellation & Refund Policy</span>
            </CardTitle>
            <p className="text-muted-foreground text-center">Effective Date: June 17, 2025</p>
          </CardHeader>
          <CardContent className="space-y-8 text-foreground">
            
            {/* Cancellation Section */}
            <section>
              <div className="flex items-center space-x-2 mb-4">
                <Calendar className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-semibold text-primary">Cancellation Policy</h2>
              </div>
              
              <div className="space-y-4">
                <div className="text-muted-foreground leading-relaxed space-y-2">
                  <p>
                    Users can cancel their premium subscriptions at any time without penalty. We believe in providing 
                    flexibility and control over your subscription.
                  </p>
                  <p>
                    Cancellation can be done through your account settings or by contacting our support team directly.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-foreground">How to Cancel</h3>
                  
                  <div className="glass-effect border-border/30 p-4 rounded-lg">
                    <h4 className="font-semibold text-foreground mb-2">Method 1: Account Settings</h4>
                    <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                      <li>Log in to your MyVibeLytics account</li>
                      <li>Navigate to your Profile page</li>
                      <li>Click on "Subscription Management"</li>
                      <li>Select "Cancel Subscription"</li>
                      <li>Confirm your cancellation</li>
                    </ol>
                  </div>
                  
                  <div className="glass-effect border-border/30 p-4 rounded-lg">
                    <h4 className="font-semibold text-foreground mb-2">Method 2: Contact Support</h4>
                    <p className="text-muted-foreground">Email us at <a href="mailto:aadityabansal1112@gmail.com" className="text-primary hover:underline">aadityabansal1112@gmail.com</a> with:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4 mt-2 text-muted-foreground">
                      <li>Your account email address</li>
                      <li>Request for subscription cancellation</li>
                      <li>Reason for cancellation (optional but helpful)</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <Clock className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold text-primary">When Cancellation Takes Effect</p>
                    <p className="text-muted-foreground">Cancellations will take effect from the next billing cycle, not immediately. This means you will continue to have access to all premium features until the end of your current billing period.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Refund Section */}
            <section>
              <div className="flex items-center space-x-2 mb-4">
                <XCircle className="h-6 w-6 text-red-400" />
                <h2 className="text-2xl font-semibold text-red-400">Refund Policy</h2>
              </div>

              <div className="text-center p-6 bg-red-500/10 rounded-lg border border-red-500/20 mb-4">
                <CreditCard className="h-12 w-12 text-red-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-red-400 mb-2">No Refund Policy</h3>
                <p className="text-muted-foreground">
                  Since MyVibeLytics is a digital service with premium access features, we maintain a strict no-refund policy once a payment is processed.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Before You Purchase</h3>
                <div className="text-muted-foreground leading-relaxed space-y-2">
                  <p>
                    We strongly encourage all users to thoroughly explore our free version before upgrading to premium. 
                    The free tier provides access to basic analytics and gives you a good understanding of what our service offers.
                  </p>
                </div>

                <h3 className="text-lg font-semibold text-foreground">Why No Refunds?</h3>
                <div className="text-muted-foreground leading-relaxed space-y-2">
                  <p><strong>Digital Nature:</strong> MyVibeLytics is a digital service that provides immediate access to premium features upon payment.</p>
                  <p><strong>Data Processing:</strong> Once you purchase premium access, our systems immediately begin processing your Spotify data to generate advanced analytics.</p>
                  <p><strong>Instant Access:</strong> Premium features are activated immediately after successful payment, providing you with instant value.</p>
                  <p><strong>Free Trial Alternative:</strong> Our comprehensive free tier serves as an extended trial period.</p>
                </div>

                <h3 className="text-lg font-semibold text-foreground">Exceptional Circumstances</h3>
                <div className="text-muted-foreground leading-relaxed space-y-2">
                  <p>While we maintain a strict no-refund policy, we may consider refunds in the following exceptional circumstances:</p>
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
              </div>
            </section>

            {/* After Cancellation */}
            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">After Cancellation</h2>
              <div className="text-muted-foreground leading-relaxed space-y-2">
                <p><strong>Continued Access:</strong> You'll maintain premium access until your current billing period ends.</p>
                <p><strong>Data Retention:</strong> Your account and analytics history will be preserved.</p>
                <p><strong>Free Features:</strong> After cancellation, you'll automatically revert to our free tier with basic analytics.</p>
                <p><strong>Re-subscription:</strong> You can reactivate premium features anytime by purchasing a new subscription.</p>
              </div>
            </section>

            {/* Contact Section */}
            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">Need Help?</h2>
              <div className="text-muted-foreground leading-relaxed">
                <p className="mb-3">If you're having trouble with cancellation or have questions about refunds:</p>
                <div className="glass-effect border-border/30 p-4 rounded-lg">
                  <p>📧 Email: <a href="mailto:aadityabansal1112@gmail.com" className="text-primary hover:underline">aadityabansal1112@gmail.com</a></p>
                  <p>📝 Contact Form: <Link to="/contact" className="text-primary hover:underline">Contact Page</Link></p>
                  <p>📍 Address: 2-3 Prakash Enclave, Bypass Road, Agra, India</p>
                </div>
              </div>
            </section>

            <div className="text-center pt-8 border-t border-border/20">
              <p className="text-muted-foreground text-sm">
                We're committed to making cancellation as easy as signing up. Your satisfaction is our priority.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CancellationRefund;

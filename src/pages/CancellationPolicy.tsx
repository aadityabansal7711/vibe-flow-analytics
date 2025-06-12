
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Music, ArrowLeft, Calendar, Clock } from 'lucide-react';

const CancellationPolicy = () => {
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
              <span>Cancellation Policy</span>
            </CardTitle>
            <p className="text-muted-foreground text-center">Effective Date: June 11, 2025</p>
          </CardHeader>
          <CardContent className="space-y-6 text-foreground">
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">Easy Cancellation</h2>
              <div className="text-muted-foreground leading-relaxed space-y-2">
                <p>
                  Users can cancel their premium subscriptions at any time without penalty. We believe in providing 
                  flexibility and control over your subscription.
                </p>
                <p>
                  Cancellation can be done through your account settings or by contacting our support team directly.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">How to Cancel</h2>
              <div className="text-muted-foreground leading-relaxed space-y-3">
                <div className="glass-effect border-border/30 p-4 rounded-lg">
                  <h3 className="font-semibold text-foreground mb-2">Method 1: Account Settings</h3>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Log in to your MyVibeLytics account</li>
                    <li>Navigate to your Profile page</li>
                    <li>Click on "Subscription Management"</li>
                    <li>Select "Cancel Subscription"</li>
                    <li>Confirm your cancellation</li>
                  </ol>
                </div>
                
                <div className="glass-effect border-border/30 p-4 rounded-lg">
                  <h3 className="font-semibold text-foreground mb-2">Method 2: Contact Support</h3>
                  <p>Email us at <a href="mailto:aadityabansal1112@gmail.com" className="text-primary hover:underline">aadityabansal1112@gmail.com</a> with:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                    <li>Your account email address</li>
                    <li>Request for subscription cancellation</li>
                    <li>Reason for cancellation (optional but helpful)</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">When Cancellation Takes Effect</h2>
              <div className="text-muted-foreground leading-relaxed space-y-2">
                <div className="flex items-start space-x-3 p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <Clock className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">Next Billing Cycle</p>
                    <p>Cancellations will take effect from the next billing cycle, not immediately.</p>
                  </div>
                </div>
                <p>
                  This means you will continue to have access to all premium features until the end of your current 
                  billing period, ensuring you get the full value from your payment.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">After Cancellation</h2>
              <div className="text-muted-foreground leading-relaxed space-y-2">
                <p><strong>Continued Access:</strong> You'll maintain premium access until your current billing period ends.</p>
                <p><strong>Data Retention:</strong> Your account and analytics history will be preserved.</p>
                <p><strong>Free Features:</strong> After cancellation, you'll automatically revert to our free tier with basic analytics.</p>
                <p><strong>Re-subscription:</strong> You can reactivate premium features anytime by purchasing a new subscription.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">Important Notes</h2>
              <div className="text-muted-foreground leading-relaxed space-y-2">
                <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                  <p className="font-semibold text-red-400 mb-2">No Partial Refunds</p>
                  <p>
                    No partial refunds are issued for unused subscription periods. Your subscription remains 
                    active until the end of the current billing cycle.
                  </p>
                </div>
                <p>
                  <strong>Billing Cycle:</strong> Monthly subscriptions end 30 days from purchase date. 
                  Annual subscriptions end 365 days from purchase date.
                </p>
                <p>
                  <strong>Confirmation:</strong> You will receive an email confirmation once your cancellation is processed.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">Need Help?</h2>
              <div className="text-muted-foreground leading-relaxed">
                <p className="mb-3">If you're having trouble with cancellation or have questions:</p>
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

export default CancellationPolicy;

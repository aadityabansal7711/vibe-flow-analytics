
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

const FAQ = () => (
  <Card className="glass-effect border-border/50">
    <CardHeader>
      <CardTitle className="text-foreground text-2xl text-center">Frequently Asked Questions</CardTitle>
    </CardHeader>
    <CardContent className="space-y-6">
      <div>
        <h4 className="text-foreground font-semibold mb-2 text-lg">What payment methods do you accept?</h4>
        <p className="text-muted-foreground leading-relaxed">We accept all major credit cards, debit cards, and digital payment methods through Stripe.</p>
      </div>
      <div>
        <h4 className="text-foreground font-semibold mb-2 text-lg">Can I cancel anytime?</h4>
        <p className="text-muted-foreground leading-relaxed">Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.</p>
      </div>
      <div>
        <h4 className="text-foreground font-semibold mb-2 text-lg">Is my Spotify data safe?</h4>
        <p className="text-muted-foreground leading-relaxed">Absolutely. We only access your listening data with your permission and never store your Spotify login credentials.</p>
      </div>
    </CardContent>
  </Card>
);

export default FAQ;

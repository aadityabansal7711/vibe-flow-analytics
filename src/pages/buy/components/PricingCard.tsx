
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Crown, Shield, Sparkles, ArrowRight } from "lucide-react";

type Feature = { name: string; included?: boolean; icon: React.ReactElement };
type Pricing = { symbol: string; price: number | string; period: string };

interface PricingCardProps {
  plan: "Free" | "Premium";
  pricing: Pricing;
  features: Feature[];
  isUnlocked: boolean;
  onPurchase: () => void;
}

const PricingCard: React.FC<PricingCardProps> = ({
  plan,
  pricing,
  features,
  isUnlocked,
  onPurchase,
}) => {
  const isFree = plan === "Free";
  return (
    <Card className={`glass-effect card-hover border-border/50 relative ${!isFree && 'border-primary/50 overflow-hidden transform scale-105'}`}>
      {!isFree && (
        <>
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-spotify"></div>
          <div className="absolute top-4 right-4 bg-gradient-spotify text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
            <Crown className="h-3 w-3" />
            <span>Popular</span>
          </div>
        </>
      )}
      <CardHeader className="text-center pb-8">
        <CardTitle className="text-foreground text-2xl mb-4">{plan}</CardTitle>
        <div className={`font-bold mb-2 ${isFree ? 'text-4xl text-foreground' : 'text-5xl text-gradient'}`}>
          {pricing.symbol}{isFree ? 0 : pricing.price}
          <span className="text-lg font-normal text-muted-foreground">/{pricing.period}</span>
        </div>
        <p className={isFree ? "text-muted-foreground" : "text-primary text-sm font-semibold"}>
          {isFree ? "Perfect to get started" : "Everything in Free, plus all premium features"}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-8">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-3">
              <Check className={`h-5 w-5 flex-shrink-0 text-primary`} />
              <div className={`${feature.included ? 'text-muted-foreground bg-muted' : 'text-primary bg-primary/10'} p-1 rounded-lg`}>
                {feature.icon}
              </div>
              <span className={`${feature.included ? 'text-muted-foreground' : 'text-foreground font-medium'}`}>{feature.name}</span>
            </div>
          ))}
        </div>
        {isFree ? (
          <Button className="w-full" variant="outline" disabled>Current Plan</Button>
        ) : (
          isUnlocked ? (
            <Button className="w-full bg-muted text-muted-foreground" disabled>
              <Shield className="mr-2 h-4 w-4" />
              Already Unlocked
            </Button>
          ) : (
            <Button 
              onClick={onPurchase}
              className="w-full bg-gradient-spotify hover:scale-105 transform transition-all duration-200 shadow-lg hover:shadow-xl text-primary-foreground font-semibold"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Unlock Premium
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )
        )}
      </CardContent>
    </Card>
  );
};

export default PricingCard;


import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Star, Zap } from "lucide-react";

const features = [
  {
    title: "Advanced Analytics",
    desc: "Deep insights into your listening patterns and musical evolution over time",
    icon: <TrendingUp className="h-12 w-12 text-primary mx-auto group-hover:scale-110 transition-transform duration-200" />,
  },
  {
    title: "Music Personality",
    desc: "Discover your unique musical identity and taste preferences",
    icon: <Star className="h-12 w-12 text-primary mx-auto group-hover:scale-110 transition-transform duration-200" />,
  },
  {
    title: "AI-Powered Features",
    desc: "Smart playlist generation and hidden gem discovery powered by AI",
    icon: <Zap className="h-12 w-12 text-primary mx-auto group-hover:scale-110 transition-transform duration-200" />,
  },
];

const FeatureShowcase = () => (
  <div className="grid md:grid-cols-3 gap-6 mb-16">
    {features.map((feature, i) => (
      <Card key={i} className="glass-effect card-hover border-border/50 text-center group">
        <CardContent className="p-8">
          <div className="relative mb-6">
            {feature.icon}
            <div className="absolute inset-0 h-12 w-12 text-primary/20 animate-pulse rounded-full mx-auto"></div>
          </div>
          <h3 className="text-foreground font-bold text-lg mb-3">{feature.title}</h3>
          <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
        </CardContent>
      </Card>
    ))}
  </div>
);

export default FeatureShowcase;

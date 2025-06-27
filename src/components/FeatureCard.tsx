
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  isLocked: boolean;
  children?: React.ReactNode;
  className?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  isLocked,
  children,
  className = ""
}) => {
  const { profile } = useAuth();
  
  // Check if user has premium subscription
  const hasPremium = profile?.has_active_subscription || profile?.plan_tier === 'premium';
  const shouldShowLocked = isLocked && !hasPremium;

  return (
    <Card className={`relative overflow-hidden glass-effect hover:bg-primary/10 transition-all duration-300 ${className}`}>
      {shouldShowLocked && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="text-center">
            <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-foreground mb-4 font-semibold">Premium Feature</p>
            <Link to="/pricing">
              <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground">
                <Sparkles className="mr-2 h-4 w-4" />
                Unlock All Features
              </Button>
            </Link>
          </div>
        </div>
      )}
      
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-foreground">
          {icon}
          <span>{title}</span>
        </CardTitle>
        <p className="text-muted-foreground text-sm">{description}</p>
      </CardHeader>
      
      {children && (
        <CardContent className={shouldShowLocked ? 'blur-sm' : ''}>
          {children}
        </CardContent>
      )}
    </Card>
  );
};

export default FeatureCard;


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  children?: React.ReactNode;
  isLocked?: boolean;
  className?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  children,
  isLocked = false,
  className = ""
}) => {
  const { profile } = useAuth();
  
  // Check if user has premium access
  const isPremium = profile?.has_active_subscription || profile?.plan_tier === 'premium';
  const shouldShowLocked = isLocked && !isPremium;

  return (
    <Card className={`glass-effect border-border/50 overflow-hidden card-hover ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {icon}
            <CardTitle className="text-lg text-foreground">{title}</CardTitle>
          </div>
          {shouldShowLocked && (
            <Badge variant="secondary" className="text-xs">
              <Lock className="w-3 h-3 mr-1" />
              Premium
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      
      <CardContent className="pt-0">
        {shouldShowLocked ? (
          <div className="text-center py-8 space-y-4">
            <Lock className="w-12 h-12 text-muted-foreground mx-auto opacity-50" />
            <div>
              <p className="text-sm text-muted-foreground mb-3">
                This feature is available with Premium
              </p>
              <Link to="/buy">
                <Button size="sm" className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                  Unlock All Features
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
};

export default FeatureCard;

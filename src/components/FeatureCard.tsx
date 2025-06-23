
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lock } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  isLocked?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, isLocked = false, children, className }) => {
  return (
    <Card className={`glass-effect border-border/50 p-6 hover:scale-105 transition-all duration-300 ${isLocked ? 'opacity-75' : ''} ${className || ''}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              {icon}
            </div>
            <CardTitle className="text-lg font-semibold text-foreground">{title}</CardTitle>
          </div>
          {isLocked && (
            <Badge variant="outline" className="text-yellow-400 border-yellow-400">
              <Lock className="mr-1 h-3 w-3" />
              Premium
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-muted-foreground leading-relaxed">
          {description}
        </CardDescription>
        {children && <div className="mt-4">{children}</div>}
      </CardContent>
    </Card>
  );
};

export default FeatureCard;

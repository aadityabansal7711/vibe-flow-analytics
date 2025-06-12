
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

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
  return (
    <Card className={`relative overflow-hidden bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-lg border-white/10 hover:border-white/20 transition-all duration-300 ${className}`}>
      {isLocked && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="text-center">
            <Lock className="h-12 w-12 text-white/70 mx-auto mb-4" />
            <p className="text-white/90 mb-4 font-semibold">Premium Feature</p>
            <Link to="/buy">
              <Button className="bg-gradient-to-r from-green-400 to-blue-400 hover:from-green-500 hover:to-blue-500 text-white">
                <Sparkles className="mr-2 h-4 w-4" />
                Unlock All Features
              </Button>
            </Link>
          </div>
        </div>
      )}
      
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-white">
          {icon}
          <span>{title}</span>
        </CardTitle>
        <p className="text-gray-300 text-sm">{description}</p>
      </CardHeader>
      
      {children && (
        <CardContent className={isLocked ? 'blur-sm' : ''}>
          {children}
        </CardContent>
      )}
    </Card>
  );
};

export default FeatureCard;

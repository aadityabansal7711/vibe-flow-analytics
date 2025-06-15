
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Music } from "lucide-react";

type Props = {
  user: any;
};

const BuyHeader: React.FC<Props> = ({ user }) => (
  <nav className="sticky top-0 z-50 glass-effect-strong border-b border-border/50">
    <div className="max-w-7xl mx-auto flex items-center justify-between p-6">
      <Link to="/" className="flex items-center space-x-3">
        <div className="relative">
          <Music className="h-8 w-8 text-primary animate-pulse-slow" />
          <div className="absolute inset-0 h-8 w-8 text-primary/30 animate-ping"></div>
        </div>
        <span className="text-2xl font-bold text-gradient">MyVibeLytics</span>
      </Link>
      <Link to={user ? "/dashboard" : "/"}>
        <Button variant="outline" className="border-primary/50 text-foreground hover:bg-primary/10 hover:border-primary">
          {user ? 'Dashboard' : 'Home'}
        </Button>
      </Link>
    </div>
  </nav>
);

export default BuyHeader;

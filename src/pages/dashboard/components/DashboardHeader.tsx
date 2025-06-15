
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Music, Settings, Sparkles, LogOut } from "lucide-react";

type Props = {
  profile: any;
  user: any;
  isUnlocked: boolean;
  signOut: () => void;
};

const DashboardHeader: React.FC<Props> = ({ profile, user, isUnlocked, signOut }) => (
  <div className="flex justify-between items-center mb-8">
    <div className="flex items-center space-x-4">
      <Link to="/" className="flex items-center space-x-2">
        <Music className="h-8 w-8 text-primary" />
        <span className="text-2xl font-bold text-foreground">MyVibeLytics</span>
      </Link>
      <div className="text-muted-foreground">
        Welcome, {profile?.full_name || user.email}!
      </div>
    </div>
    <div className="flex items-center space-x-4">
      <Link to="/profile">
        <Button variant="outline" className="border-border text-foreground hover:bg-muted">
          <Settings className="mr-2 h-4 w-4" />
          Profile
        </Button>
      </Link>
      {!isUnlocked && (
        <Link to="/buy">
          <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground">
            <Sparkles className="mr-2 h-4 w-4" />
            Unlock Premium
          </Button>
        </Link>
      )}
      <Button onClick={signOut} variant="outline" className="border-border text-foreground hover:bg-muted">
        <LogOut className="mr-2 h-4 w-4" />
        Logout
      </Button>
    </div>
  </div>
);

export default DashboardHeader;

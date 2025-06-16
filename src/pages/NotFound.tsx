
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, AlertCircle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
      <div className="max-w-md w-full mx-auto text-center">
        <div className="glass-effect-strong rounded-2xl p-8 border border-border/50">
          <div className="flex items-center justify-center mb-8">
            <AlertCircle className="h-16 w-16 text-red-400" />
          </div>

          <h1 className="text-4xl font-bold text-gradient mb-4">404</h1>
          <p className="text-xl text-muted-foreground mb-6">Oops! Page not found</p>
          <p className="text-muted-foreground mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>

          <div className="space-y-3">
            <Link to="/">
              <Button className="w-full bg-gradient-spotify hover:scale-105 transform transition-all duration-200">
                <Home className="mr-2 h-4 w-4" />
                Return to Home
              </Button>
            </Link>
            
            <Link to="/demo">
              <Button variant="outline" className="w-full border-border text-foreground hover:bg-muted">
                View Demo
              </Button>
            </Link>
          </div>

          <div className="text-xs text-muted-foreground mt-6">
            <p>Route: {location.pathname}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

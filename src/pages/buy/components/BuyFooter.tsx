
import React from "react";
import { Link } from "react-router-dom";
import { Music } from "lucide-react";

const BuyFooter = () => (
  <footer className="mt-20 border-t border-border/30 glass-effect-strong">
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center space-x-3 mb-6 md:mb-0">
          <Music className="h-6 w-6 text-primary" />
          <span className="text-foreground font-bold text-lg">MyVibeLytics</span>
        </div>
        <div className="flex space-x-8 text-muted-foreground">
          <Link to="/terms" className="hover:text-primary transition-colors duration-200 font-medium">Terms</Link>
          <Link to="/privacy" className="hover:text-primary transition-colors duration-200 font-medium">Privacy</Link>
          <Link to="/contact" className="hover:text-primary transition-colors duration-200 font-medium">Contact</Link>
        </div>
      </div>
      <div className="mt-8 pt-8 border-t border-border/20 text-center">
        <p className="text-muted-foreground text-sm">
          © 2024 MyVibeLytics. Discover your music DNA with beautiful analytics.
        </p>
        <p className="text-muted-foreground text-xs mt-2">
          Owned by Arnam Enterprises | GST: 09ABZFA4207B1ZG
        </p>
      </div>
    </div>
  </footer>
);

export default BuyFooter;

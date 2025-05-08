
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/button";
import { Home, ShoppingCart, User, Menu, Sun, Moon } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
  showNav?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, showNav = true }) => {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {showNav && (
        <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="font-bold text-2xl">HomeMade</span>
            </Link>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/browse" className="text-foreground/80 hover:text-foreground transition-colors">
                Browse Meals
              </Link>
              <Link to="/profile" className="text-foreground/80 hover:text-foreground transition-colors">
                My Profile
              </Link>
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className="rounded-full"
                >
                  {theme === "light" ? (
                    <Moon className="h-5 w-5" />
                  ) : (
                    <Sun className="h-5 w-5" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate("/cart")}
                  className="rounded-full relative"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
                    2
                  </span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate("/profile")}
                  className="rounded-full"
                >
                  <User className="h-5 w-5" />
                </Button>
              </div>
            </nav>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden bg-background border-b animate-slide-down">
              <div className="container mx-auto px-4 py-3 space-y-3">
                <Link
                  to="/browse"
                  className="block text-foreground/80 hover:text-foreground py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Browse Meals
                </Link>
                <Link
                  to="/profile"
                  className="block text-foreground/80 hover:text-foreground py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Profile
                </Link>
                <Link
                  to="/cart"
                  className="block text-foreground/80 hover:text-foreground py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Cart (2)
                </Link>
                <div className="flex items-center py-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleTheme}
                    className="flex items-center"
                  >
                    {theme === "light" ? (
                      <>
                        <Moon className="h-4 w-4 mr-2" />
                        <span>Dark Mode</span>
                      </>
                    ) : (
                      <>
                        <Sun className="h-4 w-4 mr-2" />
                        <span>Light Mode</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </header>
      )}

      <main className="flex-1">
        {children}
      </main>

      {showNav && (
        <footer className="bg-muted py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-semibold text-lg mb-4">HomeMade</h3>
                <p className="text-muted-foreground">
                  Connecting home cooks with food lovers in your community.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li>
                    <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link to="/browse" className="text-muted-foreground hover:text-foreground transition-colors">
                      Browse Meals
                    </Link>
                  </li>
                  <li>
                    <Link to="/signup/cook" className="text-muted-foreground hover:text-foreground transition-colors">
                      Become a Cook
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-4">Contact</h3>
                <p className="text-muted-foreground">
                  support@homemade.com
                </p>
                <p className="text-muted-foreground mt-2">
                  123 Culinary Street, Foodville
                </p>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t text-center text-muted-foreground">
              <p>© {new Date().getFullYear()} HomeMade. All rights reserved.</p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Layout;

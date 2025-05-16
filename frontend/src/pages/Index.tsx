
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { ChefHat, ShoppingBag } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <Layout showNav={false}>
      <div className="min-h-screen flex flex-col">
        <header className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="font-bold text-2xl">HomeMade</div>
          <div className="space-x-2">
            <Button variant="ghost" onClick={() => navigate("/login/client")}>
              Log in
            </Button>

          </div>
        </header>

        <section className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="max-w-4xl w-full text-center space-y-6 animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              Welcome to HomeMade, your go-to for home-cooked meals
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join our community of food lovers and home cooks. Share your passion for food or discover authentic homemade dishes.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 max-w-3xl mx-auto">
              <Button 
                className="h-auto p-4 flex flex-col items-center button-transition max-w-xs mx-auto" 
                onClick={() => navigate("/signup/cook")}
                size="default"
              >
                <h2 className="text-lg font-semibold mb-1">Become a Cook</h2>
                <p className="text-primary-foreground/80 text-xs">
                  Share your culinary creations with the community.
                </p>
              </Button>

              <Button 
                className="h-auto p-4 flex flex-col items-center button-transition max-w-xs mx-auto" 
                onClick={() => navigate("/signup/client")}
                size="default"
              >
                <h2 className="text-lg font-semibold mb-1">Order Food</h2>
                <p className="text-primary-foreground/80 text-xs">
                  Discover authentic home-cooked meals nearby.
                </p>
              </Button>
            </div>
          </div>
        </section>

        <section className="bg-muted py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">How It Works</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We connect passionate home cooks with food lovers in your community
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mx-auto mb-4 text-primary-foreground font-medium">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-2">Create Account</h3>
                <p className="text-muted-foreground">
                  Sign up as a cook or client in just a few minutes
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mx-auto mb-4 text-primary-foreground font-medium">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {`${true ? "Browse Meals" : "List Your Dishes"}`}
                </h3>
                <p className="text-muted-foreground">
                  {`${true ? "Discover delicious home-cooked meals" : "Share your culinary creations"}`}
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mx-auto mb-4 text-primary-foreground font-medium">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {`${true ? "Place Your Order" : "Fulfill Orders"}`}
                </h3>
                <p className="text-muted-foreground">
                  {`${true ? "Enjoy fresh, homemade food delivered to you" : "Cook and deliver your delicious meals"}`}
                </p>
              </div>
            </div>
          </div>
        </section>

        <footer className="bg-background py-8">
          <div className="container mx-auto px-4 text-center">
            <p className="text-muted-foreground">
              © {new Date().getFullYear()} HomeMade. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </Layout>
  );
};

export default Index;

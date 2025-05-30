
import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Layout from "@/components/layout/Layout";
import { ChefHat, ShoppingBag } from "lucide-react";














const Signup = () => {

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    cuisine: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };


  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const isCook = type === "cook";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();


    const payload = {
      ...formData,
      //envoyer le role correspondant
      role: isCook ? "COOK" : "CLIENT",

    };
    //pour enregistrer le role dans le front
    localStorage.setItem("userRole", payload.role);

    console.log("Payload envoyé :", payload); // ← LOG ICI

    try {
      const res = await fetch("http://localhost:8080/auth/signup/client", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),

      });

      if (res.ok) {
        alert("Account created successfully!");
        navigate(isCook ? "/profile" : "/browse");
      } else {
        alert("Failed to register");
      }
    } catch (err) {
      console.error("Error during registration", err);
      alert("Server error");
    }
  };


  const userTypeIcon = isCook ? (
    <ChefHat className="h-6 w-6" />
  ) : (
    <ShoppingBag className="h-6 w-6" />
  );

  return (
    <Layout showNav={false}>
      <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-muted/30">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <Link to="/" className="text-2xl font-bold">
              HomeMade
            </Link>
          </div>
          
          <Card className="w-full animate-scale-in">
            <CardHeader className="space-y-1">
              <div className="flex items-center gap-2 justify-center mb-2">
                {userTypeIcon}
                <CardTitle className="text-2xl">
                  Sign up as {isCook ? "Cook" : "Client"}
                </CardTitle>
              </div>
              <CardDescription>
                Create an account to {isCook ? "share your dishes" : "order delicious meals"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="transition-all duration-200 focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="transition-all duration-200 focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    type="email"
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    type="password"
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary"
                  />
                </div>
                {isCook && (
                  <div className="space-y-2">
                    <Label htmlFor="cuisine">Cuisine Specialty</Label>
                    <Input
                      id="cuisine"
                      placeholder="Italian, Mexican, etc."
                      className="transition-all duration-200 focus:ring-2 focus:ring-primary"
                    />
                  </div>
                )}
                <Button type="submit" className="w-full button-transition">
                  Create Account
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-sm text-muted-foreground text-center">
                Already have an account?{" "}
                <Link
                  to={`/login/${type}`}
                  className="text-primary hover:underline"
                >
                  Log in
                </Link>
              </div>
              <div className="text-center">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/")}
                >
                  Back to Home
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Signup;

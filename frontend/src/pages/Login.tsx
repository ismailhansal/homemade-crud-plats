import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Layout from "@/components/layout/Layout";
import { ChefHat, ShoppingBag } from "lucide-react";

const Login = () => {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const isCook = type === "cook";

  // Définir role en fonction de isCook
  const role = isCook ? "cook" : "client";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/auth/login/client", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }), // Tu peux envoyer role si besoin au backend
      });

      if (!response.ok) {
        throw new Error("Invalid email or password");
      }

      const data = await response.json();
      console.log("le role:" ,role);

      // Stocker token + role dans localStorage (ou autre stockage)
      localStorage.setItem("token", data.token);
      localStorage.setItem("userRole", role);  // <- ici

      // Redirection selon rôle
      navigate(isCook ? "/profile" : "/browse");
      window.location.reload();

    } catch (err: any) {
      setError(err.message || "Login failed");
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
                    Log in as {isCook ? "Cook" : "Client"}
                  </CardTitle>
                </div>
                <CardDescription>
                  Enter your credentials to access your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        placeholder="name@example.com"
                        required
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Button variant="link" className="p-0 h-auto" size="sm">
                        Forgot password?
                      </Button>
                    </div>
                    <Input
                        id="password"
                        required
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  {error && (
                      <p className="text-sm text-red-500 text-center">{error}</p>
                  )}
                  <Button type="submit" className="w-full">
                    Login
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <div className="text-sm text-muted-foreground text-center">
                  Don't have an account?{" "}
                  <Link
                      to={`/signup/${type}`}
                      className="text-primary hover:underline"
                  >
                    Sign up
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

export default Login;

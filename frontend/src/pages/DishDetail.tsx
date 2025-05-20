import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  ChefHat,
  Clock,
  Star,
  MinusCircle,
  PlusCircle,
  Utensils,
  ArrowLeft,
  ThumbsUp,
  MessageSquare,
  Users,
  Info,
  MapPin,
  Loader2
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Plat {
  id: number;
  nom: string;
  description: string;
  prix: number;
  image: string;
  note: number;
  temps_preparation: number;
  type_cuisine: string;
  nombre_personnes: number;
  ingredients: string;
  allergies: string;
  cookName: string;
}

interface CookProfile {
  idCook: number;
  cookRating: number;
  specialty: string;
  cookAddress: string;
  verified: boolean;
  user: {
    firstname: string;
    lastname: string;
    email: string;
    phoneNumber: string;
  };
}

interface OtherDish {
  id: number;
  nom: string;
  prix: number;
  image: string;
  type_cuisine: string;
}

const DishDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [plat, setPlat] = useState<Plat | null>(null);
  const [cookProfile, setCookProfile] = useState<CookProfile | null>(null);
  const [otherDishes, setOtherDishes] = useState<OtherDish[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchDishData = async () => {
      try {
        setIsLoading(true);
        // Fetch the dish data
        const dishResponse = await fetch(`http://localhost:8080/api/plats/${id}`);
        if (!dishResponse.ok) throw new Error("Failed to fetch dish");
        const dishData = await dishResponse.json();
        setPlat(dishData);

        // Fetch cook's other dishes
        const cookDishesResponse = await fetch(`http://localhost:8080/api/plats/my-dishes`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`
          }
        });
        if (cookDishesResponse.ok) {
          const cookDishes = await cookDishesResponse.json();
          setOtherDishes(cookDishes.filter((dish: OtherDish) => dish.id !== parseInt(id)));
        }

      } catch (error) {
        console.error('Fetch error:', error);
        toast({
          title: "Error loading dish",
          description: error instanceof Error ? error.message : "Unknown error",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDishData();
  }, [id]);

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const addToCart = async () => {
    if (!plat) return;

    setIsAddingToCart(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast({
          title: "Authentication required",
          description: "Please login to add items to cart",
          variant: "destructive",
          action: (
              <Button onClick={() => navigate("/login")}>Login</Button>
          )
        });
        return;
      }

      const response = await fetch(
          `http://localhost:8080/api/cart/add?platId=${plat.id}&quantity=${quantity}`,
          {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
      );

      if (!response.ok) {
        throw new Error(await response.text());
      }

      toast({
        title: "Added to cart!",
        description: `${quantity} x ${plat.nom} added to your cart`,
        action: (
            <Button onClick={() => navigate("/cart")}>View Cart</Button>
        )
      });
    } catch (error) {
      console.error("Add to cart error:", error);
      toast({
        title: "Failed to add to cart",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (isLoading) {
    return (
        <Layout>
          <div className="container mx-auto px-4 py-8 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </Layout>
    );
  }

  if (!plat) {
    return (
        <Layout>
          <div className="container mx-auto px-4 py-8">
            <Button
                variant="ghost"
                className="mb-6 pl-0"
                onClick={() => navigate("/browse")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dishes
            </Button>
            <div className="text-center">Dish not found</div>
          </div>
        </Layout>
    );
  }

  // Parse ingredients and allergies from strings to arrays
  const ingredientsList = plat.ingredients.split(',').map(item => item.trim());
  const allergensList = plat.allergies.split(',').map(item => item.trim());

  return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Button
              variant="ghost"
              className="mb-6 pl-0"
              onClick={() => navigate("/browse")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dishes
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3 animate-fade-in">
              <div className="rounded-lg overflow-hidden mb-6">
                <img
                    src={plat.image}
                    alt={plat.nom}
                    className="w-full h-auto object-cover"
                />
              </div>

              {plat.cookName && (
                  <div className="mb-6 p-4 bg-accent rounded-lg">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16 border-2 border-background">
                        <AvatarFallback>
                          <ChefHat className="h-8 w-8" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="text-lg font-semibold">{plat.cookName}</h3>
                            <div className="flex items-center mt-1">
                              <Star className="h-4 w-4 fill-primary text-primary mr-1" />
                              <span className="font-medium text-sm">{plat.note}</span>
                              <span className="text-xs text-muted-foreground ml-1">
                            (reviews coming soon)
                          </span>
                            </div>
                          </div>
                          {cookProfile?.cookAddress && (
                              <div className="flex items-center text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4 mr-1" />
                                {cookProfile.cookAddress}
                              </div>
                          )}
                        </div>
                        {cookProfile?.specialty && (
                            <p className="mt-2 text-sm text-muted-foreground">
                              Specialty: {cookProfile.specialty}
                            </p>
                        )}
                      </div>
                    </div>
                  </div>
              )}

              <Tabs defaultValue="details" className="w-full">
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="pt-4">
                  <h2 className="text-xl font-semibold mb-2">About this dish</h2>
                  <p className="text-muted-foreground mb-4">{plat.description}</p>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                    <div className="flex items-center">
                      <Utensils className="h-5 w-5 mr-2 text-primary" />
                      <span>{plat.type_cuisine} Cuisine</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-primary" />
                      <span>{plat.temps_preparation}&nbsp;min</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-5 w-5 mr-2 text-primary" />
                      <span>Serves {plat.nombre_personnes}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium flex items-center">
                      <Info className="h-4 w-4 mr-2 text-primary"/>
                      Allergens
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {allergensList.map((allergen, index) => (
                          <div
                              key={index}
                              className="bg-muted px-3 py-1 rounded-full text-sm"
                          >
                            {allergen}
                          </div>
                      ))}
                    </div>
                  </div>

                  {otherDishes.length > 0 && (
                      <div className="mt-8">
                        <h3 className="text-xl font-semibold mb-4">More from this cook</h3>
                        <Carousel className="w-full">
                          <CarouselContent>
                            {otherDishes.map((dish) => (
                                <CarouselItem key={dish.id} className="md:basis-1/3">
                                  <Card className="card-hover">
                                    <CardContent className="p-0">
                                      <div
                                          className="cursor-pointer"
                                          onClick={() => navigate(`/dish/${dish.id}`)}
                                      >
                                        <div className="h-40 rounded-t-lg overflow-hidden">
                                          <img
                                              src={dish.image}
                                              alt={dish.nom}
                                              className="w-full h-full object-cover"
                                          />
                                        </div>
                                        <div className="p-4">
                                          <h4 className="font-medium">{dish.nom}</h4>
                                          <div className="flex justify-between items-center mt-2">
                                      <span className="text-primary font-medium">
                                        ${dish.prix.toFixed(2)}
                                      </span>
                                            <span className="text-xs text-muted-foreground">
                                        {dish.type_cuisine}
                                      </span>
                                          </div>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </CarouselItem>
                            ))}
                          </CarouselContent>
                          <CarouselPrevious className="left-2" />
                          <CarouselNext className="right-2" />
                        </Carousel>
                      </div>
                  )}
                </TabsContent>

                <TabsContent value="ingredients" className="pt-4">
                  <h2 className="text-xl font-semibold mb-4">Ingredients</h2>
                  <ul className="space-y-2">
                    {ingredientsList.map((ingredient, index) => (
                        <li key={index} className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-primary mr-3"></div>
                          {ingredient}
                        </li>
                    ))}
                  </ul>
                </TabsContent>

                <TabsContent value="reviews" className="pt-4">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Customer Reviews</h2>
                    <div className="flex items-center">
                      <Star className="h-5 w-5 fill-primary text-primary mr-1" />
                      <span className="font-semibold">{plat.note}</span>
                      <span className="text-muted-foreground ml-1">
                      (reviews coming soon)
                    </span>
                    </div>
                  </div>

                  <div className="text-center text-muted-foreground py-8">
                    No reviews yet. Be the first to review!
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="lg:col-span-2">
              <Card className="sticky top-24 animate-scale-in">
                <CardContent className="pt-6">
                  <h1 className="text-2xl font-bold mb-2">{plat.nom}</h1>
                  <div className="flex items-center mb-4">
                    <Star className="h-4 w-4 fill-primary text-primary mr-1" />
                    <span className="font-medium mr-1">{plat.note}</span>
                    <span className="text-muted-foreground">
                    (reviews coming soon)
                  </span>
                  </div>

                  <div className="py-4 border-t border-b">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold">${plat.prix.toFixed(2)}</span>
                      <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-10 w-10 rounded-full"
                            onClick={decreaseQuantity}
                            disabled={quantity <= 1}
                        >
                          <MinusCircle className="h-5 w-5" />
                        </Button>
                        <span className="w-8 text-center font-medium">{quantity}</span>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-10 w-10 rounded-full"
                            onClick={increaseQuantity}
                        >
                          <PlusCircle className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 space-y-4">
                    <Button
                        className="w-full"
                        size="lg"
                        onClick={addToCart}
                        disabled={isAddingToCart}
                    >
                      {isAddingToCart ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : null}
                      Add to Cart - ${(plat.prix * quantity).toFixed(2)}
                    </Button>
                    <Button variant="outline" className="w-full" size="lg">
                      Buy Now
                    </Button>
                  </div>

                  <div className="mt-6 text-center text-sm text-muted-foreground">
                    Free delivery for orders over $20
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Layout>
  );
};

export default DishDetail;
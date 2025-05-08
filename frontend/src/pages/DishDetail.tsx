
import React, { useState } from "react";
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
  MapPin
} from "lucide-react";

// Sample data based on the ID parameter
const getDishById = (id: string) => {
  const dishes = [
    {
      id: 1,
      name: "Homemade Lasagna",
      description: "Traditional Italian lasagna with béchamel sauce and ground beef filling. Each layer is carefully prepared with fresh ingredients. Served with a side of garlic bread.",
      price: 15.99,
      image: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?auto=format&fit=crop&w=1200&h=800",
      cook: {
        name: "Maria Giordano",
        avatar: "https://images.unsplash.com/photo-1566554273541-37a9ca77b91f?auto=format&fit=crop&w=150&h=150",
        rating: 4.8,
        totalReviews: 124,
        bio: "Italian home cook with 20+ years of experience. I specialize in traditional Italian dishes passed down through generations.",
        location: "Little Italy, NY",
        otherDishes: [
          {
            id: 2,
            name: "Spaghetti Carbonara",
            price: 12.99,
            image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=500&h=300",
            cuisine: "Italian"
          },
          {
            id: 3,
            name: "Tiramisu",
            price: 8.99,
            image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=500&h=300",
            cuisine: "Italian"
          },
          {
            id: 4,
            name: "Risotto Milanese",
            price: 14.99,
            image: "https://images.unsplash.com/photo-1633321702518-7feccafb94d5?auto=format&fit=crop&w=500&h=300",
            cuisine: "Italian"
          },
          {
            id: 5,
            name: "Chicken Cacciatore",
            price: 16.99,
            image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=500&h=300",
            cuisine: "Italian"
          },
          {
            id: 6,
            name: "Osso Buco",
            price: 19.99,
            image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&h=300",
            cuisine: "Italian"
          }
        ]
      },
      cuisine: "Italian",
      deliveryTime: "30-45 min",
      ingredients: ["Pasta sheets", "Ground beef", "Tomato sauce", "Béchamel sauce", "Mozzarella cheese", "Parmesan cheese", "Herbs and spices"],
      allergens: ["Gluten", "Dairy", "Eggs"],
      reviews: [
        { id: 1, user: "John D.", avatar: "", rating: 5, comment: "Best lasagna I've had in a long time!", date: "2 days ago" },
        { id: 2, user: "Sarah W.", avatar: "", rating: 4, comment: "Very tasty and generous portion!", date: "1 week ago" },
        { id: 3, user: "Mike R.", avatar: "", rating: 5, comment: "Absolutely delicious. Will order again!", date: "2 weeks ago" },
      ],
    },
    // More dishes would be added here
  ];
  
  return dishes.find(dish => dish.id === parseInt(id)) || dishes[0];
};

const DishDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dish = getDishById(id || "1");
  const [quantity, setQuantity] = useState(1);

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

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
                src={dish.image}
                alt={dish.name}
                className="w-full h-auto object-cover"
              />
            </div>
            
            <div className="mb-6 p-4 bg-accent rounded-lg">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16 border-2 border-background">
                  <AvatarImage src={dish.cook.avatar} alt={dish.cook.name} />
                  <AvatarFallback>
                    <ChefHat className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{dish.cook.name}</h3>
                      <div className="flex items-center mt-1">
                        <Star className="h-4 w-4 fill-primary text-primary mr-1" />
                        <span className="font-medium text-sm">{dish.cook.rating}</span>
                        <span className="text-xs text-muted-foreground ml-1">
                          ({dish.cook.totalReviews} reviews)
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1" />
                      {dish.cook.location}
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{dish.cook.bio}</p>
                </div>
              </div>
            </div>

            <Tabs defaultValue="details" className="w-full">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="pt-4">
                <h2 className="text-xl font-semibold mb-2">About this dish</h2>
                <p className="text-muted-foreground mb-4">{dish.description}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center">
                    <Utensils className="h-5 w-5 mr-2 text-primary" />
                    <span>{dish.cuisine} Cuisine</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-primary" />
                    <span>{dish.deliveryTime}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-primary" />
                    <span>Serves 1</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium flex items-center">
                    <Info className="h-4 w-4 mr-2 text-primary" />
                    Allergens
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {dish.allergens.map((allergen) => (
                      <div
                        key={allergen}
                        className="bg-muted px-3 py-1 rounded-full text-sm"
                      >
                        {allergen}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4">More from {dish.cook.name}</h3>
                  <Carousel className="w-full">
                    <CarouselContent>
                      {dish.cook.otherDishes.map((otherDish) => (
                        <CarouselItem key={otherDish.id} className="md:basis-1/3">
                          <Card className="card-hover">
                            <CardContent className="p-0">
                              <div 
                                className="cursor-pointer"
                                onClick={() => navigate(`/dish/${otherDish.id}`)}
                              >
                                <div className="h-40 rounded-t-lg overflow-hidden">
                                  <img 
                                    src={otherDish.image} 
                                    alt={otherDish.name} 
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="p-4">
                                  <h4 className="font-medium">{otherDish.name}</h4>
                                  <div className="flex justify-between items-center mt-2">
                                    <span className="text-primary font-medium">
                                      ${otherDish.price.toFixed(2)}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {otherDish.cuisine}
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
              </TabsContent>
              
              <TabsContent value="ingredients" className="pt-4">
                <h2 className="text-xl font-semibold mb-4">Ingredients</h2>
                <ul className="space-y-2">
                  {dish.ingredients.map((ingredient, index) => (
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
                    <span className="font-semibold">{dish.cook.rating}</span>
                    <span className="text-muted-foreground ml-1">
                      ({dish.cook.totalReviews} reviews)
                    </span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {dish.reviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarFallback>{review.user.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{review.user}</div>
                              <div className="text-xs text-muted-foreground">
                                {review.date}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? "fill-primary text-primary"
                                    : "text-muted"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-muted-foreground">{review.comment}</p>
                        <div className="flex items-center gap-4 mt-4">
                          <Button variant="ghost" size="sm" className="h-8">
                            <ThumbsUp className="h-4 w-4 mr-2" />
                            Helpful
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Reply
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:col-span-2">
            <Card className="sticky top-24 animate-scale-in">
              <CardContent className="pt-6">
                <h1 className="text-2xl font-bold mb-2">{dish.name}</h1>
                <div className="flex items-center mb-4">
                  <Star className="h-4 w-4 fill-primary text-primary mr-1" />
                  <span className="font-medium mr-1">{dish.cook.rating}</span>
                  <span className="text-muted-foreground">
                    ({dish.cook.totalReviews} reviews)
                  </span>
                </div>

                <div className="py-4 border-t border-b">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold">${dish.price.toFixed(2)}</span>
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
                  <Button className="w-full" size="lg">
                    Add to Cart - ${(dish.price * quantity).toFixed(2)}
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

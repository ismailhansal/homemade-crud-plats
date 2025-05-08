
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ChefHat, Utensils, Bike, Home, Check, Clock, ArrowLeft } from "lucide-react";

enum OrderStatus {
  Preparing = "Preparing",
  Cooking = "Cooking",
  OnTheWay = "OnTheWay",
  Delivered = "Delivered",
}

const OrderTracking = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<OrderStatus>(OrderStatus.Preparing);
  const [progress, setProgress] = useState(0);
  const [estimatedDelivery, setEstimatedDelivery] = useState<Date>();

  // Simulate order status changes
  useEffect(() => {
    const now = new Date();
    setEstimatedDelivery(new Date(now.getTime() + 45 * 60000)); // 45 minutes from now

    const statusSequence = [
      { status: OrderStatus.Preparing, delay: 3000, progress: 25 },
      { status: OrderStatus.Cooking, delay: 6000, progress: 50 },
      { status: OrderStatus.OnTheWay, delay: 9000, progress: 75 },
      { status: OrderStatus.Delivered, delay: 12000, progress: 100 },
    ];

    statusSequence.forEach((statusStep, index) => {
      setTimeout(() => {
        setStatus(statusStep.status);
        setProgress(statusStep.progress);
      }, statusStep.delay);
    });
  }, []);

  const formatTime = (date?: Date) => {
    if (!date) return "--:--";
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-6 pl-0"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Tracking Order #{id}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Order Status</span>
                    <span className="text-sm font-medium">
                      Estimated Delivery: {formatTime(estimatedDelivery)}
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                <div className="grid grid-cols-4 gap-2 mb-8">
                  <div className="flex flex-col items-center text-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${status === OrderStatus.Preparing || progress >= 25 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                      {progress >= 25 ? <Check className="h-6 w-6" /> : <ChefHat className="h-6 w-6" />}
                    </div>
                    <span className={`text-sm ${status === OrderStatus.Preparing || progress >= 25 ? "font-medium" : "text-muted-foreground"}`}>
                      Preparing
                    </span>
                  </div>
                  
                  <div className="flex flex-col items-center text-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${status === OrderStatus.Cooking || progress >= 50 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                      {progress >= 50 ? <Check className="h-6 w-6" /> : <Utensils className="h-6 w-6" />}
                    </div>
                    <span className={`text-sm ${status === OrderStatus.Cooking || progress >= 50 ? "font-medium" : "text-muted-foreground"}`}>
                      Cooking
                    </span>
                  </div>
                  
                  <div className="flex flex-col items-center text-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${status === OrderStatus.OnTheWay || progress >= 75 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                      {progress >= 75 ? <Check className="h-6 w-6" /> : <Bike className="h-6 w-6" />}
                    </div>
                    <span className={`text-sm ${status === OrderStatus.OnTheWay || progress >= 75 ? "font-medium" : "text-muted-foreground"}`}>
                      On the Way
                    </span>
                  </div>
                  
                  <div className="flex flex-col items-center text-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${status === OrderStatus.Delivered || progress >= 100 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                      {progress >= 100 ? <Check className="h-6 w-6" /> : <Home className="h-6 w-6" />}
                    </div>
                    <span className={`text-sm ${status === OrderStatus.Delivered || progress >= 100 ? "font-medium" : "text-muted-foreground"}`}>
                      Delivered
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-muted rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${status === OrderStatus.Preparing || progress >= 25 ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground"}`}>
                        <ChefHat className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="font-medium">Order Received</h3>
                        <p className="text-sm text-muted-foreground">
                          Your order has been received by the cook
                        </p>
                      </div>
                      <div className="ml-auto text-sm text-muted-foreground">
                        {formatTime(new Date())}
                      </div>
                    </div>
                    
                    {(status === OrderStatus.Preparing || progress >= 25) && (
                      <div className="pl-11 animate-fade-in">
                        <p className="text-sm">
                          Maria is preparing your lasagna with fresh ingredients.
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-muted rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${status === OrderStatus.Cooking || progress >= 50 ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground"}`}>
                        <Utensils className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="font-medium">Cooking in Progress</h3>
                        <p className="text-sm text-muted-foreground">
                          The cook is now preparing your meal
                        </p>
                      </div>
                      {(status === OrderStatus.Cooking || progress >= 50) && (
                        <div className="ml-auto text-sm text-muted-foreground">
                          {formatTime(new Date(Date.now() + 3 * 60000))}
                        </div>
                      )}
                    </div>
                    
                    {(status === OrderStatus.Cooking || progress >= 50) && (
                      <div className="pl-11 animate-fade-in">
                        <p className="text-sm">
                          Your meal is being cooked to perfection.
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-muted rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${status === OrderStatus.OnTheWay || progress >= 75 ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground"}`}>
                        <Bike className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="font-medium">On the Way</h3>
                        <p className="text-sm text-muted-foreground">
                          Your order is out for delivery
                        </p>
                      </div>
                      {(status === OrderStatus.OnTheWay || progress >= 75) && (
                        <div className="ml-auto text-sm text-muted-foreground">
                          {formatTime(new Date(Date.now() + 6 * 60000))}
                        </div>
                      )}
                    </div>
                    
                    {(status === OrderStatus.OnTheWay || progress >= 75) && (
                      <div className="pl-11 animate-fade-in">
                        <p className="text-sm">
                          Alex is delivering your order. Estimated arrival in 20 minutes.
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-muted rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${status === OrderStatus.Delivered || progress >= 100 ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground"}`}>
                        <Home className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="font-medium">Delivered</h3>
                        <p className="text-sm text-muted-foreground">
                          Your order has been delivered
                        </p>
                      </div>
                      {(status === OrderStatus.Delivered || progress >= 100) && (
                        <div className="ml-auto text-sm text-muted-foreground">
                          {formatTime(new Date(Date.now() + 12 * 60000))}
                        </div>
                      )}
                    </div>
                    
                    {(status === OrderStatus.Delivered || progress >= 100) && (
                      <div className="pl-11 animate-fade-in">
                        <p className="text-sm">
                          Your order has been delivered. Enjoy your meal!
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24 animate-scale-in">
              <CardHeader>
                <CardTitle>Order Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Delivery Address</h3>
                  <p className="text-muted-foreground">
                    123 Main Street<br />
                    Apartment 4B<br />
                    New York, NY 10001
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium mb-2">Items</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Homemade Lasagna</span>
                      <span>$15.99</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Chicken Biryani</span>
                      <span>$13.99</span>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>$29.98</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery Fee</span>
                    <span className="text-primary">Free</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>$29.98</span>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate("/browse")}
                  >
                    Order Again
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderTracking;

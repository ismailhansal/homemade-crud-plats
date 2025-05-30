import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MinusCircle, PlusCircle, Trash2, CreditCard, ArrowRight, Wallet } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  cook: string;
}

const Cart = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cash">("card");
  const [loading, setLoading] = useState(true);

  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:8080/api/cart/items", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        },
        credentials: 'include' // Important pour les sessions
      });

      const text = await res.text();

      try {
        const data = text ? JSON.parse(text) : [];

        if (!Array.isArray(data)) {
          throw new Error("La réponse n'est pas un tableau");
        }

        setItems(data.map(item => ({
          id: Number(item.id),
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image || '', // Valeur par défaut
          cook: item.cook || 'Unknown' // Valeur par défaut
        })));
      } catch (parseError) {
        console.error("Erreur de parsing JSON:", parseError);
        throw new Error("Format de réponse invalide");
      }
    } catch (error) {
      console.error("Erreur complète:", error);
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const updateQuantity = async (platId: number, change: number) => {
    try {
      const token = localStorage.getItem("token");
      if (change === 1) {
        await fetch(`http://localhost:8080/api/cart/add?platId=${platId}&quantity=1`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        await fetch(`http://localhost:8080/api/cart/decrease?platId=${platId}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      await fetchCartItems();
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Could not update item quantity",
        variant: "destructive",
      });
    }
  };

  const removeItem = async (platId: number) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:8080/api/cart/remove?platId=${platId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await fetchCartItems();
    } catch (error) {
      toast({
        title: "Removal Failed",
        description: "Could not remove item from cart",
        variant: "destructive",
      });
    }
  };

  const clearCart = async () => {
    try {
      const token = localStorage.getItem("token");
      await fetch("http://localhost:8080/api/cart/clear", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await fetchCartItems();
    } catch (error) {
      toast({
        title: "Clear Failed",
        description: "Could not clear cart",
        variant: "destructive",
      });
    }
  };

  const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
  );

  const deliveryFee = subtotal > 20 ? 0 : 3.99;
  const total = subtotal + deliveryFee;

  const handleProceedToCheckout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (paymentMethod === "cash") {
        await fetch("http://localhost:8080/api/orders/create", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ paymentMethod: "CASH" })
        });
        toast({ title: "Order Placed!", description: "Pay on delivery" });
        navigate("/orders");
      } else {
        setIsPaymentModalOpen(true);
      }
    } catch (error) {
      toast({
        title: "Checkout Failed",
        description: "Could not place order",
        variant: "destructive"
      });
    }
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPaymentModalOpen(false);
    navigate("/tracking/1");
  };

  if (loading) return <Layout>Loading...</Layout>;

  return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

          {items.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-muted-foreground mb-4">Your cart is empty</div>
                <Button onClick={() => navigate("/browse")}>Browse Dishes</Button>
              </div>
          ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <Card className="animate-fade-in">
                    <CardHeader>
                      <CardTitle>Items ({items.length})</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {items.map((item) => (
                          <div key={item.id} className="flex flex-col sm:flex-row gap-4 py-4 border-b last:border-0">
                            <div className="w-24 h-24 rounded-md overflow-hidden flex-shrink-0 mx-auto sm:mx-0">
                              <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 flex flex-col">
                              <div className="flex flex-col sm:flex-row sm:justify-between">
                                <h3 className="font-semibold text-center sm:text-left">{item.name}</h3>
                                <div className="font-semibold text-center sm:text-right">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </div>
                              </div>
                              <div className="text-sm text-muted-foreground text-center sm:text-left">
                                By {item.cook}
                              </div>
                              <div className="flex items-center justify-between mt-auto">
                                <div className="flex items-center gap-3">
                                  <Button
                                      variant="outline"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() => updateQuantity(item.id, -1)}
                                  >
                                    <MinusCircle className="h-4 w-4" />
                                  </Button>
                                  <span>{item.quantity}</span>
                                  <Button
                                      variant="outline"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() => updateQuantity(item.id, 1)}
                                  >
                                    <PlusCircle className="h-4 w-4" />
                                  </Button>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-muted-foreground"
                                    onClick={() => removeItem(item.id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Remove
                                </Button>
                              </div>
                            </div>
                          </div>
                      ))}
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" onClick={() => navigate("/browse")}>
                        Continue Shopping
                      </Button>
                      <Button variant="destructive" onClick={clearCart}>
                        Clear Cart
                      </Button>
                    </CardFooter>
                  </Card>
                </div>

                <div className="lg:col-span-1">
                  <Card className="sticky top-24 animate-scale-in">
                    <CardHeader>
                      <CardTitle>Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Delivery Fee</span>
                        <span>
                      {deliveryFee === 0 ? (
                          <span className="text-primary">Free</span>
                      ) : (
                          `$${deliveryFee.toFixed(2)}`
                      )}
                    </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                      </div>

                      {deliveryFee === 0 && (
                          <div className="text-primary text-sm text-center mt-2">
                            You qualify for free delivery!
                          </div>
                      )}

                      {deliveryFee > 0 && (
                          <div className="text-sm text-center mt-2">
                            Add ${(20 - subtotal).toFixed(2)} more for free delivery
                          </div>
                      )}

                      <div className="pt-4">
                        <Label className="mb-2 block">Payment Method</Label>
                        <RadioGroup defaultValue="card" value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as "card" | "cash")}>
                          <div className="flex items-center space-x-2 border rounded-md p-3 mb-2">
                            <RadioGroupItem value="card" id="card" />
                            <Label htmlFor="card" className="flex items-center cursor-pointer">
                              <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
                              Pay with Card
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 border rounded-md p-3">
                            <RadioGroupItem value="cash" id="cash" />
                            <Label htmlFor="cash" className="flex items-center cursor-pointer">
                              <Wallet className="h-4 w-4 mr-2 text-muted-foreground" />
                              Pay with Cash on Delivery
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                          className="w-full"
                          onClick={handleProceedToCheckout}
                      >
                        Proceed to Checkout
                      </Button>

                      <Dialog open={isPaymentModalOpen && paymentMethod === "card"} onOpenChange={setIsPaymentModalOpen}>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Payment Information</DialogTitle>
                            <DialogDescription>
                              Enter your payment details to complete your order.
                            </DialogDescription>
                          </DialogHeader>

                          <form onSubmit={handleCheckout} className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="card-name">Cardholder Name</Label>
                              <Input
                                  id="card-name"
                                  placeholder="John Doe"
                                  required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="card-number">Card Number</Label>
                              <div className="relative">
                                <Input
                                    id="card-number"
                                    placeholder="1234 5678 9012 3456"
                                    required
                                />
                                <CreditCard className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="expiry">Expiry Date</Label>
                                <Input
                                    id="expiry"
                                    placeholder="MM/YY"
                                    required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="cvv">CVV</Label>
                                <Input
                                    id="cvv"
                                    placeholder="123"
                                    required
                                />
                              </div>
                            </div>

                            <DialogFooter className="mt-6">
                              <Button type="submit" className="w-full">
                                Pay ${total.toFixed(2)}
                              </Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </CardFooter>
                  </Card>
                </div>
              </div>
          )}
        </div>
      </Layout>
  );
};

export default Cart;
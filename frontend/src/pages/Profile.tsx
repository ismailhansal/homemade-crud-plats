import React, { useState, useEffect } from 'react';
import Layout from "@/components/layout/Layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import {
  Pagination, PaginationContent, PaginationItem,
  PaginationLink, PaginationNext, PaginationPrevious
} from "@/components/ui/pagination";
import { Edit, ChefHat, Plus, Trash2, X, MessageCircle } from "lucide-react";
import DishForm from "@/components/forms/DishForm";
import ChatFeature from "@/components/chat/ChatFeature";
import axios from 'axios';                // axios pour faire des requêtes HTTP






// Sample dish data
const SAMPLE_DISHES = [
  {

  },
  {

  },
  {

  },
  {
  },
];

// Sample order data
const SAMPLE_ORDERS = [
  {
    id: 1001,
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    total: 25.99,
    status: "Delivered",
    customer: "John Doe",
    items: [
      { id: 1, name: "Homemade Lasagna", price: 15.99, quantity: 1 },
      { id: 3, name: "Vegetable Stir Fry", price: 10.00, quantity: 1 },
    ],
  },
  {
    id: 1002,
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    total: 30.98,
    status: "In Transit",
    customer: "Sarah Johnson",
    items: [
      { id: 2, name: "Chicken Biryani", price: 13.99, quantity: 1 },
      { id: 3, name: "Vegetable Stir Fry", price: 11.99, quantity: 1 },
      { id: 4, name: "Side Salad", price: 5.00, quantity: 1 },
    ],
  },
  {
    id: 1003,
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    total: 42.97,
    status: "Processing",
    customer: "Michael Brown",
    items: [
      { id: 4, name: "Beef Tacos", price: 12.99, quantity: 2 },
      { id: 1, name: "Homemade Lasagna", price: 15.99, quantity: 1 },
    ],
  },
  {
    id: 1004,
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    total: 27.98,
    status: "Delivered",
    customer: "Emma Wilson",
    items: [
      { id: 1, name: "Homemade Lasagna", price: 15.99, quantity: 1 },
      { id: 3, name: "Vegetable Stir Fry", price: 11.99, quantity: 1 },
    ],
  },
  {
    id: 1005,
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    total: 39.97,
    status: "Delivered",
    customer: "David Garcia",
    items: [
      { id: 2, name: "Chicken Biryani", price: 13.99, quantity: 2 },
      { id: 3, name: "Vegetable Stir Fry", price: 11.99, quantity: 1 },
    ],
  },
];



const Profile: React.FC = () => {


  const handleDishSubmit = async (formData) => {
    try {
      // 1. Ajouter immédiatement le plat à la liste locale avant d'attendre la réponse du serveur
      const newDish = {
        ...formData,
        id: Date.now(),  // Utiliser un ID temporaire si nécessaire
      };

      // Mettre à jour la liste des plats localement
      setDishes(prevDishes => [...prevDishes, newDish]);

      // 2. Envoyer la requête au serveur pour enregistrer le plat
      const response = await axios.post('http://localhost:8080/api/plats/save', formData);
      console.log('Plat créé avec succès:', response.data);

      // 3. Si tu veux t'assurer que l'ID et les données du plat sont corrects, met à jour l'état local
      // (par exemple, si le backend renvoie un ID généré ou modifie des données)
      setDishes(prevDishes =>
          prevDishes.map(dish => (dish.id === newDish.id ? response.data : dish))
      );

      setIsAddingDish(false); // Fermer le formulaire
    } catch (error) {
      console.error('Erreur lors de la création du plat:', error);
      setIsAddingDish(false);
    }
  };



  const handleDishSubmitt = async (formData: any) => {
    try {
      const response = await fetch(`http://localhost:8080/api/plats/${formData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // Pas besoin de transformation
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour du plat");
      }

      const updatedDish = await response.json();
      console.log("Plat mis à jour avec succès :", updatedDish);

      // Met à jour l'état local
      setDishes(prev =>
          prev.map(d => (d.id === updatedDish.id ? updatedDish : d))
      );

      setEditingDish(null); // Ferme le formulaire d'édition
    } catch (error) {
      console.error("Erreur pendant la mise à jour :", error);
    }
  };










  //new
  const [dishes, setDishes] = useState<any[]>([]); // Créer un état pour stocker les plats

  // Utilisation de useEffect pour récupérer les plats à chaque fois que le composant est monté
  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/plats'); // URL de ton API backend
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des plats');
        }
        const data = await response.json();
        setDishes(data); // Mettre les plats récupérés dans l'état
      } catch (error) {
        console.error('Erreur:', error); // Afficher l'erreur si elle survient
      }
    };

    fetchDishes(); // Appel de la fonction pour récupérer les plats
  }, []); // Le tableau vide signifie que cet effet s'exécute uniquement au premier rendu du composant















  const [isEditing, setIsEditing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editingDish, setEditingDish] = useState(null);
  const [isAddingDish, setIsAddingDish] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const isCook = true; // This would be determined by auth state in a real app

  // Pagination states
  const [currentDishPage, setCurrentDishPage] = useState(1);
  const [currentOrderPage, setCurrentOrderPage] = useState(1);
  const itemsPerPage = 3;

  // Calculate pagination for dishes
  const indexOfLastDish = currentDishPage * itemsPerPage;
  const indexOfFirstDish = indexOfLastDish - itemsPerPage;
  const currentDishes = SAMPLE_DISHES.slice(indexOfFirstDish, indexOfLastDish);
  const totalDishPages = Math.ceil(SAMPLE_DISHES.length / itemsPerPage);

  // Calculate pagination for orders
  const indexOfLastOrder = currentOrderPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
  const currentOrders = SAMPLE_ORDERS.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalOrderPages = Math.ceil(SAMPLE_ORDERS.length / itemsPerPage);

  // Handle form submission for dish editing/adding


  const handleDishDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8080/api/plats/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression du plat");
      }

      console.log("Plat supprimé avec succès");
      // Mise à jour de l'état local pour refléter la suppression
      setDishes(prev => prev.filter(dish => dish.id !== id));
    } catch (error) {
      console.error("Erreur pendant la suppression :", error);
    }
  };

  return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">My Profile</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <Card className="animate-fade-in">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=200&h=200" />
                      <AvatarFallback>
                        {isCook ? <ChefHat className="h-10 w-10" /> : "JD"}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <CardTitle>Jane Smith</CardTitle>
                  <CardDescription>
                    {isCook ? "Home Cook" : "Food Enthusiast"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-muted-foreground mb-4">
                    Member since {new Date().toLocaleDateString()}
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Button variant="outline" onClick={() => setIsEditing(prev => !prev)}>
                      <Edit className="h-4 w-4 mr-2" />
                      {isEditing ? "Cancel Editing" : "Edit Profile"}
                    </Button>
                    {isCook && (
                        <Button
                            variant="outline"
                            onClick={() => setIsChatOpen(true)}
                            className="flex items-center"
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Chat with Delivery
                        </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-2">
              <Tabs defaultValue="info" className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
                <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
                  <TabsTrigger value="info">Personal Info</TabsTrigger>
                  <TabsTrigger value="orders">Order History</TabsTrigger>
                  {isCook && (
                      <>
                        <TabsTrigger value="dishes">My Dishes</TabsTrigger>
                        <TabsTrigger value="earnings">Earnings</TabsTrigger>
                      </>
                  )}
                </TabsList>

                <TabsContent value="info">
                  <Card>
                    <CardHeader>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>
                        {isEditing
                            ? "Update your personal details"
                            : "View and manage your account details"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                                id="firstName"
                                defaultValue="Jane"
                                readOnly={!isEditing}
                                className={isEditing ? "" : "bg-muted"}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                                id="lastName"
                                defaultValue="Smith"
                                readOnly={!isEditing}
                                className={isEditing ? "" : "bg-muted"}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                              id="email"
                              type="email"
                              defaultValue="jane.smith@example.com"
                              readOnly={!isEditing}
                              className={isEditing ? "" : "bg-muted"}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                              id="phone"
                              type="tel"
                              defaultValue="+1 (555) 123-4567"
                              readOnly={!isEditing}
                              className={isEditing ? "" : "bg-muted"}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="address">Address</Label>
                          <Input
                              id="address"
                              defaultValue="123 Main St, Anytown, USA"
                              readOnly={!isEditing}
                              className={isEditing ? "" : "bg-muted"}
                          />
                        </div>
                        {isEditing && (
                            <Button type="submit" className="w-full md:w-auto">
                              Save Changes
                            </Button>
                        )}
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="orders">
                  <Card>
                    <CardHeader>
                      <CardTitle>Order History</CardTitle>
                      <CardDescription>
                        View details of your past orders
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {currentOrders.map((order) => (
                            <div
                                key={order.id}
                                className="border rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                            >
                              <div>
                                <p className="font-medium">{`Order #${order.id}`}</p>
                                <p className="text-sm text-muted-foreground">
                                  {order.date.toLocaleDateString()}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">${order.total.toFixed(2)}</p>
                                <p className="text-sm text-muted-foreground">
                                  {order.status}
                                </p>
                              </div>
                              <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedOrder(order)}
                              >
                                View Details
                              </Button>
                            </div>
                        ))}
                      </div>

                      {/* Pagination for Orders */}
                      {totalOrderPages > 1 && (
                          <Pagination className="mt-6">
                            <PaginationContent>
                              <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setCurrentOrderPage(prev => Math.max(1, prev - 1));
                                    }}
                                    aria-disabled={currentOrderPage === 1}
                                    className={currentOrderPage === 1 ? "pointer-events-none opacity-50" : ""}
                                />
                              </PaginationItem>

                              {Array.from({ length: totalOrderPages }).map((_, index) => (
                                  <PaginationItem key={index}>
                                    <PaginationLink
                                        href="#"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          setCurrentOrderPage(index + 1);
                                        }}
                                        isActive={currentOrderPage === index + 1}
                                    >
                                      {index + 1}
                                    </PaginationLink>
                                  </PaginationItem>
                              ))}

                              <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setCurrentOrderPage(prev => Math.min(totalOrderPages, prev + 1));
                                    }}
                                    aria-disabled={currentOrderPage === totalOrderPages}
                                    className={currentOrderPage === totalOrderPages ? "pointer-events-none opacity-50" : ""}
                                />
                              </PaginationItem>
                            </PaginationContent>
                          </Pagination>
                      )}

                      {/* Order Details Dialog */}
                      {selectedOrder && (
                          <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
                            <DialogContent className="sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle className="flex justify-between items-center">
                                  Order #{selectedOrder.id}
                                  <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6"
                                      onClick={() => setSelectedOrder(null)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </DialogTitle>
                                <DialogDescription>
                                  Placed on {selectedOrder.date.toLocaleDateString()}
                                </DialogDescription>
                              </DialogHeader>

                              <div className="space-y-4">
                                <div>
                                  <h4 className="text-sm font-medium mb-1">Customer</h4>
                                  <p>{selectedOrder.customer}</p>
                                </div>

                                <div>
                                  <h4 className="text-sm font-medium mb-1">Status</h4>
                                  <p>{selectedOrder.status}</p>
                                </div>

                                <div>
                                  <h4 className="text-sm font-medium mb-2">Items</h4>
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Item</TableHead>
                                        <TableHead className="text-right">Qty</TableHead>
                                        <TableHead className="text-right">Price</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {selectedOrder.items.map(item => (
                                          <TableRow key={item.id}>
                                            <TableCell>{item.name}</TableCell>
                                            <TableCell className="text-right">{item.quantity}</TableCell>
                                            <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                                          </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </div>

                                <div className="flex justify-between font-medium border-t pt-2">
                                  <span>Total</span>
                                  <span>${selectedOrder.total.toFixed(2)}</span>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {isCook && (
                    <TabsContent value="dishes">
                      <Card>
                        <CardHeader>
                          <div className="flex justify-between items-center">
                            <div>
                              <CardTitle>My Dishes</CardTitle>
                              <CardDescription>
                                Manage the dishes you offer
                              </CardDescription>
                            </div>
                            <Button onClick={() => setIsAddingDish(true)}>
                              <Plus className="h-4 w-4 mr-2" />
                              Add New Dish
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {dishes.length === 0 ? (
                                <p>Aucun plat disponible.</p> // Message si la liste des plats est vide
                            ) : (
                                dishes.map((dish: any) => (
                                    <div
                                        key={dish.id}
                                        className="border rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                                    >
                                      <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-md bg-muted flex-shrink-0 overflow-hidden">
                                          <img
                                              src={dish.image}
                                              alt={dish.name}
                                              className="w-full h-full object-cover"
                                          />
                                        </div>
                                        <div>
                                          <p className="font-medium">{dish.nom}</p>
                                          <p className="text-sm text-muted-foreground">
                                            {dish.prix ? `$${dish.prix.toFixed(2)}` : "Prix non disponible"}
                                          </p>
                                        </div>
                                      </div>
                                  <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          // Transformation : convertir les chaînes en tableaux
                                          const transformedDish = {
                                            ...dish,
                                            ingredients: typeof dish.ingredients === "string"
                                                ? dish.ingredients.split(",").map(i => i.trim())
                                                : dish.ingredients,
                                            allergies: typeof dish.allergies === "string"
                                                ? dish.allergies.split(",").map(a => a.trim())
                                                : dish.allergies,
                                          };

                                          console.log("Plat transformé pour édition:", transformedDish); // Débogage
                                          setEditingDish(transformedDish);
                                        }}
                                    >
                                      <Edit className="h-4 w-4 mr-1" />
                                      Edit
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDishDelete(dish.id)}
                                    >
                                      <Trash2 className="h-4 w-4 mr-1" />
                                      Delete
                                    </Button>
                                  </div>
                                </div>
                                ))
                            )}
                          </div>

                          {/* Pagination for Dishes */}
                          {totalDishPages > 1 && (
                              <Pagination className="mt-6">
                                <PaginationContent>
                                  <PaginationItem>
                                    <PaginationPrevious
                                        href="#"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          setCurrentDishPage(prev => Math.max(1, prev - 1));
                                        }}
                                        aria-disabled={currentDishPage === 1}
                                        className={currentDishPage === 1 ? "pointer-events-none opacity-50" : ""}
                                    />
                                  </PaginationItem>

                                  {Array.from({ length: totalDishPages }).map((_, index) => (
                                      <PaginationItem key={index}>
                                        <PaginationLink
                                            href="#"
                                            onClick={(e) => {
                                              e.preventDefault();
                                              setCurrentDishPage(index + 1);
                                            }}
                                            isActive={currentDishPage === index + 1}
                                        >
                                          {index + 1}
                                        </PaginationLink>
                                      </PaginationItem>
                                  ))}

                                  <PaginationItem>
                                    <PaginationNext
                                        href="#"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          setCurrentDishPage(prev => Math.min(totalDishPages, prev + 1));
                                        }}
                                        aria-disabled={currentDishPage === totalDishPages}
                                        className={currentDishPage === totalDishPages ? "pointer-events-none opacity-50" : ""}
                                    />
                                  </PaginationItem>
                                </PaginationContent>
                              </Pagination>
                          )}
                        </CardContent>
                      </Card>

                      {/* Add Dish Dialog */}
                      <Dialog
                          open={isAddingDish}
                          onOpenChange={(open) => !open && setIsAddingDish(false)}
                      >
                        <DialogContent className="sm:max-w-md md:max-w-lg">
                          <DialogHeader>
                            <DialogTitle>Add New Dish</DialogTitle>
                            <DialogDescription>
                              Fill in the details for your new dish
                            </DialogDescription>
                          </DialogHeader>
                          <DishForm
                              onSubmit={handleDishSubmit}
                              onCancel={() => setIsAddingDish(false)}
                              submitLabel="Add Dish"
                          />
                        </DialogContent>
                      </Dialog>

                      {/* Edit Dish Dialog */}
                      <Dialog
                          open={!!editingDish}
                          onOpenChange={(open) => !open && setEditingDish(null)}
                      >


                        <DialogContent className="sm:max-w-md md:max-w-lg">
                          <DialogHeader>
                            <DialogTitle>Edit Dish</DialogTitle>
                            <DialogDescription>
                              Update the details for this dish
                            </DialogDescription>
                          </DialogHeader>
                          {editingDish && (
                              <DishForm
                                  initialValues={editingDish}
                                  onSubmit={handleDishSubmitt}
                                  onCancel={() => setEditingDish(null)}
                                  submitLabel="Save Changes"
                              />
                          )}
                        </DialogContent>
                      </Dialog>
                    </TabsContent>
                )}

                {isCook && (
                    <TabsContent value="earnings">
                      <Card>
                        <CardHeader>
                          <CardTitle>Earnings</CardTitle>
                          <CardDescription>
                            Track your earnings and payment history
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            <Card>
                              <CardHeader className="pb-2">
                                <CardDescription>Total Earnings</CardDescription>
                                <CardTitle className="text-3xl">$1,240.50</CardTitle>
                              </CardHeader>
                            </Card>
                            <Card>
                              <CardHeader className="pb-2">
                                <CardDescription>This Month</CardDescription>
                                <CardTitle className="text-3xl">$320.75</CardTitle>
                              </CardHeader>
                            </Card>
                            <Card>
                              <CardHeader className="pb-2">
                                <CardDescription>Pending Payments</CardDescription>
                                <CardTitle className="text-3xl">$85.25</CardTitle>
                              </CardHeader>
                            </Card>
                          </div>

                          <h3 className="text-lg font-medium mb-4">Recent Payments</h3>
                          <div className="space-y-4">
                            {[1, 2, 3].map((payment) => (
                                <div
                                    key={payment}
                                    className="border rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                                >
                                  <div>
                                    <p className="font-medium">{`Payment #${2000 + payment}`}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {new Date(
                                          Date.now() - payment * 7 * 24 * 60 * 60 * 1000
                                      ).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-medium">${(50 + payment * 15).toFixed(2)}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {payment === 1
                                          ? "Processing"
                                          : "Completed"}
                                    </p>
                                  </div>
                                </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                )}
              </Tabs>
            </div>
          </div>

          {/* Chat Dialog */}
          <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex justify-between items-center">
                  Chat with Delivery Person
                  <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => setIsChatOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </DialogTitle>
              </DialogHeader>
              <ChatFeature />
            </DialogContent>
          </Dialog>
        </div>
      </Layout>
  );
};

export default Profile;
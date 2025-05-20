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


interface User {
  id: string;
  firstname: string;
  lastname: string;
  phoneNumber : string;
  email: string;
  address?: string;
  roles: string[];
  // ajoute ici les autres champs que tu attends
}

interface Dish {
  id: number;
  nom: string;
  prix: number;
  description?: string;
  image?: string;
  note?: number;
  temps_preparation?: number;
  type_cuisine?: string;
  nombre_personnes?: number;
  ingredients?: string;
  allergies?: string;
  cookName?: string;
}





const role = localStorage.getItem("userRole");

console.log("role au profile : ",role);



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

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const isCook = user?.roles?.includes("COOK");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Utilisateur non authentifié");
          setLoading(false);
          return;
        }

        const response = await fetch("http://localhost:8080/auth/me", {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`, // envoi du token au backend
          },
        });

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des données utilisateur");
          console.log("erreur");
        }
        const data = await response.json();
        console.log(data);

        setUser(data);
      } catch (err: any) {
        setError(err.message || "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);



  const handleDishSubmit = async (formData: any) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post('http://localhost:8080/api/plats/save', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Update local state with the new dish from response
      setDishes(prevDishes => [...prevDishes, response.data]);
      setIsAddingDish(false);
    } catch (error) {
      console.error('Erreur lors de la création du plat:', error);
    }
  };



  const handleDishSubmitt = async (formData: any) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(`http://localhost:8080/api/plats/${formData.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setDishes(prev =>
          prev.map(d => (d.id === formData.id ? response.data : d))
      );
      setEditingDish(null);
    } catch (error) {
      console.error("Erreur pendant la mise à jour :", error);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8080/auth/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour du profil");
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      setIsEditing(false);
      console.log("Profil mis à jour :", updatedUser);
    } catch (error) {
      console.error("Erreur pendant la mise à jour du profil :", error);
    }
  };



const [formData, setFormData] = useState({
  firstname: "",
  lastname: "",
  email: "",
  address: "",
  phoneNumber : "",

});

  useEffect(() => {
    if(user){
      setFormData({
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        email: user.email || "",
        address: user.address || "",
        phoneNumber : user.phoneNumber || "",
      })
    }
  }, [user]);







  //new
  const [dishes, setDishes] = useState<Dish[]>([]); // Créer un état pour stocker les plats

  // Utilisation de useEffect pour récupérer les plats à chaque fois que le composant est monté
  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch('http://localhost:8080/api/plats/my-dishes', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Error fetching user dishes');
        }
        const data = await response.json();
        setDishes(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    // Only fetch dishes if user is a cook
    if (isCook) {
      fetchDishes();
    }
  }, [isCook]); // Add isCook as dependency















  const [isEditing, setIsEditing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editingDish, setEditingDish] = useState(null);
  const [isAddingDish, setIsAddingDish] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Pagination states
  const [currentDishPage, setCurrentDishPage] = useState(1);
  const [currentOrderPage, setCurrentOrderPage] = useState(1);
  const itemsPerPage = 3;

  // Calculate pagination for dishes
  const indexOfLastDish = currentDishPage * itemsPerPage;
  const indexOfFirstDish = indexOfLastDish - itemsPerPage;
  const currentDishes = dishes.slice(indexOfFirstDish, indexOfLastDish);
  const totalDishPages = Math.ceil(dishes.length / itemsPerPage);

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
                  <CardTitle>
                    {user ? `${user.firstname} ${user.lastname}` : "Loading..."}
                  </CardTitle>
                  <CardDescription>
                    {user ? (isCook ? "Home Cook" : "Food Enthusiast") : ""}
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
                      <form className="space-y-4" onSubmit={handleProfileUpdate}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                                id="firstName"
                                defaultValue={user?.firstname || ""}
                                onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                                readOnly={!isEditing}
                                className={isEditing ? "" : "bg-muted"}
                                //value={user.firstname}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                                id="lastName"
                                defaultValue={user?.lastname || ""}
                                onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
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
                              defaultValue={user?.email || ""}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              readOnly={!isEditing}
                              className={isEditing ? "" : "bg-muted"}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                              id="phone"
                              type="tel"
                              defaultValue={user?.phoneNumber || ""}
                              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                              readOnly={!isEditing}
                              className={isEditing ? "" : "bg-muted"}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="address">Address</Label>
                          <Input
                              id="address"
                              defaultValue={user?.address || ""}
                              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
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
                          {loading ? (
                              <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                              </div>
                          ) : dishes.length === 0 ? (
                              <div className="text-center py-8">
                                <p className="text-muted-foreground mb-4">You haven't added any dishes yet</p>
                                <Button onClick={() => setIsAddingDish(true)}>
                                  Add Your First Dish
                                </Button>
                              </div>
                          ) : (
                              <div className="space-y-4">
                                {dishes.map((dish) => (
                                    <div
                                        key={dish.id}
                                        className="border rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                                    >
                                      <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-md bg-muted flex-shrink-0 overflow-hidden">
                                          <img
                                              src={dish.image || '/placeholder.jpg'}
                                              alt={dish.nom}
                                              className="w-full h-full object-cover"
                                          />
                                        </div>
                                        <div>
                                          <p className="font-medium">{dish.nom}</p>
                                          <p className="text-sm text-muted-foreground">
                                            ${dish.prix?.toFixed(2)}
                                          </p>
                                          <p className="text-xs text-muted-foreground">
                                            {dish.type_cuisine}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setEditingDish(dish)}
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
                                ))}
                              </div>
                          )}

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
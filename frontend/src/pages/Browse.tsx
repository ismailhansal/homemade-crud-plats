
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { Search, Filter, Star, ChefHat, Clock } from "lucide-react";

// Sample data with better images
const DISHES = [
  {
    id: 1,
    name: "Homemade Lasagna",
    description: "Traditional Italian lasagna with béchamel sauce",
    price: 15.99,
    image: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?auto=format&fit=crop&w=600&h=350",
    cook: "Maria G.",
    rating: 4.8,
    cuisine: "Italian",
    deliveryTime: "30-45 min",
  },
  {
    id: 2,
    name: "Chicken Biryani",
    description: "Fragrant rice dish with marinated chicken and spices",
    price: 13.99,
    image: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?auto=format&fit=crop&w=600&h=350",
    cook: "Raj K.",
    rating: 4.7,
    cuisine: "Indian",
    deliveryTime: "35-50 min",
  },
  {
    id: 3,
    name: "Vegetable Stir Fry",
    description: "Fresh vegetables stir-fried with homemade sauce",
    price: 11.99,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&h=350",
    cook: "Lee W.",
    rating: 4.6,
    cuisine: "Asian",
    deliveryTime: "20-35 min",
  },
  {
    id: 4,
    name: "Beef Tacos",
    description: "Soft shell tacos with seasoned beef and fresh toppings",
    price: 12.99,
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&h=350",
    cook: "Carlos M.",
    rating: 4.9,
    cuisine: "Mexican",
    deliveryTime: "25-40 min",
  },
  {
    id: 5,
    name: "Greek Salad",
    description: "Fresh Mediterranean salad with feta cheese and olives",
    price: 9.99,
    image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=600&h=350",
    cook: "Eleni P.",
    rating: 4.5,
    cuisine: "Mediterranean",
    deliveryTime: "15-30 min",
  },
  {
    id: 6,
    name: "Pad Thai",
    description: "Classic Thai noodle dish with vegetables and peanuts",
    price: 14.99,
    image: "https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&w=600&h=350",
    cook: "Suki T.",
    rating: 4.7,
    cuisine: "Thai",
    deliveryTime: "30-45 min",
  },
  {
    id: 7,
    name: "Grilled Salmon",
    description: "Fresh salmon with lemon herb butter",
    price: 16.99,
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&h=350",
    cook: "Alex J.",
    rating: 4.8,
    cuisine: "Seafood",
    deliveryTime: "25-40 min",
  },
  {
    id: 8,
    name: "Mushroom Risotto",
    description: "Creamy arborio rice with wild mushrooms",
    price: 14.50,
    image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=600&h=350",
    cook: "Sofia B.",
    rating: 4.5,
    cuisine: "Italian",
    deliveryTime: "35-50 min",
  },
];

const Browse = () => {
  const navigate = useNavigate();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 30]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const filteredDishes = DISHES.filter((dish) => {
    const matchesSearch = dish.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         dish.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dish.cuisine.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPrice = dish.price >= priceRange[0] && dish.price <= priceRange[1];
    
    const matchesCuisine = activeTab === "all" || dish.cuisine.toLowerCase() === activeTab.toLowerCase();
    
    return matchesSearch && matchesPrice && matchesCuisine;
  });

  // Calculate pagination
  const indexOfLastDish = currentPage * itemsPerPage;
  const indexOfFirstDish = indexOfLastDish - itemsPerPage;
  const currentDishes = filteredDishes.slice(indexOfFirstDish, indexOfLastDish);
  const totalPages = Math.ceil(filteredDishes.length / itemsPerPage);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Browse Dishes</h1>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search for dishes, cuisines, or cooks..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
            />
          </div>
          <Button
            variant="outline"
            className="md:w-auto"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>

        {isFilterOpen && (
          <Card className="mb-6 animate-slide-down p-4">
            <div className="pt-2 pb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-3">Price Range</h3>
                  <div className="px-2">
                    <Slider
                      value={priceRange}
                      min={0}
                      max={50}
                      step={1}
                      onValueChange={(value) => {
                        setPriceRange(value);
                        setCurrentPage(1); // Reset to first page on filter change
                      }}
                    />
                    <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-3">Delivery Time</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="justify-start">
                      <Clock className="h-4 w-4 mr-2" />
                      Under 30 min
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start">
                      <Clock className="h-4 w-4 mr-2" />
                      30-45 min
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t pt-4 flex justify-between">
              <Button variant="ghost" onClick={() => {
                setPriceRange([0, 30]);
                setActiveTab("all");
                setCurrentPage(1); // Reset to first page
              }}>
                Reset Filters
              </Button>
              <Button onClick={() => setIsFilterOpen(false)}>
                Apply Filters
              </Button>
            </div>
          </Card>
        )}

        <Tabs value={activeTab} onValueChange={(tab) => {
          setActiveTab(tab);
          setCurrentPage(1); // Reset to first page on tab change
        }} className="mb-8">
          <TabsList className="w-full justify-start overflow-auto">
            <TabsTrigger value="all">All Cuisines</TabsTrigger>
            <TabsTrigger value="Italian">Italian</TabsTrigger>
            <TabsTrigger value="Indian">Indian</TabsTrigger>
            <TabsTrigger value="Asian">Asian</TabsTrigger>
            <TabsTrigger value="Mexican">Mexican</TabsTrigger>
            <TabsTrigger value="Mediterranean">Mediterranean</TabsTrigger>
            <TabsTrigger value="Thai">Thai</TabsTrigger>
            <TabsTrigger value="Seafood">Seafood</TabsTrigger>
          </TabsList>
        </Tabs>

        {filteredDishes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">No dishes found matching your criteria</div>
            <Button variant="outline" onClick={() => {
              setSearchQuery("");
              setPriceRange([0, 30]);
              setActiveTab("all");
              setCurrentPage(1); // Reset to first page
            }}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {currentDishes.map((dish) => (
                <Card 
                  key={dish.id} 
                  className="overflow-hidden card-hover animate-fade-in cursor-pointer"
                  onClick={() => navigate(`/dish/${dish.id}`)}
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3 h-48 md:h-auto relative">
                      <img
                        src={dish.image}
                        alt={dish.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium flex items-center">
                        <Star className="h-3 w-3 fill-primary text-primary mr-1" />
                        {dish.rating}
                      </div>
                    </div>
                    <div className="flex-1 p-4 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-semibold text-lg">{dish.name}</h3>
                          <div className="font-semibold">${dish.price.toFixed(2)}</div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                          {dish.description}
                        </p>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <ChefHat className="h-3 w-3 mr-1" />
                          {dish.cook}
                        </div>
                        <div className="text-xs flex items-center text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          {dish.deliveryTime}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination className="mt-8">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(prev => Math.max(1, prev - 1));
                      }}
                      aria-disabled={currentPage === 1}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }).map((_, index) => (
                    <PaginationItem key={index}>
                      <PaginationLink 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(index + 1);
                        }}
                        isActive={currentPage === index + 1}
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
                        setCurrentPage(prev => Math.min(totalPages, prev + 1));
                      }}
                      aria-disabled={currentPage === totalPages}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Browse;

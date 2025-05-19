
import React, { useState, useEffect } from "react";
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

const Browse = () => {

  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/plats");
        if (!response.ok) throw new Error("Erreur lors du chargement des plats.");
        const data = await response.json();
        setDishes(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDishes();
  }, []);






  const navigate = useNavigate();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 30]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const filteredDishes = dishes.filter((dish) => {
    const name = dish.nom || '';
    const description = dish.description || '';
    const cuisine = dish.nom || '';

    const matchesSearch =
        name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cuisine.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPrice = dish.prix >= priceRange[0] && dish.prix <= priceRange[1];
    const matchesCuisine = activeTab === "all" || cuisine.toLowerCase() === activeTab.toLowerCase();

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
                            src={dish.image || '/placeholder.jpg'}
                            alt={dish.nom}
                            className="w-full h-full object-cover"
                        />
                        {dish.note && (
                            <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium flex items-center">
                              <Star className="h-3 w-3 fill-primary text-primary mr-1" />
                              {dish.note}
                            </div>
                        )}
                      </div>
                      <div className="flex-1 p-4 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="font-semibold text-lg">{dish.nom}</h3>
                            <div className="font-semibold">${dish.prix?.toFixed(2)}</div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                            {dish.description}
                          </p>
                        </div>
                        <div className="flex items-center justify-between pt-2">
                          {dish.cookName && (
                              <div className="flex items-center text-xs text-muted-foreground">
                                <ChefHat className="h-3 w-3 mr-1" />
                                {dish.cookName}
                              </div>
                          )}
                          {dish.temps_preparation && (
                              <div className="text-xs flex items-center text-muted-foreground">
                                <Clock className="h-3 w-3 mr-1" />
                                {dish.temps_preparation} min
                              </div>
                          )}
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


import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Browse from "./pages/Browse";
import DishDetail from "./pages/DishDetail";
import Cart from "./pages/Cart";
import OrderTracking from "./pages/OrderTracking";
import PrivateRoute from "@/components/privateroute/PrivateRoute.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login/:type" element={<Login />} />
            <Route path="/signup/:type" element={<Signup />} />
            <Route path="/profile" element={


              <PrivateRoute>
              <Profile/>
              </PrivateRoute>



              } />
            <Route path="/browse" element={
              <PrivateRoute>
                <Browse />
              </PrivateRoute>
              } />
            <Route path="/dish/:id" element={


              <PrivateRoute>
              <DishDetail />
              </PrivateRoute>




            } />
            <Route path="/cart" element={

              <PrivateRoute>
              <Cart />
              </PrivateRoute>

            } />
            <Route path="/tracking/:id" element={<OrderTracking />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

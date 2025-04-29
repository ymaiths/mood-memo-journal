
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Analytics from "./pages/Analytics";
import QuickMemo from "./pages/QuickMemo";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

// Creating the query client outside of the component ensures it's only created once
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen">
          <Navigation />
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/"
              element={<Navigate to="/quick-memo" replace />}
            />
            <Route
              path="/quick-memo"
              element={
                <ProtectedRoute>
                  <QuickMemo />
                </ProtectedRoute>
              }
            />
            <Route
              path="/calendar"
              element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

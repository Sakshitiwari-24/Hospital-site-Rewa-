import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CompanyDetail from "./pages/CompanyDetail";
import CompanyList from "./pages/CompanyList";
import TestConfigure from "./pages/TestConfigure";
import ExamSimulation from "./pages/ExamSimulation";
import TestResults from "./pages/TestResults";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
              <Route path="/companies" element={<ProtectedRoute><CompanyList /></ProtectedRoute>} />
              <Route path="/company/:companyId" element={<ProtectedRoute><CompanyDetail /></ProtectedRoute>} />
              <Route path="/test/configure" element={<ProtectedRoute><TestConfigure /></ProtectedRoute>} />
              <Route path="/test/exam" element={<ProtectedRoute><ExamSimulation /></ProtectedRoute>} />
              <Route path="/test/results/:id" element={<ProtectedRoute><TestResults /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/practice" element={<ProtectedRoute><TestConfigure /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

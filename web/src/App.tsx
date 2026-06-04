import { Switch, Route, Router } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import AdminPage from "@/pages/admin";
import SessionsPage from "@/pages/sessions";

const queryClient = new QueryClient();

function AppRouter() {
  return (
    <Switch>
      <Route path="/"         component={Home} />
      <Route path="/admin"    component={AdminPage} />
      <Route path="/sessions" component={SessionsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router>
          <AppRouter />
        </Router>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

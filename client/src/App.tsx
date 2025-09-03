import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import BackgroundAudio from "@/components/background-audio";
import Home from "@/pages/home";
import Rules from "@/pages/rules";
import Join from "@/pages/join";
import Donate from "@/pages/donate";
import Support from "@/pages/support";
import KillFeed from "@/pages/killfeed";
import AdminPanel from "@/pages/admin";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/rules" component={Rules} />
      <Route path="/join" component={Join} />
      <Route path="/donate" component={Donate} />
      <Route path="/support" component={Support} />
      <Route path="/killfeed" component={KillFeed} />
      <Route path="/admin" component={AdminPanel} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
        <BackgroundAudio 
          volume={0.08}
          autoPlay={true}
        />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

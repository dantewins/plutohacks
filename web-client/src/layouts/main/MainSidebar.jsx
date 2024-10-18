import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Bell,
  LineChart,
  Home,
  Settings,
  Package2,
  Newspaper,
  UsersRound,
} from "lucide-react";

const tabs = [
  { name: "dashboard", icon: <Home className="h-4 w-4" /> },
  { name: "news", icon: <Newspaper className="h-4 w-4" /> },
  { name: "recruit", icon: <UsersRound className="h-4 w-4" /> },
  { name: "analytics", icon: <LineChart className="h-4 w-4" /> },
  { name: "settings", icon: <Settings className="h-4 w-4" /> },
];

const MainSidebar = () => {
  const [highlighted, setHighlighted] = useState("");
  const location = useLocation();

  useEffect(() => {
    setHighlighted(location.pathname.split("/")[1]);
  }, [location]);

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <Package2 className="h-6 w-6" />
            <span className="">Acme Inc</span>
          </Link>
          <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {tabs.map((tab, i) => (
              <Link
                key={i}
                to={"/" + tab.name}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                  highlighted === tab.name
                    ? "bg-muted text-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                {tab.icon}
                {tab.name.charAt(0).toUpperCase() + tab.name.slice(1)}
                {tab.name === "explore" && (
                  <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                    6
                  </Badge>
                )}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-4">
          <Card x-chunk="dashboard-02-chunk-0">
            <CardHeader className="p-2 pt-0 md:p-4">
              <CardTitle>Upgrade to Pro</CardTitle>
              <CardDescription>
                Unlock all features and get unlimited access to our support
                team.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
              <Button size="sm" className="w-full">
                Upgrade
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MainSidebar;

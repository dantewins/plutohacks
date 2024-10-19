import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useClerk } from "@clerk/clerk-react";
import {
  Eclipse,
  Search,
  Home,
  Newspaper,
  UsersRound,
  Gift,
  Menu,
} from "lucide-react";
import { useState, useEffect } from "react";

const tabs = [
  { name: "dashboard", icon: <Home className="h-4 w-4" /> },
  { name: "news", icon: <Newspaper className="h-4 w-4" /> },
  { name: "volunteer", icon: <UsersRound className="h-4 w-4" /> },
  { name: "donation", icon: <Gift className="h-4 w-4" /> },
];

const MainHeader = () => {
  const { signOut } = useClerk();
  const location = useLocation();
  const [highlighted, setHighlighted] = useState("");

  useEffect(() => {
    setHighlighted(location.pathname.split("/")[1]);
  }, [location]);

  return (
    <>
      <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col">
            <nav className="grid gap-2 text-lg font-medium">
              <Link to="/" className="flex items-center gap-2 font-semibold">
                <Eclipse className="h-6 w-6" />
                <span className="sr-only">SavePluto</span>
              </Link>
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
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        <div className="w-full flex-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
            />
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://raw.githubusercontent.com/shadcn-ui/ui/refs/heads/main/apps/www/public/avatars/01.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Hello, Danny</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuItem>Credits</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut({ redirectUrl: "/" })}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
    </>
  );
};

export default MainHeader;

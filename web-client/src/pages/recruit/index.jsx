import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Share2,
  Search,
  Filter,
  Heart,
  ShieldAlert,
  CloudLightning,
  Ambulance,
  Plus,
  Loader2,
} from "lucide-react";

const volunteerOpportunities = [
  {
    id: 1,
    title: "Flood Relief Assistance",
    type: "Natural Disaster",
    skills: ["Debris Removal", "Water Safety", "First Aid"],
    description:
      "Join our flood relief team to assist communities affected by recent flooding. Volunteers will help with debris removal, water safety measures, and basic first aid to aid in recovery efforts.",
    participantCount: 50,
    duration: "Immediate",
    organizer: {
      name: "Disaster Response Unit",
      role: "Non-Profit Organization",
      avatar: "/placeholder-avatar.jpg",
    },
  },
  {
    id: 2,
    title: "Emergency Shelter Support",
    type: "Crisis Response",
    skills: ["Organizing", "Teamwork"],
    description:
      "Assist with setting up and managing emergency shelters for displaced individuals after a crisis. Volunteers will organize resources, provide compassionate care, and assist with registration and housing coordination.",
    participantCount: 30,
    duration: "Ongoing",
    organizer: {
      name: "Community Safety Network",
      role: "Humanitarian Organization",
      avatar: "/placeholder-avatar-2.jpg",
    },
  },
  {
    id: 3,
    title: "Disease Outbreak Response Team",
    type: "Public Health",
    skills: ["Public Health", "Sanitation"],
    description:
      "Join our public health response team to provide support during a disease outbreak. Volunteers will assist with sanitation efforts, distribute medical supplies, and provide basic health care to affected individuals.",
    participantCount: 20,
    duration: "6 months",
    organizer: {
      name: "HealthWatch Initiative",
      role: "Health Organization",
      avatar: "/placeholder-avatar-3.jpg",
    },
  },
];

const RecruitMain = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, filterType]);

  const filteredOpportunities = volunteerOpportunities.filter(
    (opportunity) =>
      opportunity.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterType === "All" || opportunity.type === filterType),
  );

  const getOpportunityIcon = (type) => {
    switch (type) {
      case "Natural Disaster":
        return <CloudLightning className="h-5 w-5" />;
      case "Crisis Response":
        return <ShieldAlert className="h-5 w-5" />;
      case "Public Health":
        return <Ambulance className="h-5 w-5" />;
      default:
        return <Heart className="h-5 w-5" />;
    }
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6 mt-2"
    >
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <h1 className="text-3xl font-bold">Recruit</h1>
        <Button onClick={() => navigate(`/recruit/create`)}>
          New opportunity
          <Plus className="ml-2 h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search opportunities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <Select onValueChange={setFilterType} defaultValue="All">
          <SelectTrigger className="w-full md:w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Types</SelectItem>
            <SelectItem value="Natural Disaster">Natural Disaster</SelectItem>
            <SelectItem value="Crisis Response">Crisis Response</SelectItem>
            <SelectItem value="Public Health">Public Health</SelectItem>
            <SelectItem value="Community Safety">Community Safety</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center h-[400px]"
          >
            <Loader2 className="h-8 w-8 animate-spin" />
          </motion.div>
        ) : filteredOpportunities.length === 0 ? (
          <motion.div
            key="no-results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center h-[400px] bg-muted rounded-lg"
          >
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">
              No opportunities found
            </h2>
            <p className="text-muted-foreground text-center max-w-md">
              We couldn't find any volunteer opportunities matching your
              criteria. Try adjusting your search or filter settings.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {filteredOpportunities.map((opportunity) => (
              <motion.div
                key={opportunity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card key={opportunity.id} className="flex flex-col h-full">
                  <CardHeader className="pb-0 pb-3">
                    <div className="flex justify-between items-center mb-2">
                      <Badge
                        variant="outline"
                        className="px-2 py-1 text-sm font-medium"
                      >
                        <div className="flex items-center space-x-1">
                          <span>{opportunity.type}</span>
                        </div>
                      </Badge>
                      <div className="flex items-center text-muted-foreground">
                        <Avatar className="h-8 w-8 border border-black">
                          <AvatarImage
                            src="https://raw.githubusercontent.com/shadcn-ui/ui/refs/heads/main/apps/www/public/avatars/01.png"
                            alt="Volunteer 1"
                          />
                          <AvatarFallback>V1</AvatarFallback>
                        </Avatar>
                        <Avatar className="h-8 w-8 -ml-2 border border-black">
                          <AvatarImage
                            src="https://raw.githubusercontent.com/shadcn-ui/ui/refs/heads/main/apps/www/public/avatars/02.png"
                            alt="Volunteer 2"
                          />
                          <AvatarFallback>V2</AvatarFallback>
                        </Avatar>
                        <Avatar className="h-8 w-8 -ml-2 border border-black">
                          <AvatarImage
                            src="https://raw.githubusercontent.com/shadcn-ui/ui/refs/heads/main/apps/www/public/avatars/03.png"
                            alt="Volunteer 3"
                          />
                          <AvatarFallback>V3</AvatarFallback>
                        </Avatar>
                        <Avatar className="h-8 w-8 -ml-2 border border-black">
                          <AvatarFallback className="text-black text-sm">
                            +{opportunity.participantCount - 3}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    </div>
                    <CardTitle className="text-xl">
                      {opportunity.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground mb-4">
                      {opportunity.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {opportunity.skills.map((skill) => (
                        <Badge
                          key={skill}
                          variant="outline"
                          className="text-xs"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center">
                    <Button
                      className="flex-grow mr-2"
                      onClick={() => navigate(`/recruit/1`)}
                    >
                      Learn more
                    </Button>
                    <Button size="icon" variant="outline" className="w-9 h-9">
                      <Share2 className="h-4 w-4" />
                      <span className="sr-only">Share</span>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.main>
  );
};

export default RecruitMain;

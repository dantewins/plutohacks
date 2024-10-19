import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
  Search,
  Filter,
  Code,
  Paintbrush,
  Globe,
  Smartphone,
  Users,
} from "lucide-react";

const projects = [
  {
    id: 1,
    title: "E-commerce Platform",
    type: "Web Development",
    skills: ["React", "Node.js", "MongoDB"],
    description:
      "Build a modern e-commerce platform with a responsive design. The project aims to create a scalable and user-friendly online shopping experience with features such as product catalog, shopping cart, secure checkout, and user accounts.",
    teamSize: 4,
    duration: "3 months",
    creator: {
      name: "Alice Johnson",
      role: "Full Stack Developer",
      avatar: "/placeholder-avatar.jpg",
    },
  },
  {
    id: 2,
    title: "Mobile Game App",
    type: "Mobile Development",
    skills: ["Unity", "C#", "3D Modeling"],
    description:
      "Create an engaging mobile game with stunning 3D graphics. This project involves developing a casual puzzle game with multiple levels, in-app purchases, and social features to connect players.",
    teamSize: 3,
    duration: "4 months",
    creator: {
      name: "Bob Smith",
      role: "Game Developer",
      avatar: "/placeholder-avatar-2.jpg",
    },
  },
  {
    id: 3,
    title: "UX/UI Redesign",
    type: "Design",
    skills: ["Figma", "Adobe XD", "User Research"],
    description:
      "Revamp the user interface of an existing web application. This project focuses on improving user experience through extensive user research, creating intuitive navigation, and designing a visually appealing interface that aligns with modern design trends.",
    teamSize: 2,
    duration: "2 months",
    creator: {
      name: "Carol Davis",
      role: "UX/UI Designer",
      avatar: "/placeholder-avatar-3.jpg",
    },
  },
];

const NewsMain = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterType === "All" || project.type === filterType),
  );

  const getProjectIcon = (type) => {
    switch (type) {
      case "Web Development":
        return <Globe className="h-5 w-5" />;
      case "Mobile Development":
        return <Smartphone className="h-5 w-5" />;
      case "Design":
        return <Paintbrush className="h-5 w-5" />;
      default:
        return <Code className="h-5 w-5" />;
    }
  };

  return (
    <main
      className={`flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6 mt-2 transition-opacity duration-500 ${isVisible ? "opacity-100" : "opacity-0"}`}
    >
      <div className="flex items-center">
        <h1 className="text-3xl font-bold">
          Explore{" "}
          <b>
            <u>Credible</u>
          </b>{" "}
          News
        </h1>
      </div>
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
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
            <SelectItem value="Web Development">Web Development</SelectItem>
            <SelectItem value="Mobile Development">
              Mobile Development
            </SelectItem>
            <SelectItem value="Design">Design</SelectItem>
            <SelectItem value="AI/Machine Learning">
              AI/Machine Learning
            </SelectItem>
            <SelectItem value="Blockchain">Blockchain</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {filteredProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[400px] bg-muted rounded-lg">
          <Search className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">No projects found</h2>
          <p className="text-muted-foreground text-center max-w-md">
            We couldn't find any projects matching your criteria. Try adjusting
            your search or filter settings.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="flex flex-col">
              <CardHeader className="pb-0 pb-3">
                <div className="flex justify-between items-center mb-2">
                  <Badge
                    variant="outline"
                    className="px-2 py-1 text-sm font-medium"
                  >
                    <div className="flex items-center space-x-1">
                      {getProjectIcon(project.type)}
                      <span>{project.type}</span>
                    </div>
                  </Badge>
                  <div className="flex items-center text-muted-foreground">
                    <Avatar className="h-8 w-8 border border-black">
                      <AvatarImage
                        src="https://raw.githubusercontent.com/shadcn-ui/ui/refs/heads/main/apps/www/public/avatars/01.png"
                        alt="Avatar 1"
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <Avatar className="h-8 w-8 -ml-2 border border-black">
                      <AvatarImage
                        src="https://raw.githubusercontent.com/shadcn-ui/ui/refs/heads/main/apps/www/public/avatars/02.png"
                        alt="Avatar 2"
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <Avatar className="h-8 w-8 -ml-2 border border-black">
                      <AvatarImage
                        src="https://raw.githubusercontent.com/shadcn-ui/ui/refs/heads/main/apps/www/public/avatars/03.png"
                        alt="Avatar 3"
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <Avatar className="h-8 w-8 -ml-2 border border-black">
                      <AvatarFallback className="text-black text-sm">
                        +16
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>
                <CardTitle className="text-xl">{project.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground mb-4">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {project.skills.map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={() => navigate("/explore/12345")}
                >
                  Learn more
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
};

export default NewsMain;

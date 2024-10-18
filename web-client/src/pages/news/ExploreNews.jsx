import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Clock,
  Code,
  DollarSign,
  Globe,
  Paintbrush,
  Smartphone,
  Users,
} from "lucide-react";

const project = {
  id: 1,
  title: "E-commerce Platform Revamp",
  type: "Web Development",
  skills: ["React", "Node.js", "MongoDB", "GraphQL", "AWS"],
  description:
    "We're looking to completely overhaul our existing e-commerce platform to improve performance, user experience, and scalability. The project involves redesigning the front-end using React, implementing a GraphQL API with Node.js, and migrating our database to MongoDB. We'll be deploying on AWS for improved reliability and scalability.",
  objectives: [
    "Redesign the user interface for better usability and mobile responsiveness",
    "Implement a GraphQL API for more efficient data fetching",
    "Migrate from a relational database to MongoDB for improved flexibility and scalability",
    "Set up a robust CI/CD pipeline for streamlined deployments",
    "Implement advanced features such as personalized recommendations and real-time inventory updates",
  ],
  teamSize: 5,
  duration: "6 months",
  budget: "$150,000 - $200,000",
  progress: 65,
  creator: {
    name: "Alice Johnson",
    role: "Senior Product Manager",
    avatar: "/placeholder-avatar.jpg",
    company: "TechInnovate Solutions",
  },
  timeline: [
    { milestone: "Project Kickoff", date: "2023-01-15", completed: true },
    {
      milestone: "Design Phase Completion",
      date: "2023-03-01",
      completed: true,
    },
    { milestone: "Backend Development", date: "2023-05-15", completed: true },
    { milestone: "Frontend Integration", date: "2023-07-30", completed: false },
    { milestone: "Testing and QA", date: "2023-09-15", completed: false },
    { milestone: "Launch", date: "2023-12-01", completed: false },
  ],
  technicalRequirements: [
    "Experience with React hooks and context API",
    "Proficiency in Node.js and Express.js",
    "Strong understanding of GraphQL and Apollo Client/Server",
    "Experience with MongoDB and Mongoose ORM",
    "Familiarity with AWS services (EC2, S3, CloudFront)",
    "Knowledge of CI/CD pipelines and Docker containerization",
  ],
  challengesAndRisks: [
    "Data migration from existing SQL database to MongoDB",
    "Ensuring backward compatibility with legacy APIs during transition",
    "Managing potential downtime during the deployment phase",
    "Scaling the new architecture to handle increased traffic and data volume",
  ],
};

const getProjectIcon = (type) => {
  switch (type) {
    case "Web Development":
      return <Globe className="h-6 w-6" />;
    case "Mobile Development":
      return <Smartphone className="h-6 w-6" />;
    case "Design":
      return <Paintbrush className="h-6 w-6" />;
    default:
      return <Code className="h-6 w-6" />;
  }
};

const ExploreNews = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      className={`container mx-auto py-6 px-4 sm:px-6 lg:px-8 transition-opacity duration-500 ${isVisible ? "opacity-100" : "opacity-0"}`}
    >
      <div className="mb-6">
        <Link
          to="/explore"
          className="inline-flex items-center text-sm font-medium text-black hover:underline"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Link>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center mb-2">
                <Badge
                  variant="outline"
                  className="px-3 py-1 text-base font-medium"
                >
                  <div className="flex items-center space-x-2">
                    {getProjectIcon(project.type)}
                    <span>{project.type}</span>
                  </div>
                </Badge>
                <div className="flex items-center text-muted-foreground">
                  <Users className="h-5 w-5 mr-2" />
                  <span className="text-sm font-medium">
                    {project.teamSize}
                  </span>
                </div>
              </div>
              <CardTitle className="text-3xl font-bold">
                {project.title}
              </CardTitle>
              <CardDescription className="mt-2 text-lg">
                {project.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <h3 className="text-xl font-semibold mb-2">Project Objectives</h3>
              <ul className="list-disc pl-5 space-y-1 mb-4">
                {project.objectives.map((objective, index) => (
                  <li key={index}>{objective}</li>
                ))}
              </ul>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span>Duration: {project.duration}</span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span>Budget: {project.budget}</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {project.skills.map((skill) => (
                  <Badge key={skill} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Technical Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-1">
                {project.technicalRequirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Challenges and Risks</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-1">
                {project.challengesAndRisks.map((risk, index) => (
                  <li key={index}>{risk}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2 xl:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={project.progress} className="w-full" />
              <p className="text-center mt-2">{project.progress}% Complete</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Project Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {project.timeline.map((item, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span className={item.completed ? "line-through" : ""}>
                      {item.milestone}
                    </span>
                    <Badge variant={item.completed ? "secondary" : "outline"}>
                      {item.date}
                    </Badge>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Project Creator</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-4">
                <Avatar className="h-16 w-16 mr-4">
                  <AvatarImage
                    src={project.creator.avatar}
                    alt={project.creator.name}
                  />
                  <AvatarFallback>
                    {project.creator.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">
                    {project.creator.name}
                  </h3>
                  <p className="text-muted-foreground">
                    {project.creator.role}
                  </p>
                  <p className="text-sm">{project.creator.company}</p>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="space-y-2">
                <h4 className="font-semibold">Contact Information</h4>
                <p>Email: alice.johnson@techinnovate.com</p>
                <p>Phone: (555) 123-4567</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="mt-6">
        <Button size="lg" className="w-full sm:w-auto">
          Apply to Join This Project
        </Button>
      </div>
    </div>
  );
};

export default ExploreNews;

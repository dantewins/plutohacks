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
  Globe,
  Paintbrush,
  Smartphone,
  Users,
  MapPin,
  Calendar,
} from "lucide-react";

const opportunity = {
  id: 1,
  title: "Flood Relief Assistance",
  type: "Natural Disaster",
  skills: ["Debris Removal", "Water Safety", "First Aid", "Teamwork"],
  description:
    "Join our flood relief team to assist communities affected by recent flooding. Volunteers will help with debris removal, water safety measures, and basic first aid to aid in recovery efforts. Your contribution will make a significant impact on the lives of those affected by this natural disaster.",
  responsibilities: [
    "Assist in clearing debris from affected areas",
    "Help set up and maintain water safety measures",
    "Provide basic first aid to those in need",
    "Support in the distribution of essential supplies",
    "Collaborate with team members and local authorities",
  ],
  volunteerCount: 50,
  duration: "2 weeks",
  location: "Riverside County, CA",
  startDate: "2023-08-15",
  progress: 30,
  organizer: {
    name: "Sarah Thompson",
    role: "Disaster Response Coordinator",
    avatar: "/placeholder-avatar.jpg",
    organization: "Disaster Response Unit",
  },
  timeline: [
    {
      milestone: "Volunteer Orientation",
      date: "2023-08-15",
      completed: false,
    },
    { milestone: "Initial Assessment", date: "2023-08-16", completed: false },
    { milestone: "Debris Removal Phase", date: "2023-08-17", completed: false },
    {
      milestone: "Water Safety Implementation",
      date: "2023-08-20",
      completed: false,
    },
    {
      milestone: "Community Support Activities",
      date: "2023-08-25",
      completed: false,
    },
    { milestone: "Final Evaluation", date: "2023-08-28", completed: false },
  ],
  requirements: [
    "Must be at least 18 years old",
    "Ability to perform physical labor",
    "Basic first aid knowledge (training provided if needed)",
    "Willingness to work in challenging conditions",
    "Commitment to the full two-week period",
  ],
  challengesAndRisks: [
    "Potentially hazardous conditions due to flood damage",
    "Long hours and physically demanding work",
    "Emotional stress from working in disaster-affected areas",
    "Changing weather conditions",
  ],
};

const getOpportunityIcon = (type) => {
  switch (type) {
    case "Natural Disaster":
      return <Globe className="h-6 w-6" />;
    case "Community Service":
      return <Users className="h-6 w-6" />;
    case "Environmental":
      return <Paintbrush className="h-6 w-6" />;
    default:
      return <Code className="h-6 w-6" />;
  }
};

export default function ExploreRecruit() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      className={`container mx-auto py-6 px-4 sm:px-6 lg:px-8 transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="mb-6">
        <Link
          to="/recruit"
          className="inline-flex items-center text-sm font-medium text-black hover:underline"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Opportunities
        </Link>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center mb-2">
                <Badge
                  variant="outline"
                  className="px-3 py-1 text-base font-medium"
                >
                  <div className="flex items-center space-x-2">
                    {getOpportunityIcon(opportunity.type)}
                    <span>{opportunity.type}</span>
                  </div>
                </Badge>
                <div className="flex items-center text-muted-foreground">
                  <Users className="h-5 w-5 mr-2" />
                  <span className="text-sm font-medium">
                    {opportunity.volunteerCount} volunteers needed
                  </span>
                </div>
              </div>
              <CardTitle className="text-3xl font-bold">
                {opportunity.title}
              </CardTitle>
              <CardDescription className="mt-2 text-lg">
                {opportunity.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <h3 className="text-xl font-semibold mb-2">Responsibilities</h3>
              <ul className="list-disc pl-5 space-y-1 mb-4">
                {opportunity.responsibilities.map((responsibility, index) => (
                  <li key={index}>{responsibility}</li>
                ))}
              </ul>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span>Duration: {opportunity.duration}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span>Location: {opportunity.location}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span>Start Date: {opportunity.startDate}</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {opportunity.skills.map((skill) => (
                  <Badge key={skill} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Volunteer Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-1">
                {opportunity.requirements.map((req, index) => (
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
                {opportunity.challengesAndRisks.map((risk, index) => (
                  <li key={index}>{risk}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Opportunity Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={opportunity.progress} className="w-full" />
              <p className="text-center mt-2">
                {opportunity.progress}% of volunteers recruited
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Volunteer Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {opportunity.timeline.map((item, index) => (
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
              <CardTitle>Opportunity Organizer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-4">
                <Avatar className="h-16 w-16 mr-4">
                  <AvatarImage
                    src={opportunity.organizer.avatar}
                    alt={opportunity.organizer.name}
                  />
                  <AvatarFallback>
                    {opportunity.organizer.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">
                    {opportunity.organizer.name}
                  </h3>
                  <p className="text-muted-foreground">
                    {opportunity.organizer.role}
                  </p>
                  <p className="text-sm">
                    {opportunity.organizer.organization}
                  </p>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="space-y-2">
                <h4 className="font-semibold">Contact Information</h4>
                <p>Email: sarah.thompson@disasterresponse.org</p>
                <p>Phone: (555) 987-6543</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="mt-6">
        <Button size="lg" className="w-full sm:w-auto">
          Apply to Volunteer
        </Button>
      </div>
    </div>
  );
}

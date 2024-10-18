import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Plus,
  Code,
  GitPullRequest,
  MessageSquare,
  BarChart,
  Users,
  Clock,
  AlertCircle,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function DashboardMain() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <main
      className={`flex-1 overflow-y-auto transition-opacity duration-500 ${isVisible ? "opacity-100" : "opacity-0"}`}
    >
      <div className="container mx-auto p-6 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight mb-4 sm:mb-0">
            Dashboard
          </h1>
          <Button>
            New Project
            <Plus className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<Users className="h-4 w-4" />}
            title="Team Members"
            value="$45,231.89"
            change="+20.1%"
          />
          <StatCard
            icon={<Code className="h-4 w-4" />}
            title="Active Projects"
            value="$15,399.43"
            change="-2.2%"
          />
          <StatCard
            icon={<GitPullRequest className="h-4 w-4" />}
            title="Open PRs"
            value="$1,383.09"
            change="+10.5%"
          />
          <StatCard
            icon={<AlertCircle className="h-5 w-5" />}
            title="Issues"
            value="$93,437.11"
            change="-44.3%"
          />
        </div>
      </div>
    </main>
  );
}

function StatCard({ icon, title, value, change }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">
          {change} from last month
        </p>
      </CardContent>
    </Card>
  );
}

function ProjectCard({ project }) {
  return (
    <Card className="mb-4 last:mb-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{project.name}</CardTitle>
          <Badge
            variant={project.status === "In Progress" ? "default" : "secondary"}
          >
            {project.status}
          </Badge>
        </div>
        <CardDescription>{project.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={project.avatar} alt={project.lead} />
              <AvatarFallback>
                {project.lead
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{project.lead}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {project.deadline}
            </span>
          </div>
        </div>
        <Progress value={project.progress} className="w-full" />
        <p className="mt-2 text-sm text-right text-muted-foreground">
          {project.progress}% Complete
        </p>
      </CardContent>
    </Card>
  );
}

function ActivityItem({ activity }) {
  const icons = {
    code: <Code className="h-5 w-5" />,
    pr: <GitPullRequest className="h-5 w-5" />,
    comment: <MessageSquare className="h-5 w-5" />,
  };

  return (
    <div className="flex items-start space-x-4 mb-4 last:mb-0">
      {icons[activity.type]}
      <div>
        <p className="text-sm font-medium">{activity.description}</p>
        <p className="text-xs text-muted-foreground">{activity.time}</p>
      </div>
    </div>
  );
}

const activeProjects = [
  {
    name: "Project Alpha",
    status: "In Progress",
    description: "A collaborative IDE for real-time pair programming",
    lead: "Alice Johnson",
    avatar: "/placeholder.svg?height=32&width=32",
    progress: 75,
    deadline: "2 weeks left",
  },
  {
    name: "Beta Framework",
    status: "Planning",
    description: "Next-gen web framework for rapid development",
    lead: "Bob Smith",
    avatar: "/placeholder.svg?height=32&width=32",
    progress: 30,
    deadline: "1 month left",
  },
  {
    name: "DevOps Pipeline",
    status: "Testing",
    description: "Automated CI/CD pipeline for cloud deployments",
    lead: "Charlie Brown",
    avatar: "/placeholder.svg?height=32&width=32",
    progress: 90,
    deadline: "3 days left",
  },
  {
    name: "Data Visualization Tool",
    status: "Design",
    description: "Interactive data visualization library for complex datasets",
    lead: "Diana Prince",
    avatar: "/placeholder.svg?height=32&width=32",
    progress: 45,
    deadline: "3 weeks left",
  },
];

const recentActivity = [
  {
    type: "code",
    description:
      'New commit in Project Alpha: "Implement real-time collaboration feature"',
    time: "2 hours ago",
  },
  {
    type: "pr",
    description:
      'Pull request opened in Beta Framework: "Add responsive design components"',
    time: "4 hours ago",
  },
  {
    type: "comment",
    description:
      'New comment on DevOps Pipeline issue: "Optimize Docker image build process"',
    time: "Yesterday",
  },
  {
    type: "code",
    description:
      'New commit in Data Visualization Tool: "Implement D3.js chart components"',
    time: "2 days ago",
  },
  {
    type: "pr",
    description:
      'Pull request merged in Project Alpha: "Fix cross-browser compatibility issues"',
    time: "3 days ago",
  },
];

const projectProgressData = [
  { name: "Week 1", progress: 20 },
  { name: "Week 2", progress: 40 },
  { name: "Week 3", progress: 55 },
  { name: "Week 4", progress: 70 },
  { name: "Week 5", progress: 85 },
  { name: "Week 6", progress: 95 },
];

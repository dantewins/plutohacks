import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { axiosPrivate as axios } from "@/api/axios";
import { useUser } from "@clerk/clerk-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, HandHeart, AlertCircle, BarChart } from "lucide-react";

export default function DashboardMain() {
  const { user } = useUser();
  const [donationJobs, setDonationJobs] = useState([]);
  const [volunteerJobs, setVolunteerJobs] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    async function fetchActiveJobs() {
      try {
        const response = await axios.get("/jobs/active");
        const jobs = response.data;

        const donation = jobs.filter((job) => job.category === "donation");
        const volunteer = jobs.filter((job) => job.category === "volunteer");

        setDonationJobs(donation);
        setVolunteerJobs(volunteer);
      } catch (error) {
        console.error("Error fetching active jobs:", error);
      }
    }

    fetchActiveJobs();
    setIsVisible(true);
  }, []);

  return (
    <motion.main
      className="flex-1 overflow-y-auto bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto p-8 space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Hi, {user?.fullName} 👋
          </h1>
          <p className="text-xl text-muted-foreground">
            Welcome to your Disaster Relief Dashboard. Here you can manage your
            active volunteer and donation jobs, view key analytics, and stay
            updated on project progress.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<Users className="h-4 w-4" />}
            title="Total Volunteers"
            value={volunteerJobs.length.toString()}
          />
          <StatCard
            icon={<HandHeart className="h-4 w-4" />}
            title="Active Donations"
            value={donationJobs.length.toString()}
          />
          <StatCard
            icon={<AlertCircle className="h-4 w-4" />}
            title="Open Issues"
            value="5"
          />
          <StatCard
            icon={<BarChart className="h-4 w-4" />}
            title="Project Progress"
            value="75%"
          />
        </div>

        <Tabs defaultValue="donation" className="space-y-4">
          <TabsList>
            <TabsTrigger value="donation">Donation Jobs</TabsTrigger>
            <TabsTrigger value="volunteer">Volunteer Jobs</TabsTrigger>
          </TabsList>
          <TabsContent value="donation" className="space-y-4">
            <h2 className="text-2xl font-bold">Active Donation Jobs</h2>
            <ScrollArea className="h-[400px]">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {donationJobs.length > 0 ? (
                  donationJobs.map((job) => <JobCard key={job._id} job={job} />)
                ) : (
                  <p>No active donation jobs at the moment.</p>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="volunteer" className="space-y-4">
            <h2 className="text-2xl font-bold">Active Volunteer Jobs</h2>
            <ScrollArea className="h-[400px]">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {volunteerJobs.length > 0 ? (
                  volunteerJobs.map((job) => (
                    <JobCard key={job._id} job={job} />
                  ))
                ) : (
                  <p>No active volunteer jobs at the moment.</p>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </motion.main>
  );
}

function StatCard({ icon, title, value }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

function JobCard({ job }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">{job.title}</CardTitle>
        <Badge variant={job.category === "donation" ? "default" : "secondary"}>
          {job.category}
        </Badge>
      </CardHeader>
      <CardContent>
        <CardDescription className="mb-4">{job.description}</CardDescription>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={job.leadAvatar} alt={job.leadName} />
              <AvatarFallback>{job.leadInitials}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{job.leadName}</span>
          </div>
          <span className="text-sm text-muted-foreground">{job.deadline}</span>
        </div>
      </CardContent>
    </Card>
  );
}

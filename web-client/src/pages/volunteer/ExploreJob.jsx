import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { axiosPrivate as axios } from "@/api/axios";
import { motion } from "framer-motion"; // Add this import
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Toaster } from "@/components/ui/toaster";
import {
  ArrowLeft,
  Clock,
  Code,
  Globe,
  Paintbrush,
  Users,
  MapPin,
  Calendar,
} from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

// Utility function to get the icon based on job type
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

export default function ExploreJob() {
  const { id } = useParams();
  const { user } = useUser(); // Clerk hook to get authenticated user
  const [opportunity, setOpportunity] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false); // State to control dialog
  const [actionType, setActionType] = useState(""); // State to track action (join/leave)
  const { toast } = useToast(); // Hook to trigger toasts

  // Fetch the job details from the API
  const fetchJobDetails = async (jobId) => {
    try {
      const response = await axios.get(`/jobs/one?_id=${jobId}`);
      setOpportunity(response.data);
    } catch (err) {
      setError("Failed to load job details.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchJobDetails(id); // Fetch job details
    }
  }, [id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Function to handle join or leave actions
  const handleAction = async () => {
    const endpoint = `/jobs/${actionType}`;
    try {
      const response = await axios.post(endpoint, { _id: opportunity._id });
      setOpportunity(response.data.job); // Update opportunity after join/leave
      setDialogOpen(false); // Close dialog

      // Trigger success toast after updating state
      toast({
        title: "Success",
        description: `You have successfully ${actionType === "join" ? "joined" : "left"} the opportunity.`,
        status: "success",
      });
    } catch (err) {
      console.error(`Failed to ${actionType}`, err);
      setDialogOpen(false);

      // Trigger error toast
      toast({
        title: "Error",
        description: `Failed to ${actionType} the opportunity. ${err.response.data.message}`,
        status: "error",
      });
    }
  };

  // Determine if the user is an organizer (owner)
  const isOrganizer = opportunity.organizer.id === user.id;

  // Determine if the user is already part of the opportunity
  const hasJoined = opportunity.joinedUsers.includes(user.id); // Use Clerk's user ID

  // Open dialog with appropriate action (join or leave)
  const openDialog = (action) => {
    setActionType(action);
    setDialogOpen(true); // Open the confirmation dialog
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-6 px-4 sm:px-6 lg:px-8"
    >
      <div className="mb-6">
        <Link
          to="/volunteer"
          className="inline-flex items-center text-sm font-medium text-black hover:underline"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Volunteer
        </Link>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
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
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  <span className="text-sm font-medium">
                    {opportunity.joinedUsers.length || 0} volunteer
                    {opportunity.joinedUsers.length !== 1 ? "s " : " "}
                    joined
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
                  <Clock className="h-5 w-5 mr-2" />
                  <span>Duration: {opportunity.duration}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>Location: {opportunity.location}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  <span>Start Date: {opportunity.startDate}</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {opportunity.skills.map((skill, i) => (
                  <Badge key={i} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Opportunity Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress
                value={
                  opportunity.participantCount
                    ? (opportunity.joinedUsers.length /
                        opportunity.participantCount) *
                      100
                    : 0
                }
                className="w-full"
              />

              <p className="text-center mt-2">
                {/* Display rounded progress percentage */}
                {opportunity.participantCount
                  ? Math.round(
                      (opportunity.joinedUsers.length /
                        opportunity.participantCount) *
                        100,
                    )
                  : 0}
                % of volunteers recruited
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Opportunity Organizer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Avatar className="h-16 w-16 mr-4">
                  <AvatarImage
                    src={
                      opportunity.organizer.avatar || "/placeholder-avatar.jpg"
                    }
                    alt={opportunity.organizer.name}
                  />
                  <AvatarFallback>
                    {opportunity.organizer.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="text-wrap">
                  <h3 className="text-lg font-semibold">
                    {opportunity.organizer.name}
                  </h3>
                  <p className="break-words break-all overflow-wrap-normal w-full">
                    {opportunity.organizer.email}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-6"
      >
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              size="lg"
              className="w-full sm:w-auto"
              onClick={() =>
                isOrganizer
                  ? null // Organizer doesn't need to join or leave, button does nothing for now
                  : openDialog(hasJoined ? "leave" : "join")
              }
            >
              {isOrganizer
                ? "Manage"
                : hasJoined
                  ? "Leave"
                  : "Apply to Volunteer"}
            </Button>
          </DialogTrigger>
          {!isOrganizer && (
            <DialogContent>
              <DialogTitle>Confirm Action</DialogTitle>
              <DialogDescription>
                Are you sure you want to{" "}
                {actionType === "join" ? "join" : "leave"} this opportunity?
              </DialogDescription>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAction}>
                  {actionType === "join" ? "Join" : "Leave"}
                </Button>
              </DialogFooter>
            </DialogContent>
          )}
        </Dialog>
      </motion.div>
      <Toaster />
    </motion.div>
  );
}

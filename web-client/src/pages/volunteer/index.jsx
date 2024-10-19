import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { axiosPrivate as axios } from "@/api/axios";
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
  Plus,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const VolunteerMain = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(6);
  const navigate = useNavigate();

  // Fetch volunteer opportunities from API
  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/jobs?category=volunteer");
      setJobs(response.data);
    } catch (error) {
      console.error("Error fetching volunteer jobs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType]);

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterType === "All" || job.type === filterType),
  );

  // Get current jobs
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6 mt-2"
    >
      <div className="flex items-center justify-between flex-wrap">
        <h1 className="text-2xl sm:text-3xl font-bold order-1">Volunteer</h1>
        <Button
          className="order-2 flex items-center text-sm sm:text-base"
          onClick={() => navigate(`/volunteer/create`)}
        >
          <span>New job</span>
          <Plus className="ml-2 h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search jobs..."
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
        ) : currentJobs.length === 0 ? (
          <motion.div
            key="no-results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center h-[400px] bg-muted rounded-lg"
          >
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No jobs found</h2>
            <p className="text-muted-foreground text-center max-w-md">
              We couldn't find any volunteer jobs matching your criteria. Try
              adjusting your search or filter settings.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key={currentPage} // Use currentPage as the key to trigger animation on page change
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {currentJobs.map((job) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card key={job._id} className="flex flex-col h-full">
                  <CardHeader className="pb-0 pb-3">
                    <div className="flex justify-between items-center mb-2">
                      <Badge
                        variant="outline"
                        className="px-2 py-1 text-sm font-medium"
                      >
                        <div className="flex items-center space-x-1">
                          <span>{job.type}</span>
                        </div>
                      </Badge>
                      <div className="flex items-center text-muted-foreground">
                        {job.joinedUsers.length > 0 && (
                          <>
                            {job.joinedUsers.length >= 1 && (
                              <Avatar className="h-8 w-8 border border-black">
                                <AvatarImage
                                  src="https://raw.githubusercontent.com/shadcn-ui/ui/refs/heads/main/apps/www/public/avatars/01.png"
                                  alt="Volunteer 1"
                                />
                                <AvatarFallback>V1</AvatarFallback>
                              </Avatar>
                            )}
                            {job.joinedUsers.length >= 2 && (
                              <Avatar className="h-8 w-8 -ml-2 border border-black">
                                <AvatarImage
                                  src="https://raw.githubusercontent.com/shadcn-ui/ui/refs/heads/main/apps/www/public/avatars/02.png"
                                  alt="Volunteer 2"
                                />
                                <AvatarFallback>V2</AvatarFallback>
                              </Avatar>
                            )}
                            {job.joinedUsers.length >= 3 && (
                              <Avatar className="h-8 w-8 -ml-2 border border-black">
                                <AvatarImage
                                  src="https://raw.githubusercontent.com/shadcn-ui/ui/refs/heads/main/apps/www/public/avatars/03.png"
                                  alt="Volunteer 3"
                                />
                                <AvatarFallback>V3</AvatarFallback>
                              </Avatar>
                            )}
                            {job.joinedUsers.length > 3 && (
                              <Avatar className="h-8 w-8 -ml-2 border border-black">
                                <AvatarFallback className="text-black text-sm">
                                  +{job.joinedUsers.length - 3}
                                </AvatarFallback>
                              </Avatar>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                    <CardTitle className="text-xl">{job.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground mb-4">
                      {job.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {job.skills.map((skill) => (
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
                      onClick={() => navigate(`/volunteer/${job._id}`)}
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

      {filteredJobs.length > jobsPerPage && (
        <div className="flex justify-center items-center mt-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="mx-4">
            Page {currentPage} of {Math.ceil(filteredJobs.length / jobsPerPage)}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => paginate(currentPage + 1)}
            disabled={
              currentPage === Math.ceil(filteredJobs.length / jobsPerPage)
            }
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </motion.main>
  );
};

export default VolunteerMain;

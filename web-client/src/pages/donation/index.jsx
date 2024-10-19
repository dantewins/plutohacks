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
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import {
  Search,
  Filter,
  Heart,
  Gift,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Dialog, DialogOverlay, DialogContent } from "@/components/ui/dialog"; // Assuming you have a Dialog component in your UI

const DonationMain = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [donationOpportunities, setDonationOpportunities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [donationAmounts, setDonationAmounts] = useState({});
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const [itemsPerPage] = useState(6); // Display 6 items per page by default
  const [openDialog, setOpenDialog] = useState(false); // Dialog state
  const [selectedOpportunityId, setSelectedOpportunityId] = useState(null); // For tracking the current opportunity
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDonationJobs = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("/jobs", {
          params: { category: "donation" },
        });
        setDonationOpportunities(response.data);
      } catch (error) {
        console.error("Error fetching donation jobs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDonationJobs();
  }, [searchTerm, filterType]);

  // Filter opportunities based on search and filter type
  const filteredOpportunities = donationOpportunities.filter(
    (opportunity) =>
      opportunity.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterType === "All" || opportunity.type === filterType),
  );

  // Pagination logic
  const indexOfLastOpportunity = currentPage * itemsPerPage;
  const indexOfFirstOpportunity = indexOfLastOpportunity - itemsPerPage;
  const currentOpportunities = filteredOpportunities.slice(
    indexOfFirstOpportunity,
    indexOfLastOpportunity,
  );

  const totalPages = Math.ceil(filteredOpportunities.length / itemsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handleDonationChange = (value, opportunityId) => {
    setDonationAmounts((prevState) => ({
      ...prevState,
      [opportunityId]: value[0],
    }));
  };

  // Open the payment confirmation dialog
  const handleDonate = (opportunityId) => {
    setSelectedOpportunityId(opportunityId);
    setOpenDialog(true); // Open the dialog
  };

  // Handle payment confirmation
  const handlePaymentConfirm = async (opportunityId) => {
    const donationAmount = donationAmounts[opportunityId] || 10;
    try {
      await axios.post("/job/donate", {
        id: opportunityId,
        amount: donationAmount,
      });
      setOpenDialog(false); // Close the dialog on success
      console.log(`Donated $${donationAmount} to opportunity ${opportunityId}`);
    } catch (error) {
      console.error("Donation failed:", error);
    }
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6 mt-2"
    >
      <div className="flex items-center justify-between flex-wrap">
        <h1 className="text-2xl sm:text-3xl font-bold order-1">Donation</h1>
        <Button
          className="order-2 flex items-center text-sm sm:text-base"
          onClick={() => navigate(`/donation/create`)}
        >
          <span>New request</span>
          <Gift className="ml-2 h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search donation opportunities..."
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
            <SelectItem value="Education">Education</SelectItem>
            <SelectItem value="Healthcare">Healthcare</SelectItem>
            <SelectItem value="Disaster Relief">Disaster Relief</SelectItem>
            <SelectItem value="International Aid">International Aid</SelectItem>
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
        ) : currentOpportunities.length === 0 ? (
          <motion.div
            key="no-results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center h-[400px] bg-muted rounded-lg"
          >
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">
              No donation opportunities found
            </h2>
            <p className="text-muted-foreground text-center max-w-md">
              We couldn't find any donation opportunities matching your
              criteria. Try adjusting your search or filter settings.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key={currentPage} // Add currentPage as the key to trigger animation on page change
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {currentOpportunities.map((opportunity) => (
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
                        <span>{opportunity.donorCount || 0} donors</span>
                      </div>
                    </div>
                    <CardTitle className="text-xl">
                      {opportunity.title}
                    </CardTitle>
                    <p className="text-sm font-semibold text-muted-foreground">
                      Fundraiser: {opportunity.organizer.name}
                    </p>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground mb-4">
                      {opportunity.description}
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>
                          ${opportunity.currentAmount} of ${opportunity.goal}
                        </span>
                      </div>
                      <Progress
                        value={
                          (opportunity.currentAmount / opportunity.goal) * 100
                        }
                        className="h-2"
                      />
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          Donation Amount
                        </span>
                        <span className="text-sm font-medium">
                          ${donationAmounts[opportunity.id] || 10}
                        </span>
                      </div>
                      <Slider
                        defaultValue={[10]}
                        max={1000}
                        step={5}
                        onValueChange={(value) =>
                          handleDonationChange(value, opportunity.id)
                        }
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center">
                    <Button
                      className="flex-grow"
                      onClick={() => handleDonate(opportunity.id)}
                    >
                      <Heart className="mr-2 h-4 w-4" />
                      Donate ${donationAmounts[opportunity.id] || 10}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pagination controls */}
      {donationOpportunities.length > itemsPerPage && (
        <div className="flex justify-center items-center mt-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="mx-4">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Payment Confirmation Dialog */}
      {openDialog && (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogOverlay />
          <DialogContent className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Confirm Payment</h3>
            <p className="text-gray-700 mb-4">
              You are about to donate $
              {donationAmounts[selectedOpportunityId] || 10}.
            </p>
            <div className="flex justify-between items-center mt-4">
              <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
              <Button
                onClick={() => handlePaymentConfirm(selectedOpportunityId)}
              >
                Confirm Payment
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </motion.main>
  );
};

export default DonationMain;

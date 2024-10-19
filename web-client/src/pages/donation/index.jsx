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
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";

import { Search, Filter, Heart, Gift, Loader2, Users } from "lucide-react";

const DonationMain = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [donationOpportunities, setDonationOpportunities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [donationAmounts, setDonationAmounts] = useState({});
  const navigate = useNavigate();

  // Fake data to replace the API call
  const fakeData = [
    {
      id: 1,
      title: "Education for All",
      description: "Help provide education to underprivileged children.",
      type: "Education",
      currentAmount: 500,
      goalAmount: 1000,
      donorCount: 45,
      fundraiser: "John Doe",
    },
    {
      id: 2,
      title: "Healthcare Support",
      description: "Support healthcare workers and facilities in remote areas.",
      type: "Healthcare",
      currentAmount: 750,
      goalAmount: 1000,
      donorCount: 30,
      fundraiser: "Mary Smith",
    },
    {
      id: 3,
      title: "Disaster Relief Fund",
      description: "Contribute to disaster relief efforts across the globe.",
      type: "Disaster Relief",
      currentAmount: 300,
      goalAmount: 500,
      donorCount: 60,
      fundraiser: "Global Aid",
    },
  ];

  useEffect(() => {
    setIsLoading(true);
    // Simulate loading time
    setTimeout(() => {
      setDonationOpportunities(fakeData);
      setIsLoading(false);
    }, 1000);
  }, [searchTerm, filterType]);

  const filteredOpportunities = donationOpportunities.filter(
    (opportunity) =>
      opportunity.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterType === "All" || opportunity.type === filterType),
  );

  const handleDonationChange = (value, opportunityId) => {
    setDonationAmounts((prevState) => ({
      ...prevState,
      [opportunityId]: value[0],
    }));
  };

  const handleDonate = (opportunityId) => {
    const donationAmount = donationAmounts[opportunityId] || 10; // Default to 10 if no amount is selected
    console.log(`Donating $${donationAmount} to opportunity ${opportunityId}`);
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6 mt-2"
    >
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <h1 className="text-3xl font-bold">Donation</h1>
        <Button onClick={() => navigate(`/donations/create`)}>
          Create Fundraiser
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
              No donation opportunities found
            </h2>
            <p className="text-muted-foreground text-center max-w-md">
              We couldn't find any donation opportunities matching your
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
                        <Users className="h-4 w-4 mr-1" />
                        <span>{opportunity.donorCount} donors</span>
                      </div>
                    </div>
                    <CardTitle className="text-xl">
                      {opportunity.title}
                    </CardTitle>
                    <p className="text-sm font-semibold text-muted-foreground">
                      Fundraiser: {opportunity.fundraiser}
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
                          ${opportunity.currentAmount} of $
                          {opportunity.goalAmount}
                        </span>
                      </div>
                      <Progress
                        value={
                          (opportunity.currentAmount / opportunity.goalAmount) *
                          100
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
    </motion.main>
  );
};

export default DonationMain;

import { useState } from "react";
import { axiosPrivate as axios } from "@/api/axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Formik, Form, Field } from "formik";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  type: z.string().min(1, "Type is required"),
  description: z.string().min(1, "Description is required"),
  duration: z.string().min(1, "Duration is required"),
  startDate: z.string().min(1, "Start date is required"),
  goal: z
    .number()
    .positive("Goal must be a positive number")
    .min(1, "Goal is required"),
});

export default function NewRequest() {
  const navigate = useNavigate();
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const initialValues = {
    title: "",
    type: "",
    description: "",
    duration: "",
    startDate: new Date().toISOString().split("T")[0],
    goal: 0, // New goal field initialized to 0
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post("/jobs/donation", values);
      console.log("Form submitted successfully:", response.data);
      setIsSuccessModalOpen(true);
      setSubmitting(false);
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrorMessage(
        error.response?.data?.message ||
          "An error occurred while submitting the form.",
      );
      setIsErrorModalOpen(true);
      setSubmitting(false);
    }
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6 mt-2"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Donation Request</h1>
        <Button variant="outline" onClick={() => navigate("/donation")}>
          Cancel
        </Button>
      </div>
      <Card>
        <Formik
          initialValues={initialValues}
          validationSchema={toFormikValidationSchema(formSchema)}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting, setFieldValue }) => (
            <Form>
              <CardHeader>
                <CardTitle>Fundraiser Request Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Title Field */}
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">
                    Title
                  </label>
                  <Field as={Input} id="title" name="title" />
                  {errors.title && touched.title && (
                    <div className="text-red-500">{errors.title}</div>
                  )}
                </div>
                {/* Type Field */}
                <div className="space-y-2">
                  <label htmlFor="type" className="text-sm font-medium">
                    Type
                  </label>
                  <Field name="type">
                    {({ field }) => (
                      <Select
                        onValueChange={(value) => setFieldValue("type", value)}
                        {...field}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select request type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Education">Education</SelectItem>
                          <SelectItem value="Healthcare">Healthcare</SelectItem>
                          <SelectItem value="Disaster Response">
                            Disaster Relief
                          </SelectItem>
                          <SelectItem value="Community Safety">
                            International aid
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </Field>
                  {errors.type && touched.type && (
                    <div className="text-red-500">{errors.type}</div>
                  )}
                </div>
                {/* Description Field */}
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Description
                  </label>
                  <Field
                    as={Textarea}
                    id="description"
                    name="description"
                    rows={4}
                  />
                  {errors.description && touched.description && (
                    <div className="text-red-500">{errors.description}</div>
                  )}
                </div>
                {/* Duration Field */}
                <div className="space-y-2">
                  <label htmlFor="duration" className="text-sm font-medium">
                    Duration
                  </label>
                  <Field
                    as={Input}
                    id="duration"
                    name="duration"
                    placeholder="e.g. 2 weeks, 3 months, Ongoing"
                  />
                  {errors.duration && touched.duration && (
                    <div className="text-red-500">{errors.duration}</div>
                  )}
                </div>
                {/* Start Date Field */}
                <div className="space-y-2">
                  <label htmlFor="startDate" className="text-sm font-medium">
                    Start Date
                  </label>
                  <Field
                    as={Input}
                    id="startDate"
                    name="startDate"
                    type="date"
                  />
                  {errors.startDate && touched.startDate && (
                    <div className="text-red-500">{errors.startDate}</div>
                  )}
                </div>
                {/* Goal Field */}
                <div className="space-y-2">
                  <label htmlFor="goal" className="text-sm font-medium">
                    Goal (Monetary Amount)
                  </label>
                  <Field
                    as={Input}
                    id="goal"
                    name="goal"
                    type="number"
                    placeholder="Enter goal amount"
                  />
                  {errors.goal && touched.goal && (
                    <div className="text-red-500">{errors.goal}</div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  Create request
                </Button>
              </CardFooter>
            </Form>
          )}
        </Formik>
      </Card>

      {/* Success Modal */}
      <Dialog open={isSuccessModalOpen} onOpenChange={setIsSuccessModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Success</DialogTitle>
            <DialogDescription>
              Your donation request has been successfully created.
            </DialogDescription>
          </DialogHeader>
          <Button
            onClick={() => {
              setIsSuccessModalOpen(false);
              navigate("/donation");
            }}
          >
            OK
          </Button>
        </DialogContent>
      </Dialog>

      {/* Error Modal */}
      <Dialog open={isErrorModalOpen} onOpenChange={setIsErrorModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
            <DialogDescription>{errorMessage}</DialogDescription>
          </DialogHeader>
          <Button onClick={() => setIsErrorModalOpen(false)}>Close</Button>
        </DialogContent>
      </Dialog>
    </motion.main>
  );
}

import React from "react";
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

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  type: z.string().min(1, "Type is required"),
  skills: z.string(),
  description: z.string().min(1, "Description is required"),
  participantCount: z
    .number()
    .positive("Must be a positive number")
    .or(z.string().min(1, "Participant count is required")),
  duration: z.string().min(1, "Duration is required"),
  organizerName: z.string().min(1, "Organizer name is required"),
  organizerRole: z.string().min(1, "Organizer role is required"),
});

export default function NewRecruit() {
  const navigate = useNavigate();

  const initialValues = {
    title: "",
    type: "",
    skills: "",
    description: "",
    participantCount: "",
    duration: "",
    organizerName: "",
    organizerRole: "",
  };

  const handleSubmit = (values, { setSubmitting }) => {
    console.log("Form submitted:", values);
    setSubmitting(false);
    navigate("/");
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6 mt-2"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Recruit</h1>
        <Button variant="outline" onClick={() => navigate("/recruit")}>
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
                <CardTitle>Opportunity Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">
                    Title
                  </label>
                  <Field as={Input} id="title" name="title" />
                  {errors.title && touched.title && (
                    <div className="text-red-500">{errors.title}</div>
                  )}
                </div>
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
                          <SelectValue placeholder="Select opportunity type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Natural Disaster">
                            Natural Disaster
                          </SelectItem>
                          <SelectItem value="Crisis Response">
                            Crisis Response
                          </SelectItem>
                          <SelectItem value="Public Health">
                            Public Health
                          </SelectItem>
                          <SelectItem value="Community Safety">
                            Community Safety
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </Field>
                  {errors.type && touched.type && (
                    <div className="text-red-500">{errors.type}</div>
                  )}
                </div>
                <div className="space-y-2">
                  <label htmlFor="skills" className="text-sm font-medium">
                    Required Skills (comma-separated)
                  </label>
                  <Field
                    as={Input}
                    id="skills"
                    name="skills"
                    placeholder="e.g. First Aid, Debris Removal, Water Safety"
                  />
                  {errors.skills && touched.skills && (
                    <div className="text-red-500">{errors.skills}</div>
                  )}
                </div>
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
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label
                      htmlFor="participantCount"
                      className="text-sm font-medium"
                    >
                      Number of Participants
                    </label>
                    <Field
                      as={Input}
                      id="participantCount"
                      name="participantCount"
                      type="number"
                    />
                    {errors.participantCount && touched.participantCount && (
                      <div className="text-red-500">
                        {errors.participantCount}
                      </div>
                    )}
                  </div>
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
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="organizerName"
                    className="text-sm font-medium"
                  >
                    Organizer Name
                  </label>
                  <Field as={Input} id="organizerName" name="organizerName" />
                  {errors.organizerName && touched.organizerName && (
                    <div className="text-red-500">{errors.organizerName}</div>
                  )}
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="organizerRole"
                    className="text-sm font-medium"
                  >
                    Organizer Role
                  </label>
                  <Field as={Input} id="organizerRole" name="organizerRole" />
                  {errors.organizerRole && touched.organizerRole && (
                    <div className="text-red-500">{errors.organizerRole}</div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  Create opportunity
                </Button>
              </CardFooter>
            </Form>
          )}
        </Formik>
      </Card>
    </motion.main>
  );
}

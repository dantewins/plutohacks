import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "@/layouts/main/MainLayout";
import Dashboard from "@/pages/dashboard";
import NewsMain from "@/pages/news";
import VolunteerMain from "@/pages/volunteer";
import NewJob from "@/pages/volunteer/NewJob";
import ExploreJob from "@/pages/volunteer/ExploreJob";
import DonationMain from "@/pages/donation";
import NewRequest from "@/pages/donation/NewRequest";

const MainRoutes = {
  path: "/",
  element: (
    <ProtectedRoute>
      <MainLayout />
    </ProtectedRoute>
  ),
  children: [
    {
      path: "dashboard",
      element: <Dashboard />,
    },
    {
      path: "news",
      element: <NewsMain />,
    },
    {
      path: "volunteer/create",
      element: <NewJob />,
    },
    {
      path: "volunteer",
      element: <VolunteerMain />,
    },
    {
      path: "volunteer/:id",
      element: <ExploreJob />,
    },
    {
      path: "donation",
      element: <DonationMain />,
    },
    {
      path: "donation/create",
      element: <NewRequest />,
    },
  ],
};

export default MainRoutes;

// import Loadable from 'ui-component/loaders/Loadable';

import MainLayout from "@/layouts/main/MainLayout";
import Dashboard from "@/pages/dashboard";
import NewsMain from "@/pages/news";
import RecruitMain from "@/pages/recruit";
import NewRecruit from "@/pages/recruit/NewRecruit";
import ExploreRecruit from "@/pages/recruit/ExploreRecruit";

const MainRoutes = {
  path: "/",
  element: <MainLayout />,
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
      path: "recruit/create",
      element: <NewRecruit />,
    },
    {
      path: "recruit",
      element: <RecruitMain />,
    },
    {
      path: "recruit/:id",
      element: <ExploreRecruit />,
    },
  ],
};

export default MainRoutes;

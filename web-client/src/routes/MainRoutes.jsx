// import Loadable from 'ui-component/loaders/Loadable';

import MainLayout from "@/layouts/main/MainLayout";
import Dashboard from "@/pages/dashboard";
import NewsMain from "@/pages/news";
import ScenariosMain from "@/pages/scenarios";
import RecruitMain from "@/pages/recruit";
import ExploreNews from "@/pages/news/ExploreNews";
import NewRecruit from "@/pages/recruit/NewRecruit";

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
      path: "explore/:id",
      element: <ExploreNews />,
    },
  ],
};

export default MainRoutes;

import AuthLogin from "@/pages/auth/AuthLogin";
import AuthSignup from "@/pages/auth/AuthSignup";

const DashboardRoutes = {
  path: "/auth",
  children: [
    {
      path: "login",
      element: <AuthLogin />,
    },
    {
      path: "signup",
      element: <AuthSignup />,
    },
  ],
};

export default DashboardRoutes;

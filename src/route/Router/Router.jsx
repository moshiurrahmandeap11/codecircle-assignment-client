import { createBrowserRouter } from "react-router";
import MainLayout from "../../Layouts/MainLayout/MainLayout";
import Home from "../../pages/Home/Home";

import UserDashboard from "../../Dashboards/UserDashboard/UserDashboard";
import Login from "../../components/Login/Login";
import Terms from "../../components/OtherPages/Terms/Terms";
import PrivacyPolicy from "../../components/OtherPages/Terms/PrivacyPolicy/PrivacyPolicy";
import Contact from "../../components/OtherPages/Contact/Contact";
import Registration from "../../components/Registraion/Registration";
import ProtectedRoute from "../RoleProtectedRoute/ProtectedRoute";
import MyProfile from "../../components/Myprofile/Myprofile";
import Dashboard from "../../Dashboards/Dashboard/Dashboard";
import AddPost from "../../components/AddPost/AddPost";
import MyPosts from "../../components/MyPosts/MyPosts";
import PostDetails from "../../components/PostDetails/PostDetails";
import Membership from "../../pages/Membership/Membership";
import Payment from "../../pages/Membership/Payment/Payment";
import CommentsPage from "../../components/CommentsPage/CommentsPage";
import AdminDashboard from "../../Dashboards/AdminDashboard/AdminDashboard";
import AdminProtectedRoute from "../../Dashboards/AdminDashboard/AdminProtectedRoute/AdminProtectedRoute";
import NotificationArchive from "../../components/NotificationArchive/NotificationArchive";
import SearchResult from "../../components/SearchResult/SearchResult";
import ErrorPage from "../../components/Error/ErrorPage";
import Cookies from "../../components/Cookies/Cookies";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      {
        path: "/membership",
        element: (
            <Membership />
        ),
      },
      { path: "/terms", element: <Terms /> },
      { path: "/privacy", element: <PrivacyPolicy /> },
      { path: "/contact", element: <Contact /> },
      {path: "/cookies", element: <Cookies></Cookies>},
      { path: "login", element: <Login /> },
      { path: "registration", element: <Registration /> },
      { path: "payment/:membershipid", element: <Payment /> },
      { path: "/comments/:postId", element: <CommentsPage /> },
      { path: "/search-result", element: <SearchResult /> },
      { path: "/search", element: <SearchResult /> },
      {path: "*", element: <ErrorPage></ErrorPage>}
    ],
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <UserDashboard /> },
      {path: "admin", element: <AdminProtectedRoute><AdminDashboard></AdminDashboard></AdminProtectedRoute>},
      { path: "profile", element: <MyProfile /> },
      { path: "add-post", element: <AddPost /> },
      { path: "my-posts", element: <MyPosts /> },
      { path: "post/:id", element: <PostDetails /> },
      {path: "notifications-archive", element: <NotificationArchive></NotificationArchive>},
      {path: "*", element:<ErrorPage></ErrorPage>}
    ],
  },
  {
    path: "*", element: <ErrorPage></ErrorPage>
  }
]);


export default router;

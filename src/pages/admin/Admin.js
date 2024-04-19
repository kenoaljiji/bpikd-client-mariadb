import { Routes, Route } from "react-router-dom";
import AuthLayout from "../../layout/AuthLayout";
import Dashboard from "../dashboard/Dashboard";
import Posts from "../posts/Posts";
import LoginPage from "../loginPage/LoginPage";

const Admin = () => {
  return (
    <Routes>
      <Route path="/" element={<AuthLayout />}>
        <Route index path="/" element={<LoginPage />} />
        <Route exact path="dashboard" element={<Dashboard />} />
        <Route exact path="posts" element={<Posts />} />{" "}
      </Route>
    </Routes>
  );
};

export default Admin;

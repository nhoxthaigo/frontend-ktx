import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import UserLayout from './layouts/UserLayout';
import AuthLayout from './layouts/AuthLayout';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import Topic from './components/Topic';
import TopicDescription from './components/TopicDescription';
import AdminLayout from "./layouts/AdminLayout";
import AdminHomePage from "./pages/AdminHomePage";


import CheckoutSuccess from "./pages/checkoutpayment/CheckoutSuccess";
import CheckoutCancel from "./pages/checkoutpayment/CheckoutCancel";
import RoomManagement from "./components/Admin/RoomManagement/RoomManagement";
import NewsManagement from "./components/Admin/NewsManagement/NewsManagement";
import StudentManagement from "./components/Admin/StudentManagement/StudentManagement";
import StaffManagement from "./components/Admin/StaffManagement/StaffManagement";
import ElectricManager from "./components/Admin/ElectricManagement/ElectricManagement";
import StudentRequestManagement from "./components/Admin/StudentRequestManagement/StudentRequestManagement";

import Room from './components/Room'; // Import Room component
import RoomDetailPage from "./pages/RoomDetailPage";
import ScrollToTop from "./components/ScrollToTop";
import SetupPassword from "./components/Auth/SetupPassword";
import ProfileUser from "./pages/UserProfile";
import RoomPaymentDetails from "./components/RoomPaymentDetails"; // Import RoomPaymentDetails component
import StudentElectricBills from "./components/StudentElectricBills";
function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Các trang có header/footer */}
          <Route path="/" element={<UserLayout />}>
            <Route index element={<HomePage />} />
            <Route path="room" element={<Room />} />
            <Route path="room/:id" element={<RoomDetailPage />} />
            <Route path="topic" element={<Topic />} />
            <Route path="topic/:id" element={<TopicDescription />} />
            <Route path="electric-bills" element={<StudentElectricBills />} />
          </Route>

          {/* Các trang không header/footer */}
          <Route path="/" element={<AuthLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>
          <Route path="/setup-password" element={<SetupPassword />} />
          <Route path="profile" element={<ProfileUser />} />
          <Route path="/payments/:allocationId" element={<RoomPaymentDetails />} /> {/* Route for RoomPaymentDetails */}

          <Route path="/checkout-success" element={<CheckoutSuccess />} />
          <Route path="/checkout-cancel" element={<CheckoutCancel />} />
          {/* Admin routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminHomePage />} />
            <Route path="news-management" element={<NewsManagement />} />
            <Route path="room-management" element={<RoomManagement />} />
            <Route path="student-management" element={<StudentManagement />} />
            <Route path="staff-management" element={<StaffManagement />} />
            <Route path="electric-manager" element={<ElectricManager />} />
            <Route path="student-request-management" element={<StudentRequestManagement />} />
            {/* Add other admin routes here */}
          </Route>
        </Routes>
      </Router>
      
      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            style: {
              background: '#10b981',
            },
          },
          error: {
            style: {
              background: '#ef4444',
            },
          },
        }}
      />
    </>

  );
}
export default App;

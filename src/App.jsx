import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserLayout from './layouts/UserLayout';
import AuthLayout from './layouts/AuthLayout';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import Topic from './components/Topic';
import TopicDescription from './components/TopicDescription';
import AdminLayout from "./layouts/AdminLayout";
import AdminHomePage from "./pages/AdminHomePage";

import StudentManager from "./components/Admin/StudentManager";
import StudentRequestManager from "./components/Admin/StudentRequestManager";
import ElectricManager from "./components/Admin/ElectricManager";
import PaymentManager from "./components/Admin/PaymentManager";
import BedManager from "./components/Admin/BedManager";
import RoomManager from "./components/Admin/RoomManager";
import RoomAllocationManager from "./components/Admin/RoomAllocation";
import NewsManager from "./components/Admin/NewsManager";
import TopicManager from "./components/Admin/TopicManager";
import StaffManager from "./components/Admin/StaffManager";
import RoomTypeManager from "./components/Admin/RoomTypeManager";
import RoomPaymentManager from "./components/Admin/RoomPaymentManager";
import CheckoutSuccess from "./pages/checkoutpayment/CheckoutSuccess";
import CheckoutCancel from "./pages/checkoutpayment/CheckoutCancel";

import Room from './components/Room'; // Import Room component
import RoomDetailPage from "./pages/RoomDetailPage";
import ScrollToTop from "./components/ScrollToTop";
import SetupPassword from "./components/Auth/SetupPassword";
import ProfileUser from "./pages/UserProfile";
import RoomPaymentDetails from "./components/RoomPaymentDetails"; // Import RoomPaymentDetails component
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
            <Route path="sinh-vien" element={<StudentManager />} />
            <Route path="sinh-vien-yeu-cau" element={<StudentRequestManager />} />
            <Route path="dien" element={<ElectricManager />} />
            <Route path="thanh-toan" element={<PaymentManager />} />
            <Route path="giuong" element={<BedManager />} />
            <Route path="phong" element={<RoomManager />} />
            <Route path="phan-bo-phong" element={<RoomAllocationManager />} />
            <Route path="bang-tin" element={<NewsManager />} />
            <Route path="chu-de" element={<TopicManager />} />
            <Route path="StaffManager" element={<StaffManager />} />
            <Route path="RoomTypeManager" element={<RoomTypeManager />} />
            <Route path="RoomPaymentManager" element={<RoomPaymentManager />} />
          </Route>
        </Routes>
      </Router>
    </>

  );
}
export default App;

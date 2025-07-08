import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import electric from "/img/electric.png";
import student from "/img/student.png";
import payment from "/img/payment.png";
import bed from "/img/bed.png";
import room from "/img/room.png";
import allocation from "/img/roomalocation.png";
import news from "/img/news.png";
import topic from "/img/topic.png";
import staff from "/img/staff.png";
import room1 from "/img/room-1.png";
import roomtype from "/img/room-type.png";
import register from "/img/register-form.png";
import roompayment from "/img/room-payment.png";
import { nav } from "framer-motion/client";
import { authService } from "../services/auth/auth.service"; // thêm

const AdminHomePage = () => {
  const navigate = useNavigate();
  // Nếu là admin thì sẽ có quyền truy cập vào các trang quản lý nhân viên
  // Đọc user 1 lần khi component mount
  const [user] = useState(() => authService.getUserInfo());    // dùng helper


  /* Điều hướng nếu chưa đăng nhập */
  useEffect(() => {
    if (!user) navigate("/login", { replace: true });
  }, [user, navigate]);

  // Chặn render khi chưa có user => tránh truy-cập null
  if (!user) return null; // hoặc spinner/loading

  const isAdmin = user.role === "admin";
  let navItems = [
    {
      label: "Trang Chủ",
      path: "/",
      img: room,
    },
    {
      label: "Quản Lý Phòng",
      path: "/admin/room-management",
      img: roomtype,
    },
    {
      label: "Quản Lý Sinh Viên",
      path: "/admin/student-management",
      img: student,
    },
    {
      label: "Quản Lý Điện",
      path: "/admin/dien",
      img: electric
    },
    {
      label: "Quản Lý Hóa Đơn Phòng",
      path: "/admin/RoomPaymentManager",
      img: roompayment
    },
    {
      label: "Quản Lý Thanh Toán",
      path: "/admin/thanh-toan",
      img: payment
    },
    {
      label: "Quản Lý Bảng Tin",
      path: "/admin/news-management",
      img: news
    },
  ];

  if (isAdmin) {
    navItems.push({ label: "Quản Lý Nhân Viên", path: "/admin/staff-management", img: staff });
  }

  return (
    <div className="w-full min-h-screen p-6 bg-gray-100 ">
      <div className="w-[60%] mx-auto">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl font-bold mb-6 text-center">
            Trang Quản Lý Ký Túc Xá
          </h1>
          <div className="w-[75px] h-1 bg-orange-500"></div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-16 mt-[100px]">
          {navItems.map((item) => (
            <div className="flex flex-col items-center" key={item.label}>
              <div
                key={item.label}
                onClick={() => navigate(item.path)}
                className="w-[150px] h-[150px] shadow-2xl  bg-white rounded-[25px] transition transform duration-300 cursor-pointer flex flex-col items-center justify-center hover:scale-110"
              >
                <img
                  src={item.img}
                  alt={item.label}
                  className="w-16 h-16 mb-4"
                />
              </div>
              <h2 className="text-xl font-semibold text-center mt-4">
                {item.label}
              </h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminHomePage;

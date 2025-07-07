//D:\LuanVanTotNghiep\frontend-ktx\src\components\Header.jsx
import React, { useEffect, useState } from "react";
import logo from "/img/logo2.png";
import { Menu, X, User, CircleUser } from "lucide-react";
import clsx from "clsx";
import ProfileTab from "./ProfileTab"; // Đường dẫn tùy vào cấu trúc dự án
import { authService } from "../services/auth/auth.service";   // ⭐

const Header = () => {
  const [hideLogo, setHideLogo] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState(() => authService.getUserInfo()); // ⭐

  /* Cập nhật user nếu tab khác login/logout */
  useEffect(() => {
    const sync = () => setUser(authService.getUserInfo());
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setHideLogo(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      <div
        className={`w-full flex flex-col fixed z-40 transition-all duration-300 
        ${hideLogo
            ? "bg-white shadow-xl h-[150px] xl:rounded-b-[200px]"
            : "bg-white xl:bg-transparent h-[250px]"
          }`}
      >
        <div
          className={`flex items-center justify-center transition-all duration-300 
          ${hideLogo ? "h-0 overflow-hidden opacity-0" : "h-[150px] opacity-100"}`}
        >
          <img
            src={logo}
            alt="Logo"
            className="w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] md:w-[150px] md:h-[150px]"
          />
        </div>

        <div className="w-[90%] m-auto flex items-center justify-between h-[50px]">
          <div className="flex items-center space-x-4">
            <img
              src={logo}
              alt="Logo"
              className="w-[60px] h-[60px] sm:w-[80px] sm:h-[80px] md:w-[100px] md:h-[100px]"
            />
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold">
              Dormanage
            </p>
          </div>

          <div className="hidden xl:flex w-[45%] items-center justify-between font-bold uppercase text-[14px] md:text-[16px] lg:text-[18px]">
            <a href="/" className="transition duration-300 hover:text-orange-600">
              Trang Chủ
            </a>
            <a href="/room" className="transition duration-300 hover:text-orange-600">
              Phòng
            </a>
            {user && (
              <a href="/electric-bills" className="transition duration-300 hover:text-orange-600">
                Hóa đơn điện
              </a>
            )}
            <a href="/topic" className="transition duration-300 hover:text-orange-600">
              Tin tức
            </a>
            <a href="/" className="transition duration-300 hover:text-orange-600">
              Liên Hệ
            </a>
          </div>

          <div className="hidden xl:flex items-center space-x-6 font-bold uppercase text-[14px] md:text-[16px] lg:text-[18px]">
            {!user ? (
              <>
                <a
                  href="/login"
                  className="transition duration-300 hover:text-orange-600"
                >
                  Đăng Nhập
                </a>
                <a
                  href="/register"
                  className="transition duration-300 hover:text-orange-600"
                >
                  Đăng Ký
                </a>
              </>
            ) : (
              <div className="flex items-center ">
                <button onClick={() => setShowProfile(true)}>
                  <CircleUser className="w-7 h-7 hover:text-orange-600" />
                </button>
                {/* <div className="p">
                  xin chào, {user.ten || user.username}
                </div> */}
              </div>

            )}
          </div>

          <div className="xl:hidden z-50">
            <button onClick={() => setShowMobileMenu(!showMobileMenu)}>
              {showMobileMenu ? (
                <X className="w-8 h-8 text-black" />
              ) : (
                <Menu className="w-8 h-8 text-black" />
              )}
            </button>
          </div>
        </div>
      </div>

      {showMobileMenu && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setShowMobileMenu(false)}
        ></div>
      )}

      <div
        className={clsx(
          "fixed top-0 right-0 w-[60%] max-w-[180px] md:max-w-[300px] h-full flex flex-col items-center justify-between bg-white z-40 shadow-2xl transform transition-transform duration-300 ease-in-out xl:hidden",
          {
            "translate-x-0": showMobileMenu,
            "translate-x-full": !showMobileMenu,
          }
        )}
      >
        <div className="justify-center py-6 px-6 space-y-4 font-bold uppercase text-sm md:text-xl">
          <a href="/" className="hover:text-orange-600">
            Trang Chủ
          </a>
          <a href="/room" className="hover:text-orange-600">
            Phòng
          </a>
          {user && (
            <a href="/electric-bills" className="hover:text-orange-600">
              Hóa đơn điện
            </a>
          )}
          <a href="/topic" className="hover:text-orange-600">
            Tin tức
          </a>
          <a href="/" className="hover:text-orange-600">
            Liên Hệ
          </a>
          <hr />
          {!user ? (
            <>
              <a href="/login" className="hover:text-orange-600">
                Đăng Nhập
              </a>
              <a href="/register" className="hover:text-orange-600">
                Đăng Ký
              </a>
            </>
          ) : (
            <button onClick={() => setShowProfile(true)} className="hover:text-orange-600 text-sm md:text-xl font-bold w-[50px] ">
              <User className="w-6 h-6 inline mr-2" />
              Tài Khoản
            </button>
          )}
        </div>

        <div className="w-full flex flex-col items-center justify-between py-6">
          <div className="h-[1px] w-full bg-black"></div>
          <div className="text-center text-xs md:text-xl text-black p-2">
            <p className="mt-2">Hotline: 0906834103</p>
            <p className="mt-2">Email: dh52100604@student.stu.du.vn</p>
          </div>
        </div>
      </div>

      {/* Profile Tab Component */}
      <ProfileTab isOpen={showProfile} onClose={() => setShowProfile(false)} user={user} />
    </div>
  );
};

export default Header;

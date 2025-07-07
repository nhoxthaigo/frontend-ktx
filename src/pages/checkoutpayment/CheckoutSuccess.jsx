import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function CheckoutSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => navigate("/"), 3000); // Điều hướng về trang chính sau 3s
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-green-50 text-green-800">
      <h1 className="text-3xl font-bold">🎉 Thanh toán thành công!</h1>
      <p className="mt-2">Cảm ơn bạn đã thanh toán. Đang chuyển về trang hóa đơn...</p>
    </div>
  );
}

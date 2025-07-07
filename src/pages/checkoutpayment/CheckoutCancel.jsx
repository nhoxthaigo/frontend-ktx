import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function CheckoutCancel() {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => navigate("/payment-detail"), 3000);
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-red-50 text-red-800">
      <h1 className="text-3xl font-bold">❌ Thanh toán thất bại!</h1>
      <p className="mt-2">Đã hủy thanh toán hoặc có lỗi xảy ra. Đang quay về trang hóa đơn...</p>
    </div>
  );
}

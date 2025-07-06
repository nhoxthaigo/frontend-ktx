import React, { useEffect, useState, useRef } from "react";
import { invoiceService } from "../services/payment/invoices.service";

const currencyFormat = (num) =>
  Number(num || 0).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });

const STATUS_LABEL = {
  pending: "Chờ thanh toán",
  paid: "Đã thanh toán",
  overdue: "Quá hạn",
};

const STATUS_CLASS = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-green-100 text-green-800",
  overdue: "bg-red-100 text-red-800",
};

export default function RoomPaymentDetail() {
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [isPaying, setIsPaying] = useState(false);
  const [countdown, setCountdown] = useState(300);
  const timerRef = useRef(null);
  const pollRef = useRef(null);

  const fetchInvoices = async () => {
    try {
      const res = await invoiceService.getMy();
      console.log("Res FE nhận:", res);
      setInvoices(res || []);
    } catch (err) {
      alert("Lỗi khi tải danh sách hóa đơn.");
    }
  };


  useEffect(() => {
    fetchInvoices();
    return () => {
      clearInterval(timerRef.current);
      clearInterval(pollRef.current);
    };
  }, []);

  const handleViewDetail = async (allocationId) => {
    try {
      const data = await invoiceService.getOne(allocationId);
      setSelectedInvoice(data);
      setShowDetailModal(true);
    } catch {
      alert("Không thể tải chi tiết hóa đơn.");
    }
  };

  const handleOnlinePayment = async () => {
    try {
      setIsPaying(true);
      setShowDetailModal(false);
      const res = await invoiceService.checkout(selectedInvoice.Allocation.id);
      if (res.checkoutUrl && res.qrCode && res.orderCode) {
        setPaymentInfo({
          checkoutUrl: res.checkoutUrl,
          qrCode: res.qrCode,
          orderCode: res.orderCode,
          amount: selectedInvoice.so_tien_thanh_toan,
        });
        setShowQRModal(true);
        startCountdown();
        startPolling();
      } else {
        throw new Error("Thiếu dữ liệu từ server.");
      }
    } catch (err) {
      alert(err?.message || "Không thể khởi tạo thanh toán.");
      setIsPaying(false);
    }
  };

  const startCountdown = () => {
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          clearInterval(pollRef.current);
          alert("Phiên thanh toán hết hạn.");
          setShowQRModal(false);
          setIsPaying(false);
          return 300;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startPolling = () => {
    pollRef.current = setInterval(async () => {
      const data = await invoiceService.getOne(selectedInvoice.Allocation.id);
      if (data.status === "paid") {
        clearInterval(timerRef.current);
        clearInterval(pollRef.current);
        setShowQRModal(false);
        setIsPaying(false);
        setCountdown(300);
        fetchInvoices();
        alert("Thanh toán thành công!");
      }
    }, 5000);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Hóa Đơn Của Tôi</h1>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 text-sm text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">Mã HĐ</th>
              <th className="px-4 py-3 text-left">Phòng</th>
              <th className="px-4 py-3 text-left">Giường</th>
              <th className="px-4 py-3 text-left">Từ Ngày</th>
              <th className="px-4 py-3 text-left">Đến Ngày</th>
              <th className="px-4 py-3 text-left">Giá</th>
              <th className="px-4 py-3 text-left">Trạng Thái</th>
              <th className="px-4 py-3 text-center">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm">
            {invoices.map((inv) => (
              <tr key={inv.id}>
                <td className="px-4 py-2">{inv.id}</td>
                <td className="px-4 py-2">{inv.Allocation?.Bed?.Room?.ten_phong}</td>
                <td className="px-4 py-2">{inv.Allocation?.Bed?.ten_giuong}</td>
                <td className="px-4 py-2">{inv.Allocation?.ngay_bat_dau?.slice(0, 10)}</td>
                <td className="px-4 py-2">{inv.Allocation?.ngay_ket_thuc?.slice(0, 10)}</td>
                <td className="px-4 py-2 text-orange-600 font-medium">
                  {currencyFormat(inv.so_tien_thanh_toan)}
                </td>
                <td className="px-4 py-2">
                  <span
                    className={
                      "px-3 py-1 rounded font-semibold " +
                      (inv.Allocation?.trang_thai_thanh_toan
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700")
                    }
                  >
                    {inv.Allocation?.trang_thai_thanh_toan ? "Đã thanh toán" : "Chưa thanh toán"}
                  </span>
                </td>
                <td className="px-4 py-2 text-center">
                  {inv.status !== "paid" && (
                    <button
                      onClick={() => handleViewDetail(inv.Allocation.id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                    >
                      Thanh toán
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Chi tiết hóa đơn */}
      {showDetailModal && selectedInvoice && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-40 z-40" onClick={() => setShowDetailModal(false)} />
          <div className="w-full fixed inset-0 flex items-center justify-center z-50">
            <div className="w-[75%] h-[700px] bg-white rounded-lg shadow-xl p-6 gap-6 relative">
              <button
                onClick={() => setShowDetailModal(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-red-500  font-bold"
                aria-label="Đóng"
              >
                X
              </button>
              <div className="w-full h-full flex justify-center items-center gap-6">
                <div className="w-[60%] h-full">
                  <img
                    src={selectedInvoice.Allocation?.Bed?.Room?.hinh_anh || "/no-image.jpg"}
                    alt="Phòng"
                    className="w-full h-full object-cover rounded-lg border"
                  />
                </div>

                <div className="w-[40%] space-y-3">
                  <h2 className="text-2xl font-bold text-center">Chi tiết hóa đơn</h2>
                  <div className="space-y-4">
                    <p><strong>Họ tên:</strong> {selectedInvoice.Allocation?.Student?.ten}</p>
                    <p><strong>MSSV:</strong> {selectedInvoice.Allocation?.Student?.mssv}</p>
                    <p><strong>Phòng:</strong> {selectedInvoice.Allocation?.Bed?.Room?.ten_phong}</p>
                    <p><strong>Giường:</strong> {selectedInvoice.Allocation?.Bed?.ten_giuong}</p>
                    <p><strong>Từ ngày:</strong> {selectedInvoice.Allocation?.ngay_bat_dau?.slice(0, 10)}</p>
                    <p><strong>Đến ngày:</strong> {selectedInvoice.Allocation?.ngay_ket_thuc?.slice(0, 10)}</p>
                    <p className="text-lg font-bold text-orange-600">
                      Tổng thanh toán: {currencyFormat(selectedInvoice.so_tien_thanh_toan)}
                    </p>
                  </div>

                  <button
                    onClick={handleOnlinePayment}
                    className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                  >
                    Thanh toán trực tuyến
                  </button>
                </div>
              </div>

            </div>
          </div>
        </>
      )}

      {/* Modal QR Code */}
      {showQRModal && paymentInfo && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-40 z-40" />
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 space-y-4">
              <h2 className="text-lg font-bold text-center">Thanh toán qua PayOS</h2>
              <div className="flex justify-center">
                <img
                  src={`data:image/png;base64,${paymentInfo.qrCode}`}
                  alt="QR code"
                  className="w-48 h-48 border border-gray-300"
                />
              </div>
              <div className="text-sm text-gray-700 space-y-2">
                <p><strong>Mã đơn hàng:</strong> {paymentInfo.orderCode}</p>
                <p><strong>Số tiền:</strong> {currencyFormat(paymentInfo.amount)}</p>
                <p><strong>Thời gian còn lại:</strong> {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, "0")} phút</p>
              </div>
              <button
                onClick={() => {
                  setShowQRModal(false);
                  clearInterval(timerRef.current);
                  clearInterval(pollRef.current);
                  setIsPaying(false);
                  setCountdown(300);
                  setPaymentInfo(null);
                }}
                className="w-full py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Hủy thanh toán
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

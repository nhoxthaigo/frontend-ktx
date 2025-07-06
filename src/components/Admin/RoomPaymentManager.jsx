// RoomPaymentManager.jsx – Quản lý hóa đơn phòng KTX (đồng bộ layout với RoomManager)
// -----------------------------------------------------------------------------
// Yêu cầu:
//   • Hiển thị danh sách hóa đơn + bộ lọc (tên SV, MSSV, phòng, giường, trạng thái)
//   • Giữ styling Tailwind giống RoomManager.jsx
//   • Ưu tiên đơn giản: chỉ nạp & lọc dữ liệu, chưa cần CRUD/checkout UI.
//   • invoiceService phải có các hàm: getAll, create, update, delete, checkout.
// -----------------------------------------------------------------------------

import React, { useEffect, useState } from "react";
import { invoiceService } from "../../services/payment/invoices.service";

// Định dạng tiền tệ VNĐ
const currencyFormat = (num) =>
  Number(num || 0).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });

const STATUS_OPTIONS = [
  { value: "", label: "Tất cả" },
  { value: "pending", label: "Chờ thanh toán" },
  { value: "paid", label: "Đã thanh toán" },
  { value: "overdue", label: "Quá hạn" },
];

const statusColor = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-green-100 text-green-800",
  overdue: "bg-red-100 text-red-800",
};

export default function RoomPaymentManager() {
  // -------------------- State --------------------
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Bộ lọc
  const [searchName, setSearchName] = useState("");
  const [searchMSSV, setSearchMSSV] = useState("");
  const [searchRoom, setSearchRoom] = useState("");
  const [searchBed, setSearchBed] = useState("");
  const [searchStatus, setSearchStatus] = useState("");

  // -------------------- Fetch --------------------
  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await invoiceService.getAll();
        const data = res?.data?.invoices || res?.data || [];
        setInvoices(data);
        setFilteredInvoices(data);
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            "Lỗi tải dữ liệu hóa đơn. Vui lòng thử lại."
        );
      }
      setLoading(false);
    };
    fetchInvoices();
  }, []);

  // -------------------- Filtering --------------------
  useEffect(() => {
    let results = invoices;

    if (searchName.trim()) {
      results = results.filter((inv) =>
        inv.Allocation?.Student?.ten
          ?.toLowerCase()
          .includes(searchName.toLowerCase())
      );
    }

    if (searchMSSV.trim()) {
      results = results.filter((inv) =>
        inv.Allocation?.Student?.mssv
          ?.toLowerCase()
          .includes(searchMSSV.toLowerCase())
      );
    }

    if (searchRoom.trim()) {
      results = results.filter((inv) =>
        inv.Allocation?.Bed?.Room?.ten_phong
          ?.toLowerCase()
          .includes(searchRoom.toLowerCase())
      );
    }

    if (searchBed.trim()) {
      results = results.filter((inv) =>
        inv.Allocation?.Bed?.ten_giuong
          ?.toLowerCase()
          .includes(searchBed.toLowerCase())
      );
    }

    if (searchStatus) {
      results = results.filter((inv) => (inv.status || "pending") === searchStatus);
    }

    setFilteredInvoices(results);
  }, [searchName, searchMSSV, searchRoom, searchBed, searchStatus, invoices]);

  // -------------------- UI --------------------
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6 text-black">
        Quản Lý Hóa Đơn Phòng
      </h1>

      {/* --- Filter Section --- */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Lọc Hóa Đơn</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Tên sinh viên"
            className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
          <input
            type="text"
            placeholder="MSSV"
            className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={searchMSSV}
            onChange={(e) => setSearchMSSV(e.target.value)}
          />
          <input
            type="text"
            placeholder="Tên phòng"
            className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={searchRoom}
            onChange={(e) => setSearchRoom(e.target.value)}
          />
          <input
            type="text"
            placeholder="Tên giường"
            className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={searchBed}
            onChange={(e) => setSearchBed(e.target.value)}
          />
          <select
            className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={searchStatus}
            onChange={(e) => setSearchStatus(e.target.value)}
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* --- Invoice List --- */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Danh Sách Hóa Đơn</h2>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Đang tải dữ liệu...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : filteredInvoices.length === 0 ? (
          <p className="text-center text-gray-500">Không tìm thấy hóa đơn nào.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mã HĐ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên Phòng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên Giường
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    MSSV
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sinh Viên
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Từ Ngày
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Đến Ngày
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thành Tiền
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng Thái
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50 text-sm">
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {inv.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {inv.Allocation?.Bed?.Room?.ten_phong || "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {inv.Allocation?.Bed?.ten_giuong || "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {inv.Allocation?.Student?.mssv || "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {inv.Allocation?.Student?.ten || "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {inv.Allocation?.ngay_bat_dau?.slice(0, 10) || "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {inv.Allocation?.ngay_ket_thuc?.slice(0, 10) || "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {currencyFormat(inv.so_tien_thanh_toan)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          statusColor[inv.status || "pending"] || "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {STATUS_OPTIONS.find((s) => s.value === (inv.status || "pending"))?.label ||
                          "Không xác định"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

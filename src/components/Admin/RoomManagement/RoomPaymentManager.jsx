import React, { useEffect, useState } from "react";
import { invoiceService } from "../../../services/payment/invoices.service";

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
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [searchName, setSearchName] = useState("");
  const [searchMSSV, setSearchMSSV] = useState("");
  const [searchRoom, setSearchRoom] = useState("");
  const [searchBed, setSearchBed] = useState("");
  const [searchStatus, setSearchStatus] = useState("");

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

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Quản lý Hóa đơn Phòng</h3>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 w-full mb-6">
        <input
          type="text"
          placeholder="Lọc theo Tên SV"
          className="p-3 border border-gray-300 rounded-md w-full md:w-[200px] focus:outline-none focus:ring-2 focus:ring-orange-500 mb-2 md:mb-0"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Lọc theo MSSV"
          className="p-3 border border-gray-300 rounded-md w-full md:w-[160px] focus:outline-none focus:ring-2 focus:ring-orange-500 mb-2 md:mb-0"
          value={searchMSSV}
          onChange={(e) => setSearchMSSV(e.target.value)}
        />
        <input
          type="text"
          placeholder="Lọc theo Phòng"
          className="p-3 border border-gray-300 rounded-md w-full md:w-[160px] focus:outline-none focus:ring-2 focus:ring-orange-500 mb-2 md:mb-0"
          value={searchRoom}
          onChange={(e) => setSearchRoom(e.target.value)}
        />
        <input
          type="text"
          placeholder="Lọc theo Giường"
          className="p-3 border border-gray-300 rounded-md w-full md:w-[160px] focus:outline-none focus:ring-2 focus:ring-orange-500 mb-2 md:mb-0"
          value={searchBed}
          onChange={(e) => setSearchBed(e.target.value)}
        />
        <select
          className="p-3 border border-gray-300 rounded-md w-full md:w-[180px] focus:outline-none focus:ring-2 focus:ring-orange-500"
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

      <div className="overflow-x-auto">
        {loading ? (
          <div className="text-center py-4">Đang tải dữ liệu...</div>
        ) : error ? (
          <div className="text-center py-4 text-red-500">{error}</div>
        ) : filteredInvoices.length === 0 ? (
          <div className="text-center py-4 text-gray-500">Không tìm thấy hóa đơn nào.</div>
        ) : (
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-200 shadow-sm">
                <th className="px-4 py-2 text-left">Mã HĐ</th>
                <th className="px-4 py-2 text-left">Tên Phòng</th>
                <th className="px-4 py-2 text-left">Tên Giường</th>
                <th className="px-4 py-2 text-left">MSSV</th>
                <th className="px-4 py-2 text-left">Sinh Viên</th>
                <th className="px-4 py-2 text-left">Từ Ngày</th>
                <th className="px-4 py-2 text-left">Đến Ngày</th>
                <th className="px-4 py-2 text-left">Thành Tiền</th>
                <th className="px-4 py-2 text-center">Trạng Thái</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="border-t text-sm">
                  <td className="px-4 py-2">{inv.id}</td>
                  <td className="px-4 py-2">{inv.Allocation?.Bed?.Room?.ten_phong || "—"}</td>
                  <td className="px-4 py-2">{inv.Allocation?.Bed?.ten_giuong || "—"}</td>
                  <td className="px-4 py-2">{inv.Allocation?.Student?.mssv || "—"}</td>
                  <td className="px-4 py-2">{inv.Allocation?.Student?.ten || "—"}</td>
                  <td className="px-4 py-2">{inv.Allocation?.ngay_bat_dau?.slice(0, 10) || "—"}</td>
                  <td className="px-4 py-2">{inv.Allocation?.ngay_ket_thuc?.slice(0, 10) || "—"}</td>
                  <td className="px-4 py-2">{currencyFormat(inv.so_tien_thanh_toan)}</td>
                  <td className="px-4 py-2 text-center">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        statusColor[inv.status || "pending"] || "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {
                        STATUS_OPTIONS.find(
                          (s) => s.value === (inv.status || "pending")
                        )?.label || "Không xác định"
                      }
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

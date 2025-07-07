import React from 'react';
import { FaPrint, FaDownload } from 'react-icons/fa';

const ElectricBillPrintView = ({ bill, onClose }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('vi-VN');
  };

  const handlePrint = () => {
    window.print();
  };

  if (!bill) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-4 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
        {/* Header Actions */}
        <div className="flex justify-between items-center mb-6 no-print">
          <h2 className="text-xl font-bold">Hóa đơn Tiền Điện</h2>
          <div className="flex space-x-2">
            <button
              onClick={handlePrint}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center space-x-2"
            >
              <FaPrint className="w-4 h-4" />
              <span>In hóa đơn</span>
            </button>
            <button
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
            >
              Đóng
            </button>
          </div>
        </div>

        {/* Printable Content */}
        <div className="printable-content">
          {/* Header */}
          <div className="text-center mb-8 border-b pb-4">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">TRƯỜNG ĐẠI HỌC SƯ PHẠM KỸ THUẬT</h1>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">KÝ TÚC XÁ SINH VIÊN</h2>
            <h3 className="text-lg font-bold text-blue-600">HÓA ĐƠN TIỀN ĐIỆN</h3>
            <p className="text-sm text-gray-600">Số: {bill.id} - Ngày lập: {formatDate(new Date())}</p>
          </div>

          {/* Student Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Thông tin sinh viên:</h4>
              <div className="space-y-2">
                <p><span className="font-medium">Họ tên:</span> {bill.Student?.ten || 'N/A'}</p>
                <p><span className="font-medium">MSSV:</span> {bill.Student?.mssv || 'N/A'}</p>
                <p><span className="font-medium">Phòng:</span> {bill.ElectricityBill?.Room?.ten_phong || 'N/A'}</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Thông tin kỳ hóa đơn:</h4>
              <div className="space-y-2">
                <p><span className="font-medium">Từ ngày:</span> {formatDate(bill.ElectricityBill?.tu_ngay)}</p>
                <p><span className="font-medium">Đến ngày:</span> {formatDate(bill.ElectricityBill?.den_ngay)}</p>
                <p><span className="font-medium">Số điện tiêu thụ:</span> {bill.ElectricityBill?.so_dien_tieu_thu || 0} kWh</p>
              </div>
            </div>
          </div>

          {/* Bill Details */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-800 mb-3">Chi tiết hóa đơn:</h4>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">Mô tả</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">Số lượng</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">Đơn giá</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Tiền điện sinh viên</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">
                    {bill.ElectricityBill?.so_dien_tieu_thu || 0} kWh
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-right">
                    {formatCurrency(bill.ElectricityBill?.ElectricityRate?.don_gia || 0)}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-right font-semibold">
                    {formatCurrency(bill.so_tien_phai_tra)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Payment Summary */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-800 mb-3">Tình trạng thanh toán:</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-600">Tổng phải trả</p>
                  <p className="text-lg font-bold text-blue-600">{formatCurrency(bill.so_tien_phai_tra)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Đã thanh toán</p>
                  <p className="text-lg font-bold text-green-600">{formatCurrency(bill.so_tien_da_tra || 0)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Còn nợ</p>
                  <p className="text-lg font-bold text-red-600">
                    {formatCurrency(parseFloat(bill.so_tien_phai_tra) - parseFloat(bill.so_tien_da_tra || 0))}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment History */}
          {bill.ngay_thanh_toan && (
            <div className="mb-6">
              <h4 className="font-semibold text-gray-800 mb-3">Lịch sử thanh toán:</h4>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Ngày thanh toán</p>
                    <p className="font-medium">{formatDate(bill.ngay_thanh_toan)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phương thức</p>
                    <p className="font-medium">{bill.phuong_thuc_thanh_toan || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Mã giao dịch</p>
                    <p className="font-medium">{bill.ma_giao_dich || 'N/A'}</p>
                  </div>
                </div>
                {bill.ghi_chu && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-600">Ghi chú</p>
                    <p className="font-medium">{bill.ghi_chu}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="text-center mt-8 pt-4 border-t">
            <p className="text-sm text-gray-600 mb-2">
              Mọi thắc mắc xin liên hệ: Ban quản lý ký túc xá - ĐT: 0123.456.789
            </p>
            <p className="text-xs text-gray-500">
              Hóa đơn được tạo tự động bởi hệ thống quản lý ký túc xá
            </p>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          .no-print {
            display: none !important;
          }
          
          .printable-content {
            max-width: none !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          
          body {
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
          }
          
          .fixed {
            position: relative !important;
            top: auto !important;
            left: auto !important;
            right: auto !important;
            bottom: auto !important;
          }
          
          .bg-gray-600 {
            background: transparent !important;
          }
          
          .shadow-lg {
            box-shadow: none !important;
          }
          
          .border {
            border: 1px solid #000 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ElectricBillPrintView;

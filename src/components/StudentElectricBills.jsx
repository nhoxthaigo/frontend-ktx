import React, { useState, useEffect } from 'react';
import { electricityService } from '../services/electricity/electricity.service';
import { FaEye, FaMoneyBill, FaSearch, FaFilter } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const StudentElectricBills = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    trang_thai: '',
    month: '',
    year: new Date().getFullYear()
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [selectedBill, setSelectedBill] = useState(null);
  const [showBillDetail, setShowBillDetail] = useState(false);

  useEffect(() => {
    loadStudentBills();
  }, [pagination.page, filters]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadStudentBills = async () => {
    setLoading(true);
    try {
      const response = await electricityService.getStudentElectricityBills({
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      });
      setBills(response.data || []);
      setPagination(prev => ({
        ...prev,
        total: response.meta?.total || 0,
        totalPages: response.meta?.totalPages || 0
      }));
    } catch (err) {
      console.error('Error loading student bills:', err);
      toast.error('Không thể tải danh sách hóa đơn');
      setBills([]);
    }
    setLoading(false);
  };

  const handleViewDetail = (bill) => {
    setSelectedBill(bill);
    setShowBillDetail(true);
  };

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

  const getStatusBadge = (status) => {
    const statusMap = {
      unpaid: { color: 'bg-red-100 text-red-800', text: 'Chưa thanh toán' },
      partial_paid: { color: 'bg-yellow-100 text-yellow-800', text: 'Thanh toán một phần' },
      paid: { color: 'bg-green-100 text-green-800', text: 'Đã thanh toán' },
      overdue: { color: 'bg-red-200 text-red-900', text: 'Quá hạn' },
    };
    const config = statusMap[status] || { color: 'bg-gray-100 text-gray-800', text: status };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const getTotalStats = () => {
    const total = bills.reduce((sum, bill) => sum + parseFloat(bill.so_tien_phai_tra || 0), 0);
    const paid = bills.reduce((sum, bill) => sum + parseFloat(bill.so_tien_da_tra || 0), 0);
    const unpaid = total - paid;
    
    return { total, paid, unpaid };
  };

  const stats = getTotalStats();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Hóa đơn Tiền Điện</h1>
          <p className="text-gray-600">Quản lý và theo dõi các hóa đơn tiền điện của bạn</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FaMoneyBill className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng phải trả</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.total)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <FaMoneyBill className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Đã thanh toán</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.paid)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg">
                <FaMoneyBill className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Còn nợ</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(stats.unpaid)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center mb-4">
            <FaFilter className="w-5 h-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Bộ lọc</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
              <select
                value={filters.trang_thai}
                onChange={(e) => setFilters(prev => ({ ...prev, trang_thai: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tất cả</option>
                <option value="unpaid">Chưa thanh toán</option>
                <option value="partial_paid">Thanh toán một phần</option>
                <option value="paid">Đã thanh toán</option>
                <option value="overdue">Quá hạn</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tháng</label>
              <select
                value={filters.month}
                onChange={(e) => setFilters(prev => ({ ...prev, month: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tất cả tháng</option>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>Tháng {i + 1}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Năm</label>
              <select
                value={filters.year}
                onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Array.from({ length: 5 }, (_, i) => {
                  const year = new Date().getFullYear() - i;
                  return (
                    <option key={year} value={year}>{year}</option>
                  );
                })}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => setFilters({ trang_thai: '', month: '', year: new Date().getFullYear() })}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
              >
                Xóa bộ lọc
              </button>
            </div>
          </div>
        </div>

        {/* Bills List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Danh sách Hóa đơn</h3>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Đang tải...</span>
            </div>
          ) : bills.length === 0 ? (
            <div className="text-center py-12">
              <FaSearch className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Không có hóa đơn nào</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kỳ hóa đơn
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phòng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Số tiền phải trả
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Đã thanh toán
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Còn lại
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày thanh toán
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bills.map((bill) => {
                    const remaining = parseFloat(bill.so_tien_phai_tra) - parseFloat(bill.so_tien_da_tra || 0);
                    return (
                      <tr key={bill.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatDate(bill.ElectricityBill?.tu_ngay)} - {formatDate(bill.ElectricityBill?.den_ngay)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {bill.ElectricityBill?.Room?.ten_phong}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {formatCurrency(bill.so_tien_phai_tra)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-green-600 font-medium">
                            {formatCurrency(bill.so_tien_da_tra || 0)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm font-medium ${remaining > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {formatCurrency(remaining)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(bill.trang_thai_thanh_toan)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {bill.ngay_thanh_toan ? formatDate(bill.ngay_thanh_toan) : '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleViewDetail(bill)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                            title="Xem chi tiết"
                          >
                            <FaEye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                  disabled={pagination.page === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Trước
                </button>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.totalPages, prev.page + 1) }))}
                  disabled={pagination.page === pagination.totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Sau
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Hiển thị{' '}
                    <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span>{' '}
                    đến{' '}
                    <span className="font-medium">
                      {Math.min(pagination.page * pagination.limit, pagination.total)}
                    </span>{' '}
                    trong tổng số{' '}
                    <span className="font-medium">{pagination.total}</span> kết quả
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                      disabled={pagination.page === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Trước
                    </button>
                    
                    {/* Page numbers */}
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPagination(prev => ({ ...prev, page: pageNum }))}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            pagination.page === pageNum
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.totalPages, prev.page + 1) }))}
                      disabled={pagination.page === pagination.totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Sau
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bill Detail Modal */}
        {showBillDetail && selectedBill && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Chi tiết Hóa đơn Tiền Điện</h3>
                  <button
                    onClick={() => setShowBillDetail(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Sinh viên</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedBill.Student?.ten}</p>
                      <p className="text-xs text-gray-500">{selectedBill.Student?.mssv}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phòng</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedBill.ElectricityBill?.Room?.ten_phong}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Kỳ hóa đơn</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {formatDate(selectedBill.ElectricityBill?.tu_ngay)} - {formatDate(selectedBill.ElectricityBill?.den_ngay)}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                      <div className="mt-1">
                        {getStatusBadge(selectedBill.trang_thai_thanh_toan)}
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="text-md font-medium text-gray-900 mb-3">Chi tiết thanh toán</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Số tiền phải trả</label>
                        <p className="mt-1 text-lg font-semibold text-gray-900">
                          {formatCurrency(selectedBill.so_tien_phai_tra)}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Đã thanh toán</label>
                        <p className="mt-1 text-lg font-semibold text-green-600">
                          {formatCurrency(selectedBill.so_tien_da_tra || 0)}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Còn lại</label>
                        <p className="mt-1 text-lg font-semibold text-red-600">
                          {formatCurrency(parseFloat(selectedBill.so_tien_phai_tra) - parseFloat(selectedBill.so_tien_da_tra || 0))}
                        </p>
                      </div>
                    </div>
                  </div>

                  {selectedBill.phuong_thuc_thanh_toan && (
                    <div className="border-t pt-4">
                      <h4 className="text-md font-medium text-gray-900 mb-3">Thông tin thanh toán</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Phương thức thanh toán</label>
                          <p className="mt-1 text-sm text-gray-900">{selectedBill.phuong_thuc_thanh_toan}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Ngày thanh toán</label>
                          <p className="mt-1 text-sm text-gray-900">
                            {selectedBill.ngay_thanh_toan ? formatDate(selectedBill.ngay_thanh_toan) : '-'}
                          </p>
                        </div>
                        {selectedBill.ma_giao_dich && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Mã giao dịch</label>
                            <p className="mt-1 text-sm text-gray-900">{selectedBill.ma_giao_dich}</p>
                          </div>
                        )}
                      </div>
                      {selectedBill.ghi_chu && (
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700">Ghi chú</label>
                          <p className="mt-1 text-sm text-gray-900">{selectedBill.ghi_chu}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setShowBillDetail(false)}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentElectricBills;

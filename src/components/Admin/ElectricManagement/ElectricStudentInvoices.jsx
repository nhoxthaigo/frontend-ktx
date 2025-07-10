import React, { useState, useEffect } from 'react';
import { electricityService } from '../../../services/electricity/electricity.service';
import { roomService } from '../../../services/room/room.service';
import { FaPlus, FaEdit, FaTrash, FaCalculator, FaCheck, FaDownload, FaEye, FaMoneyBill } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import BulkElectricityActions from '../Electricity/BulkElectricityActions';
import ElectricityStatisticsCards from '../Electricity/ElectricityStatisticsCards';
import { buildParams } from '../../../utils/buildParams.util';
const ElectricStudentInvoices = () => {
  const [loading, setLoading] = useState(false);
  // ===== STATES FOR STUDENT BILLS =====
  const [studentBills, setStudentBills] = useState([]);
  const [paymentForm, setPaymentForm] = useState({
    so_tien_thanh_toan: '',
    phuong_thuc_thanh_toan: 'cash',
    ma_giao_dich: '',
    ghi_chu: ''
  });
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedStudentBill, setSelectedStudentBill] = useState(null);
  // ===== PAGINATION =====
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  // ===== FILTERS =====
  const [filters, setFilters] = useState({
    id_phong: '',
    trang_thai: '',
    trang_thai_thanh_toan: '',
    tu_ngay: '',
    den_ngay: ''
  });

  const loadStudentBills = async () => {
    setLoading(true);
    try {
      // đổi tên khóa trang_thai_thanh_toan -> trang_thai cho API
      const {
        trang_thai_thanh_toan,
        ...restFilters
      } = filters;

      const params = buildParams(
        { page: pagination.page, limit: pagination.limit },
        { ...restFilters, trang_thai: trang_thai_thanh_toan }
      );

      const res = await electricityService.getStudentElectricityBills(params);
      console.log('Student Bills:', res);
      setStudentBills(res || []);
      setPagination(prev => ({
        ...prev,
        total: res.meta?.total || 0,
        totalPages: res.meta?.totalPages || 0,
      }));
    } catch (err) {
      console.error('Error loading student bills:', err);
      toast.error('Không thể tải danh sách hóa đơn sinh viên');
    } finally {
      setLoading(false);
    }
  };

  // ===== STUDENT BILLS HANDLERS =====
  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await electricityService.payElectricityBill(selectedStudentBill.id, paymentForm);
      toast.success('Thanh toán thành công');
      setShowPaymentModal(false);
      setSelectedStudentBill(null);
      setPaymentForm({
        so_tien_thanh_toan: '',
        phuong_thuc_thanh_toan: 'cash',
        ma_giao_dich: '',
        ghi_chu: ''
      });
      loadStudentBills();
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Không thể thanh toán');
    }
    setLoading(false);
  };

  const handleOpenPayment = (bill) => {
    setSelectedStudentBill(bill);
    const remaining = parseFloat(bill.so_tien_phai_tra) - parseFloat(bill.so_tien_da_tra || 0);
    setPaymentForm({
      so_tien_thanh_toan: remaining.toString(),
      phuong_thuc_thanh_toan: 'cash',
      ma_giao_dich: '',
      ghi_chu: ''
    });
    setShowPaymentModal(true);
  };

  // ===== UTILITY FUNCTIONS =====
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
      draft: { color: 'bg-gray-100 text-gray-800', text: 'Nháp' },
      calculated: { color: 'bg-blue-100 text-blue-800', text: 'Đã tính' },
      finalized: { color: 'bg-green-100 text-green-800', text: 'Hoàn thiện' },
      unpaid: { color: 'bg-red-100 text-red-800', text: 'Chưa thanh toán' },
      partial_paid: { color: 'bg-yellow-100 text-yellow-800', text: 'Thanh toán một phần' },
      paid: { color: 'bg-green-100 text-green-800', text: 'Đã thanh toán' },
    };
    const config = statusMap[status] || { color: 'bg-gray-100 text-gray-800', text: status };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  useEffect(() => {
    loadStudentBills();
    // eslint-disable-next-line
  }, [pagination.page, pagination.limit, filters]);

  return (
    <div>
      {/* Filters for Student Bills */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col justify-between md:flex-row md:items-center md:space-x-4 w-full">
          <div className="md:space-x-4 space-y-2 mb-4 md:mb-0">
            <select
              value={filters.trang_thai_thanh_toan}
              onChange={(e) => setFilters(prev => ({ ...prev, trang_thai_thanh_toan: e.target.value }))}
              className="p-3 border border-gray-300 rounded-md w-full md:w-[300px] focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="unpaid">Chưa thanh toán</option>
              <option value="partial_paid">Thanh toán một phần</option>
              <option value="paid">Đã thanh toán</option>
            </select>

            <input
              type="month"
              value={filters.month}
              onChange={(e) => setFilters(prev => ({ ...prev, month: e.target.value }))}
              className="p-3 border border-gray-300 rounded-md w-full md:w-[300px] focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Tháng"
            />

            <button
              onClick={() => setFilters(prev => ({
                ...prev,
                trang_thai_thanh_toan: '',
                month: ''
              }))}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
            >
              Xóa bộ lọc
            </button>
          </div>
        </div>
      </div>


      {loading ? (
        <div className="text-center py-4">Đang tải...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-200 shadow-sm">
                <th className="px-4 py-2 text-left">Sinh viên</th>
                <th className="px-4 py-2 text-left">Phòng</th>
                <th className="px-4 py-2 text-left">Kỳ hóa đơn</th>
                <th className="px-4 py-2 text-left">Số tiền phải trả</th>
                <th className="px-4 py-2 text-left">Đã thanh toán</th>
                <th className="px-4 py-2 text-left">Còn lại</th>
                <th className="px-4 py-2 text-left">Trạng thái</th>
                <th className="px-4 py-2 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {studentBills.map(bill => {
                const remaining = parseFloat(bill.so_tien_phai_tra) - parseFloat(bill.so_tien_da_tra || 0);
                return (
                  <tr key={bill.id} className="border-t">
                    <td className="px-4 py-2">
                      <div>
                        <div className="font-medium">{bill.Student?.ten}</div>
                        <div className="text-sm text-gray-500">{bill.Student?.mssv}</div>
                      </div>
                    </td>
                    <td className="px-4 py-2">{bill.ElectricityBill?.Room?.ten_phong}</td>
                    <td className="px-4 py-2">
                      {formatDate(bill.ElectricityBill?.tu_ngay)} - {formatDate(bill.ElectricityBill?.den_ngay)}
                    </td>
                    <td className="px-4 py-2">{formatCurrency(bill.so_tien_phai_tra)}</td>
                    <td className="px-4 py-2">{formatCurrency(bill.so_tien_da_tra || 0)}</td>
                    <td className="px-4 py-2">{formatCurrency(remaining)}</td>
                    <td className="px-4 py-2">{getStatusBadge(bill.trang_thai_thanh_toan)}</td>
                    <td className="px-4 py-2 text-center">
                      {remaining > 0 && (
                        <button
                          onClick={() => handleOpenPayment(bill)}
                          className="text-green-600 hover:text-green-800"
                          title="Thanh toán"
                        >
                          <FaMoneyBill />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      )}
      {/* Payment Modal */}
      {showPaymentModal && selectedStudentBill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Thanh toán Hóa đơn</h3>
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <p><strong>Sinh viên:</strong> {selectedStudentBill.Student?.ten}</p>
              <p><strong>Phòng:</strong> {selectedStudentBill.ElectricityBill?.Room?.ten_phong}</p>
              <p><strong>Phải trả:</strong> {formatCurrency(selectedStudentBill.so_tien_phai_tra)}</p>
              <p><strong>Đã trả:</strong> {formatCurrency(selectedStudentBill.so_tien_da_tra || 0)}</p>
              <p><strong>Còn lại:</strong> {formatCurrency(
                parseFloat(selectedStudentBill.so_tien_phai_tra) - parseFloat(selectedStudentBill.so_tien_da_tra || 0)
              )}</p>
            </div>

            <form onSubmit={handlePayment}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Số tiền thanh toán</label>
                  <input
                    type="number"
                    value={paymentForm.so_tien_thanh_toan}
                    onChange={(e) => setPaymentForm(prev => ({ ...prev, so_tien_thanh_toan: e.target.value }))}
                    className="p-3 border border-gray-300 rounded-md w-full md:w-[300px] focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Phương thức thanh toán</label>
                  <select
                    value={paymentForm.phuong_thuc_thanh_toan}
                    onChange={(e) => setPaymentForm(prev => ({ ...prev, phuong_thuc_thanh_toan: e.target.value }))}
                    className="p-3 border border-gray-300 rounded-md w-full md:w-[300px] focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  >
                    <option value="cash">Tiền mặt</option>
                    <option value="bank_transfer">Chuyển khoản</option>
                    <option value="digital_wallet">Ví điện tử</option>
                    <option value="credit_card">Thẻ tín dụng</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Mã giao dịch</label>
                  <input
                    type="text"
                    value={paymentForm.ma_giao_dich}
                    onChange={(e) => setPaymentForm(prev => ({ ...prev, ma_giao_dich: e.target.value }))}
                    className="p-3 border border-gray-300 rounded-md w-full md:w-[300px] focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Nhập mã giao dịch (nếu có)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Ghi chú</label>
                  <textarea
                    value={paymentForm.ghi_chu}
                    onChange={(e) => setPaymentForm(prev => ({ ...prev, ghi_chu: e.target.value }))}
                    className="p-3 border border-gray-300 rounded-md w-full md:w-[300px] focus:outline-none focus:ring-2 focus:ring-orange-500"
                    rows="3"
                    placeholder="Ghi chú thêm..."
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowPaymentModal(false);
                    setSelectedStudentBill(null);
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50"
                >
                  {loading ? 'Đang xử lý...' : 'Thanh toán'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ElectricStudentInvoices
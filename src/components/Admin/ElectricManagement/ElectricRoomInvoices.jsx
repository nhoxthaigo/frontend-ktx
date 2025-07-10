import React, { useState, useEffect } from 'react';
import { electricityService } from '../../../services/electricity/electricity.service';
import { roomService } from '../../../services/room/room.service';
import { FaPlus, FaEdit, FaTrash, FaCalculator, FaCheck, FaDownload, FaEye, FaMoneyBill } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import BulkElectricityActions from '../Electricity/BulkElectricityActions';
import ElectricityStatisticsCards from '../Electricity/ElectricityStatisticsCards';
import { buildParams } from '../../../utils/buildParams.util';
const ElectricRoomInvoices = () => {
  const [loading, setLoading] = useState(false);
  // ===== STATES FOR ROOM BILLS =====
  const [roomBills, setRoomBills] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [roomBillForm, setRoomBillForm] = useState({
    id_phong: '',
    tu_ngay: '',
    den_ngay: '',
    so_dien_cu: '',
    so_dien_moi: '',
    ghi_chu: ''
  });
  const [showRoomBillModal, setShowRoomBillModal] = useState(false);
  const [editingRoomBill, setEditingRoomBill] = useState(null);
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
  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      const response = await roomService.getAll();
      setRooms(response.data?.rooms || response.data || []);
    } catch (err) {
      console.error('Error loading rooms:', err);
      toast.error('Không thể tải danh sách phòng');
    }
  };
  // ===== LOAD ROOM BILLS =====
  const loadRoomBills = async () => {
    setLoading(true);
    try {
      const params = buildParams(
        { page: pagination.page, limit: pagination.limit },
        filters                         // id_phong, trang_thai, tu_ngay, den_ngay
      );

      const res = await electricityService.getRoomElectricityBills(params);
      console.log('Room Bills:', res);
      setRoomBills(res || []);
      setPagination(prev => ({
        ...prev,
        total: res.meta?.total || 0,
        totalPages: res.meta?.totalPages || 0,
      }));
    } catch (err) {
      console.error('Error loading room bills:', err);
      toast.error('Không thể tải danh sách hóa đơn phòng');
    } finally {
      setLoading(false);
    }
  };
  // ===== ROOM BILLS HANDLERS =====
  const handleCreateRoomBill = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingRoomBill) {
        await electricityService.updateRoomElectricityBill(editingRoomBill.id, roomBillForm);
        toast.success('Cập nhật hóa đơn thành công');
      } else {
        await electricityService.createRoomElectricityBill(roomBillForm);
        toast.success('Tạo hóa đơn thành công');
      }
      setShowRoomBillModal(false);
      setEditingRoomBill(null);
      setRoomBillForm({
        id_phong: '',
        tu_ngay: '',
        den_ngay: '',
        so_dien_cu: '',
        so_dien_moi: '',
        ghi_chu: ''
      });
      loadRoomBills();
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Không thể lưu hóa đơn');
    }
    setLoading(false);
  };

  const handleCalculateStudentBills = async (billId) => {
    setLoading(true);
    try {
      await electricityService.calculateStudentBills(billId);
      toast.success('Tính tiền điện cho sinh viên thành công');
      loadRoomBills();
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Không thể tính tiền điện');
    }
    setLoading(false);
  };

  const handleFinalizeRoomBill = async (billId) => {
    if (!window.confirm('Hoàn thiện hóa đơn? Sau khi hoàn thiện sẽ không thể chỉnh sửa.')) return;

    setLoading(true);
    try {
      await electricityService.finalizeElectricityBill(billId);
      toast.success('Hoàn thiện hóa đơn thành công');
      loadRoomBills();
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Không thể hoàn thiện hóa đơn');
    }
    setLoading(false);
  };

  const handleDeleteRoomBill = async (billId) => {
    if (!window.confirm('Xác nhận xóa hóa đơn?')) return;

    setLoading(true);
    try {
      await electricityService.deleteRoomElectricityBill(billId);
      toast.success('Xóa hóa đơn thành công');
      loadRoomBills();
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Không thể xóa hóa đơn');
    }
    setLoading(false);
  };

  const handleEditRoomBill = (bill) => {
    setEditingRoomBill(bill);
    setRoomBillForm({
      id_phong: bill.id_phong,
      tu_ngay: bill.tu_ngay?.split('T')[0] || '',
      den_ngay: bill.den_ngay?.split('T')[0] || '',
      so_dien_cu: bill.so_dien_cu,
      so_dien_moi: bill.so_dien_moi,
      ghi_chu: bill.ghi_chu || ''
    });
    setShowRoomBillModal(true);
  };
  // ===== EXPORT HANDLERS =====
  const handleExportExcel = async () => {
    try {
      const blob = await electricityService.exportExcel({
        tu_ngay: filters.tu_ngay,
        den_ngay: filters.den_ngay
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `electricity-report-${new Date().toISOString().split('T')[0]}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('Xuất Excel thành công');
    } catch (error) {
      toast.error('Không thể xuất Excel');
    }
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
    loadRoomBills();
    // eslint-disable-next-line
  }, [pagination.page, pagination.limit, filters]);
  return (
    <div>

      {/* Bulk Actions */}
      <BulkElectricityActions onRefresh={loadRoomBills} />
      {/* Filters */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col justify-between md:flex-row md:items-center md:space-x-4 w-full">
          <div className="md:space-x-4 space-y-2 mb-4 md:mb-0">
            <select
              value={filters.id_phong}
              onChange={(e) => setFilters(prev => ({ ...prev, id_phong: e.target.value }))}
              className="p-3 border border-gray-300 rounded-md w-full md:w-[300px] focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Tất cả phòng</option>
              {rooms.map(room => (
                <option key={room.id} value={room.id}>{room.ten_phong}</option>
              ))}
            </select>

            <select
              value={filters.trang_thai}
              onChange={(e) => setFilters(prev => ({ ...prev, trang_thai: e.target.value }))}
              className="p-3 border border-gray-300 rounded-md w-full md:w-[300px] focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="draft">Nháp</option>
              <option value="calculated">Đã tính</option>
              <option value="finalized">Hoàn thiện</option>
            </select>

            <input
              type="date"
              value={filters.tu_ngay}
              onChange={(e) => setFilters(prev => ({ ...prev, tu_ngay: e.target.value }))}
              className="p-3 border border-gray-300 rounded-md w-full md:w-[300px] focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Từ ngày"
            />

            <input
              type="date"
              value={filters.den_ngay}
              onChange={(e) => setFilters(prev => ({ ...prev, den_ngay: e.target.value }))}
              className="p-3 border border-gray-300 rounded-md w-full md:w-[300px] focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Đến ngày"
            />

            <button
              onClick={() => setFilters({
                id_phong: '',
                trang_thai: '',
                tu_ngay: '',
                den_ngay: ''
              })}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
            >
              Xóa bộ lọc
            </button>

          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleExportExcel}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center space-x-2"
            >
              <FaDownload className="w-4 h-4" />
              <span>Xuất Excel</span>
            </button>
            <button
              onClick={() => setShowRoomBillModal(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center space-x-2"
            >
              <FaPlus className="w-4 h-4" />
              <span>Tạo hóa đơn</span>
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
                <th className="px-4 py-2 text-left">Phòng</th>
                <th className="px-4 py-2 text-left">Kỳ hóa đơn</th>
                <th className="px-4 py-2 text-left">Số điện</th>
                <th className="px-4 py-2 text-left">Tiêu thụ</th>
                <th className="px-4 py-2 text-left">Trạng thái</th>
                <th className="px-4 py-2 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {roomBills.map(bill => (
                <tr key={bill.id} className="border-t">
                  <td className="px-4 py-2">{bill.Room?.ten_phong}</td>
                  <td className="px-4 py-2">
                    {formatDate(bill.tu_ngay)} - {formatDate(bill.den_ngay)}
                  </td>
                  <td className="px-4 py-2">
                    {bill.so_dien_cu} → {bill.so_dien_moi}
                  </td>
                  <td className="px-4 py-2">{bill.so_dien_moi - bill.so_dien_cu} kWh</td>
                  <td className="px-4 py-2">{getStatusBadge(bill.trang_thai)}</td>
                  <td className="px-4 py-2 text-center">
                    <div className="flex space-x-2">
                      {bill.trang_thai === 'draft' && (
                        <>
                          <button
                            onClick={() => handleEditRoomBill(bill)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Chỉnh sửa"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteRoomBill(bill.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Xóa"
                          >
                            <FaTrash />
                          </button>
                          <button
                            onClick={() => handleCalculateStudentBills(bill.id)}
                            className="text-green-600 hover:text-green-800"
                            title="Tính tiền sinh viên"
                          >
                            <FaCalculator />
                          </button>
                        </>
                      )}
                      {bill.trang_thai === 'calculated' && (
                        <button
                          onClick={() => handleFinalizeRoomBill(bill.id)}
                          className="text-green-600 hover:text-green-800"
                          title="Hoàn thiện"
                        >
                          <FaCheck />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Room Bill Modal */}
      {showRoomBillModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingRoomBill ? 'Cập nhật' : 'Tạo'} Hóa đơn Phòng
            </h3>
            <form onSubmit={handleCreateRoomBill}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Phòng</label>
                  <select
                    value={roomBillForm.id_phong}
                    onChange={(e) => setRoomBillForm(prev => ({ ...prev, id_phong: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  >
                    <option value="">Chọn phòng</option>
                    {rooms.map(room => (
                      <option key={room.id} value={room.id}>{room.ten_phong}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Từ ngày</label>
                    <input
                      type="date"
                      value={roomBillForm.tu_ngay}
                      onChange={(e) => setRoomBillForm(prev => ({ ...prev, tu_ngay: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Đến ngày</label>
                    <input
                      type="date"
                      value={roomBillForm.den_ngay}
                      onChange={(e) => setRoomBillForm(prev => ({ ...prev, den_ngay: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Số điện cũ</label>
                    <input
                      type="number"
                      value={roomBillForm.so_dien_cu}
                      onChange={(e) => setRoomBillForm(prev => ({ ...prev, so_dien_cu: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Số điện mới</label>
                    <input
                      type="number"
                      value={roomBillForm.so_dien_moi}
                      onChange={(e) => setRoomBillForm(prev => ({ ...prev, so_dien_moi: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Ghi chú</label>
                  <textarea
                    value={roomBillForm.ghi_chu}
                    onChange={(e) => setRoomBillForm(prev => ({ ...prev, ghi_chu: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    rows="3"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowRoomBillModal(false);
                    setEditingRoomBill(null);
                    setRoomBillForm({
                      id_phong: '',
                      tu_ngay: '',
                      den_ngay: '',
                      so_dien_cu: '',
                      so_dien_moi: '',
                      ghi_chu: ''
                    });
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                >
                  {loading ? 'Đang lưu...' : 'Lưu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>

  )
}

export default ElectricRoomInvoices
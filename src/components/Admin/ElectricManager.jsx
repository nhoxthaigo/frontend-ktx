import React, { useState, useEffect } from 'react';
import { electricityService } from '../../services/electricity/electricity.service';
import { roomService } from '../../services/room/room.service';
import { FaPlus, FaEdit, FaTrash, FaCalculator, FaCheck, FaDownload, FaEye, FaMoneyBill } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import BulkElectricityActions from './Electricity/BulkElectricityActions';
import ElectricityStatisticsCards from './Electricity/ElectricityStatisticsCards';
import { buildParams } from '../../utils/buildParams.util';
const ElectricManager = () => {
  const [activeTab, setActiveTab] = useState('rates'); // rates, roomBills, studentBills, statistics
  const [loading, setLoading] = useState(false);

  // ===== STATES FOR ELECTRICITY RATES =====
  const [electricityRates, setElectricityRates] = useState([]);
  const [rateForm, setRateForm] = useState({
    don_gia: '',
    tu_ngay: '',
    den_ngay: '',
    ghi_chu: ''
  });
  const [showRateModal, setShowRateModal] = useState(false);

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

  // ===== STATES FOR STATISTICS =====
  const [statistics, setStatistics] = useState(null);

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

  // ===== LOAD DATA =====
  useEffect(() => {
    loadRooms();
  }, []);

  useEffect(() => {
    switch (activeTab) {
      case 'rates':
        loadElectricityRates();
        break;
      case 'roomBills':
        loadRoomBills();
        break;
      case 'studentBills':
        loadStudentBills();
        break;
      case 'statistics':
        loadStatistics();
        break;
    }
  }, [activeTab, pagination.page, filters]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadRooms = async () => {
    try {
      const response = await roomService.getAll();
      setRooms(response.data?.rooms || response.data || []);
    } catch (err) {
      console.error('Error loading rooms:', err);
      toast.error('Không thể tải danh sách phòng');
    }
  };

  const loadElectricityRates = async () => {
    setLoading(true);
    try {
      const params = buildParams(
        { page: pagination.page, limit: pagination.limit },
        filters
      );

      const res = await electricityService.getElectricityRates(params);
      console.log('Electricity Rates:', res);
      setElectricityRates(res || []);
      setPagination(prev => ({
        ...prev,
        total: res.meta?.total || 0,
        totalPages: res.meta?.totalPages || 0,
      }));
    } catch (err) {
      console.error('Error loading electricity rates:', err);
      toast.error('Không thể tải danh sách đơn giá điện');
    } finally {
      setLoading(false);
    }
  };

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

  const loadStatistics = async () => {
    setLoading(true);
    try {
      const response = await electricityService.getElectricityStatistics();
      setStatistics(response.data);
    } catch (error) {
      toast.error('Không thể tải thống kê');
    }
    setLoading(false);
  };

  // ===== ELECTRICITY RATES HANDLERS =====
  const handleCreateRate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await electricityService.createElectricityRate(rateForm);
      toast.success('Tạo đơn giá điện thành công');
      setShowRateModal(false);
      setRateForm({ don_gia: '', tu_ngay: '', den_ngay: '', ghi_chu: '' });
      loadElectricityRates();
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Không thể tạo đơn giá điện');
    }
    setLoading(false);
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

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Quản lý Tiền Điện</h2>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { key: 'rates', label: 'Đơn giá điện', icon: FaMoneyBill },
              { key: 'roomBills', label: 'Hóa đơn phòng', icon: FaCalculator },
              { key: 'studentBills', label: 'Hóa đơn sinh viên', icon: FaEye },
              { key: 'statistics', label: 'Thống kê', icon: FaDownload }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${activeTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'rates' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Quản lý Đơn giá Điện</h3>
            <button
              onClick={() => setShowRateModal(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center space-x-2"
            >
              <FaPlus className="w-4 h-4" />
              <span>Thêm đơn giá</span>
            </button>
          </div>

          {loading ? (
            <div className="text-center py-4">Đang tải...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left">Đơn giá (VNĐ/kWh)</th>
                    <th className="px-4 py-2 text-left">Từ ngày</th>
                    <th className="px-4 py-2 text-left">Đến ngày</th>
                    <th className="px-4 py-2 text-left">Ghi chú</th>
                  </tr>
                </thead>
                <tbody>
                  {electricityRates.map(rate => (
                    <tr key={rate.id} className="border-t">
                      <td className="px-4 py-2">{formatCurrency(rate.don_gia)}</td>
                      <td className="px-4 py-2">{formatDate(rate.tu_ngay)}</td>
                      <td className="px-4 py-2">{rate.den_ngay ? formatDate(rate.den_ngay) : 'Không giới hạn'}</td>
                      <td className="px-4 py-2">{rate.ghi_chu || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'roomBills' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Quản lý Hóa đơn Phòng</h3>
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

          {/* Bulk Actions */}
          <BulkElectricityActions onRefresh={loadRoomBills} />

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
            <select
              value={filters.id_phong}
              onChange={(e) => setFilters(prev => ({ ...prev, id_phong: e.target.value }))}
              className="border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">Tất cả phòng</option>
              {rooms.map(room => (
                <option key={room.id} value={room.id}>{room.ten_phong}</option>
              ))}
            </select>

            <select
              value={filters.trang_thai}
              onChange={(e) => setFilters(prev => ({ ...prev, trang_thai: e.target.value }))}
              className="border border-gray-300 rounded-md px-3 py-2"
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
              className="border border-gray-300 rounded-md px-3 py-2"
              placeholder="Từ ngày"
            />

            <input
              type="date"
              value={filters.den_ngay}
              onChange={(e) => setFilters(prev => ({ ...prev, den_ngay: e.target.value }))}
              className="border border-gray-300 rounded-md px-3 py-2"
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

          {loading ? (
            <div className="text-center py-4">Đang tải...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left">Phòng</th>
                    <th className="px-4 py-2 text-left">Kỳ hóa đơn</th>
                    <th className="px-4 py-2 text-left">Số điện</th>
                    <th className="px-4 py-2 text-left">Tiêu thụ</th>
                    <th className="px-4 py-2 text-left">Trạng thái</th>
                    <th className="px-4 py-2 text-left">Thao tác</th>
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
                      <td className="px-4 py-2">
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
        </div>
      )}

      {activeTab === 'studentBills' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Quản lý Hóa đơn Sinh viên</h3>
          </div>

          {/* Filters for Student Bills */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
            <select
              value={filters.trang_thai_thanh_toan}
              onChange={(e) => setFilters(prev => ({ ...prev, trang_thai_thanh_toan: e.target.value }))}
              className="border border-gray-300 rounded-md px-3 py-2"
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
              className="border border-gray-300 rounded-md px-3 py-2"
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

          {loading ? (
            <div className="text-center py-4">Đang tải...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left">Sinh viên</th>
                    <th className="px-4 py-2 text-left">Phòng</th>
                    <th className="px-4 py-2 text-left">Kỳ hóa đơn</th>
                    <th className="px-4 py-2 text-left">Số tiền phải trả</th>
                    <th className="px-4 py-2 text-left">Đã thanh toán</th>
                    <th className="px-4 py-2 text-left">Còn lại</th>
                    <th className="px-4 py-2 text-left">Trạng thái</th>
                    <th className="px-4 py-2 text-left">Thao tác</th>
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
                        <td className="px-4 py-2">
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
        </div>
      )}

      {activeTab === 'statistics' && (
        <div>
          <h3 className="text-lg font-semibold mb-6">Thống kê Tiền Điện</h3>

          {loading ? (
            <div className="text-center py-4">Đang tải...</div>
          ) : (
            <ElectricityStatisticsCards statistics={statistics} />
          )}

          {/* Monthly Chart can be added here */}
          {statistics?.monthlyStats && statistics.monthlyStats.length > 0 && (
            <div className="mt-8 bg-white p-6 rounded-lg shadow-sm">
              <h4 className="text-lg font-medium mb-4">Thống kê theo tháng ({new Date().getFullYear()})</h4>
              <div className="space-y-2">
                {statistics.monthlyStats.map((stat) => (
                  <div key={stat.month} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="font-medium">Tháng {stat.month}</span>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">{stat.billCount} hóa đơn</div>
                      <div className="font-semibold">{formatCurrency(stat.totalAmount)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Rate Modal */}
      {showRateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Thêm Đơn giá Điện</h3>
            <form onSubmit={handleCreateRate}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Đơn giá (VNĐ/kWh)</label>
                  <input
                    type="number"
                    value={rateForm.don_gia}
                    onChange={(e) => setRateForm(prev => ({ ...prev, don_gia: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Từ ngày</label>
                  <input
                    type="date"
                    value={rateForm.tu_ngay}
                    onChange={(e) => setRateForm(prev => ({ ...prev, tu_ngay: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Đến ngày (Tùy chọn)</label>
                  <input
                    type="date"
                    value={rateForm.den_ngay}
                    onChange={(e) => setRateForm(prev => ({ ...prev, den_ngay: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Ghi chú</label>
                  <textarea
                    value={rateForm.ghi_chu}
                    onChange={(e) => setRateForm(prev => ({ ...prev, ghi_chu: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    rows="3"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowRateModal(false)}
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
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
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
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
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
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Nhập mã giao dịch (nếu có)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Ghi chú</label>
                  <textarea
                    value={paymentForm.ghi_chu}
                    onChange={(e) => setPaymentForm(prev => ({ ...prev, ghi_chu: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
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

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="flex space-x-2">
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
              disabled={pagination.page === 1}
              className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50"
            >
              Trước
            </button>

            <span className="px-3 py-2 bg-blue-500 text-white rounded-md">
              {pagination.page} / {pagination.totalPages}
            </span>

            <button
              onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.totalPages, prev.page + 1) }))}
              disabled={pagination.page === pagination.totalPages}
              className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50"
            >
              Sau
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ElectricManager;
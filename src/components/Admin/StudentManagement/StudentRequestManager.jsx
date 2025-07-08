import React, { useState, useEffect } from 'react';
import { ENUM_PHIEU_DANG_KY_TRANG_THAI } from '../../../constant/enum'; // Import enum trạng thái
import { registrationService } from '../../../services/registration/registration.service'; // Service xử lý đăng ký
import { roomService } from '../../../services/room/room.service'; // Service phòng, giường

const StudentRequestManager = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchTermStatus, setSearchTermStatus] = useState('');
  const [searchTermStudentId, setSearchTermStudentId] = useState('');
  const [loading, setLoading] = useState(false);

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const [availableRooms, setAvailableRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [availableBeds, setAvailableBeds] = useState([]);
  const [selectedApproveBedId, setSelectedApproveBedId] = useState('');

  // Fetch danh sách yêu cầu
  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await registrationService.getAllRegistrations({
        page: 1,
        limit: 100,
        trang_thai: searchTermStatus,
        search: searchTermStudentId,
      });
      setRequests(res.data?.registrations || []);
      setFilteredRequests(res.data?.registrations || []);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
      alert('Không thể tải dữ liệu yêu cầu. Vui lòng thử lại.');
      setRequests([]);
      setFilteredRequests([]);
    } finally {
      setLoading(false);
    }
  };

  // Tải lại danh sách khi filter thay đổi
  useEffect(() => {
    fetchRequests();
  }, [searchTermStatus, searchTermStudentId]);

  // Lọc dữ liệu trên client (nếu cần)
  useEffect(() => {
    let results = requests;
    if (searchTermStatus) {
      results = results.filter((req) => req.trang_thai === searchTermStatus);
    }
    if (searchTermStudentId) {
      results = results.filter((req) =>
        String(req.Student?.mssv || req.Student?.ten || '')
          .toLowerCase()
          .includes(searchTermStudentId.toLowerCase())
      );
    }
    setFilteredRequests(results);
  }, [searchTermStatus, searchTermStudentId, requests]);

  // Hàm hiển thị trạng thái
  const getStatusDisplay = (status) => {
    switch (status) {
      case ENUM_PHIEU_DANG_KY_TRANG_THAI.PENDING:
        return (
          <span className="px-3 py-1 inline-flex text-xs font-semibold bg-yellow-100 text-yellow-800 rounded">
            Đang chờ
          </span>
        );
      case ENUM_PHIEU_DANG_KY_TRANG_THAI.APPROVED:
        return (
          <span className="px-3 py-1 inline-flex text-xs font-semibold bg-green-100 text-green-800 rounded">
            Đã chấp thuận
          </span>
        );
      case ENUM_PHIEU_DANG_KY_TRANG_THAI.REJECTED:
        return (
          <span className="px-3 py-1 inline-flex text-xs font-semibold bg-red-100 text-red-800 rounded">
            Đã từ chối
          </span>
        );
      case ENUM_PHIEU_DANG_KY_TRANG_THAI.CANCELLED:
        return (
          <span className="px-3 py-1 inline-flex text-xs font-semibold bg-gray-100 text-gray-800 rounded">
            Đã hủy
          </span>
        );
      default:
        return status;
    }
  };

  // Xem chi tiết
  const handleViewDetail = (request) => {
    setSelectedRequest(request);
    setShowDetailModal(true);
    // Reset chọn giường khi mở detail
    setSelectedRoomId('');
    setAvailableBeds([]);
    setSelectedApproveBedId('');
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedRequest(null);
  };

  // Mở modal chấp thuận chọn phòng/giường
  const handleApproveClick = async () => {
    if (!selectedRequest) return;
    setLoading(true);
    try {
      const res = await roomService.getAll();
      const rooms = res.data?.rooms || [];
      const studentGender = (selectedRequest.Student?.phai || '').toString().trim().toLowerCase();

      const filteredRooms = rooms.filter((room) => {
        if (!room.gioi_tinh) return true;
        return room.gioi_tinh.toString().trim().toLowerCase() === studentGender;
      });

      setAvailableRooms(filteredRooms);
      setSelectedRoomId('');
      setAvailableBeds([]);
      setSelectedApproveBedId('');
      setShowApproveModal(true);
    } catch (err) {
      alert('Không thể tải danh sách phòng!');
    } finally {
      setLoading(false);
    }
  };

  // Khi chọn phòng, lấy giường trống
  useEffect(() => {
    const fetchBeds = async () => {
      if (!selectedRoomId) {
        setAvailableBeds([]);
        return;
      }
      setLoading(true);
      try {
        const res = await roomService.getBeds(selectedRoomId);
        const beds = res.data?.beds || [];
        const filteredBeds = beds.filter((bed) => bed.trang_thai === 'available');
        setAvailableBeds(filteredBeds);
      } catch {
        setAvailableBeds([]);
      }
      setLoading(false);
    };
    fetchBeds();
  }, [selectedRoomId]);

  // Xác nhận chấp thuận
  const handleApproveRequest = async () => {
    if (!selectedRequest) return;
    if (!selectedApproveBedId) {
      alert('Vui lòng chọn giường để chấp thuận!');
      return;
    }
    setLoading(true);
    try {
      const response = await registrationService.approveRegistration(selectedRequest.id, {
        id_giuong: parseInt(selectedApproveBedId, 10),
        ghi_chu: selectedRequest.ghi_chu || null,
      });

      if (response.success) {
        alert('Yêu cầu đã được chấp thuận thành công và email sẽ được gửi!');
        fetchRequests();
        setShowApproveModal(false);
        setShowDetailModal(false);
        setSelectedRequest(null);
      } else {
        alert(`Có lỗi xảy ra khi chấp thuận yêu cầu: ${response.error?.message || 'Unknown error'}`);
      }
    } catch (error) {
      alert('Có lỗi xảy ra khi chấp thuận yêu cầu!');
      console.error('Approve request error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mở modal từ chối
  const handleRejectClick = () => {
    setShowDetailModal(false);
    setRejectionReason('');
    setShowRejectModal(true);
  };

  // Xác nhận từ chối
  const handleConfirmReject = async () => {
    if (!selectedRequest || !rejectionReason.trim()) {
      alert('Vui lòng nhập lý do từ chối.');
      return;
    }
    setLoading(true);
    try {
      const response = await registrationService.rejectRegistration(selectedRequest.id, {
        ly_do_tu_choi: rejectionReason,
      });

      if (response.success) {
        alert('Yêu cầu đã được từ chối và email lý do sẽ được gửi!');
        fetchRequests();
        handleCloseRejectModal();
      } else {
        alert(`Có lỗi xảy ra khi từ chối yêu cầu: ${response.error?.message || 'Unknown error'}`);
      }
    } catch (error) {
      alert('Có lỗi xảy ra khi từ chối yêu cầu!');
      console.error('Reject request error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseRejectModal = () => {
    setShowRejectModal(false);
    setSelectedRequest(null);
    setRejectionReason('');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6 text-black">
        Quản Lý Yêu Cầu Đăng Ký Ký Túc Xá
      </h1>

      {/* --- Filter --- */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow-md flex justify-between items-center">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 w-full">
          <input
            type="text"
            placeholder="Mã Sinh Viên hoặc Tên"
            className="p-3 border border-gray-300 rounded-md w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={searchTermStudentId}
            onChange={(e) => setSearchTermStudentId(e.target.value)}
          />
          <select
            className="p-3 border border-gray-300 rounded-md w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={searchTermStatus}
            onChange={(e) => setSearchTermStatus(e.target.value)}
          >
            <option value="">Tất cả trạng thái</option>
            {Object.values(ENUM_PHIEU_DANG_KY_TRANG_THAI).map((status) => (
              <option key={status} value={status}>
                {getStatusDisplay(status).props.children}
              </option>
            ))}
          </select>
        </div>
        {/* Nút thêm ẩn đi để giữ layout */}
        <div className="opacity-0 pointer-events-none">
          {/* <AddButton /> */}
        </div>
      </div>

      {/* --- Table --- */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow-md overflow-x-auto">
        {loading ? (
          <p className="text-center text-gray-500">Đang tải dữ liệu...</p>
        ) : filteredRequests.length === 0 ? (
          <p className="text-center text-gray-500">Không tìm thấy yêu cầu nào.</p>
        ) : (
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID Phiếu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã Sinh Viên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên Sinh Viên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày Đăng Ký
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày Bắt Đầu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày Kết Thúc
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng Thái
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao Tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {request.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {request.Student?.mssv || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {request.Student?.ten || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(request.ngay_dang_ky).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(request.ngay_bat_dau).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {request.ngay_ket_thuc
                      ? new Date(request.ngay_ket_thuc).toLocaleDateString()
                      : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getStatusDisplay(request.trang_thai)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleViewDetail(request)}
                      className="w-[120px] h-[50px] bg-black text-white transition transform duration-100 hover:scale-105 hover:bg-blue-600 rounded-[50px]"
                      disabled={loading}
                    >
                      Xem Chi Tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* --- Modal Chi Tiết --- */}
      {showDetailModal && selectedRequest && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">
              Chi Tiết Phiếu Đăng Ký #{selectedRequest.id}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <p>
                <strong className="text-gray-700">Mã Sinh Viên:</strong>{' '}
                {selectedRequest.Student?.mssv || 'N/A'}
              </p>
              <p>
                <strong className="text-gray-700">Tên Sinh Viên:</strong>{' '}
                {selectedRequest.Student?.ten || 'N/A'}
              </p>
              <p>
                <strong className="text-gray-700">Email Sinh Viên:</strong>{' '}
                {selectedRequest.Student?.email || 'N/A'}
              </p>
              <p>
                <strong className="text-gray-700">Số điện thoại:</strong>{' '}
                {selectedRequest.Student?.sdt || 'N/A'}
              </p>
              <p>
                <strong className="text-gray-700">Trạng Thái:</strong>{' '}
                {getStatusDisplay(selectedRequest.trang_thai)}
              </p>
              <p>
                <strong className="text-gray-700">Ngày Đăng Ký:</strong>{' '}
                {new Date(selectedRequest.ngay_dang_ky).toLocaleDateString()}
              </p>
              <p>
                <strong className="text-gray-700">Ngày Bắt Đầu:</strong>{' '}
                {new Date(selectedRequest.ngay_bat_dau).toLocaleDateString()}
              </p>
              <p>
                <strong className="text-gray-700">Ngày Kết Thúc:</strong>{' '}
                {selectedRequest.ngay_ket_thuc
                  ? new Date(selectedRequest.ngay_ket_thuc).toLocaleDateString()
                  : 'N/A'}
              </p>
              <p className="md:col-span-2">
                <strong className="text-gray-700">Lý Do Đăng Ký:</strong>{' '}
                {selectedRequest.ly_do_dang_ky}
              </p>
              {selectedRequest.ghi_chu && (
                <p className="md:col-span-2">
                  <strong className="text-gray-700">Ghi Chú Của Sinh Viên:</strong>{' '}
                  {selectedRequest.ghi_chu}
                </p>
              )}
              {selectedRequest.ly_do_tu_choi && (
                <p className="md:col-span-2">
                  <strong className="text-gray-700">Lý Do Từ Chối:</strong>{' '}
                  <span className="text-red-600 font-medium">{selectedRequest.ly_do_tu_choi}</span>
                </p>
              )}
              {selectedRequest.Approver && (
                <>
                  <p>
                    <strong className="text-gray-700">Người Duyệt:</strong>{' '}
                    {selectedRequest.Approver.TEN || 'N/A'}
                  </p>
                  <p>
                    <strong className="text-gray-700">Ngày Duyệt:</strong>{' '}
                    {new Date(selectedRequest.ngay_duyet).toLocaleDateString()}
                  </p>
                </>
              )}
            </div>

            <div className="flex justify-end space-x-4 mt-6 border-t pt-4">
              {selectedRequest.trang_thai === ENUM_PHIEU_DANG_KY_TRANG_THAI.PENDING && (
                <>
                  <button
                    onClick={handleApproveClick}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-5 rounded-md shadow-md transition duration-300"
                    disabled={loading}
                  >
                    Chấp Thuận
                  </button>
                  <button
                    onClick={handleRejectClick}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-5 rounded-md shadow-md transition duration-300"
                    disabled={loading}
                  >
                    Từ Chối
                  </button>
                </>
              )}
              <button
                onClick={handleCloseDetailModal}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-5 rounded-md shadow-md transition duration-300"
                disabled={loading}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Modal Chấp Thuận --- */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-3">
              Chọn Phòng và Giường cho Sinh Viên #{selectedRequest?.Student?.mssv}
            </h2>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Phòng:</label>
              <select
                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={selectedRoomId}
                onChange={(e) => setSelectedRoomId(e.target.value)}
              >
                <option value="">-- Chọn phòng --</option>
                {availableRooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.ten_phong} (Giới tính: {room.gioi_tinh || 'Không giới hạn'})
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Giường trống:</label>
              <select
                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={selectedApproveBedId}
                onChange={(e) => setSelectedApproveBedId(e.target.value)}
                disabled={!selectedRoomId}
              >
                <option value="">-- Chọn giường --</option>
                {availableBeds.map((bed) => (
                  <option key={bed.id} value={bed.id}>
                    {bed.ten_giuong}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setShowApproveModal(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-5 rounded-md shadow-md transition duration-300"
                disabled={loading}
              >
                Hủy
              </button>
              <button
                onClick={handleApproveRequest}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-5 rounded-md shadow-md transition duration-300"
                disabled={loading || !selectedApproveBedId}
              >
                Xác Nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Modal Từ Chối --- */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-3">
              Lý Do Từ Chối Phiếu Đăng Ký #{selectedRequest?.id}
            </h2>
            <textarea
              className="w-full border border-gray-300 rounded-md p-3 h-28 resize-none focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Nhập lý do từ chối..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              disabled={loading}
            />
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={handleCloseRejectModal}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-5 rounded-md shadow-md transition duration-300"
                disabled={loading}
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmReject}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-5 rounded-md shadow-md transition duration-300"
                disabled={loading || rejectionReason.trim() === ''}
              >
                Xác Nhận Từ Chối
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentRequestManager;

import React, { useState, useEffect } from 'react';
import { roomTypeService } from '../../../services/room/room.service';
import AddButton from '../../Button/AddButton';
import UpdateButton from '../../Button/UpdateButton';
import DeleteButton from '../../Button/DeleteButton';

const initialRoomTypeState = {
  id: '', ten_loai: '', so_giuong: '', gia_thue: '', dien_tich: '', mo_ta: '', dang_hien: true,
  ngay_tao: '', ngay_cap_nhat: '', nguoi_tao: '', nguoi_cap_nhat: ''
};

const RoomTypeManager = () => {
  const [roomTypes, setRoomTypes] = useState([]);
  const [filteredRoomTypes, setFilteredRoomTypes] = useState([]);
  const [searchTermName, setSearchTermName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingRoomType, setEditingRoomType] = useState(null);
  const [currentRoomType, setCurrentRoomType] = useState(initialRoomTypeState);
  const [loading, setLoading] = useState(false);

  // Load data
  const fetchRoomTypes = async () => {
    setLoading(true);
    try {
      const res = await roomTypeService.getAll();
      const data = res.data.roomTypes || res.data.data || res.data || [];
      setRoomTypes(Array.isArray(data) ? data : []);
      setFilteredRoomTypes(Array.isArray(data) ? data : []);
    } catch {
      setRoomTypes([]);
      setFilteredRoomTypes([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  useEffect(() => {
    let results = Array.isArray(roomTypes) ? roomTypes : [];
    if (searchTermName) {
      results = results.filter(type =>
        type.ten_loai?.toLowerCase().includes(searchTermName.toLowerCase())
      );
    }
    setFilteredRoomTypes(results);
  }, [searchTermName, roomTypes]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentRoomType(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddRoomType = () => {
    setIsAdding(true);
    setEditingRoomType(null);
    setCurrentRoomType({
      ...initialRoomTypeState,
      dang_hien: true
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingRoomType) {
        await roomTypeService.update(currentRoomType.id, currentRoomType);
      } else {
        await roomTypeService.create(currentRoomType);
      }
      await fetchRoomTypes();
      setIsAdding(false);
      setEditingRoomType(null);
      setCurrentRoomType(initialRoomTypeState);
    } catch (err) {
      alert('Có lỗi xảy ra khi lưu loại phòng!');
    }
    setLoading(false);
  };

  const handleEdit = (roomType) => {
    setEditingRoomType(roomType);
    setCurrentRoomType(roomType);
    setIsAdding(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa loại phòng này?')) {
      setLoading(true);
      try {
        await roomTypeService.delete(id);
        await fetchRoomTypes();
        if (editingRoomType && editingRoomType.id === id) {
          setEditingRoomType(null);
          setIsAdding(false);
          setCurrentRoomType(initialRoomTypeState);
        }
      } catch {
        alert('Xóa thất bại!');
      }
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingRoomType(null);
    setCurrentRoomType(initialRoomTypeState);
  };

  return (
    <div className="">
      <div className=" flex justify-between items-center mb-4">
        {/* Filter + Add */}
        <div className="flex flex-col justify-between md:flex-row md:items-center md:space-x-4 w-full">
          <input
            type="text"
            placeholder="Lọc theo Tên Loại Phòng"
            className="border border-gray-300 rounded-md px-3 py-2"
            value={searchTermName}
            onChange={(e) => setSearchTermName(e.target.value)}
          />
          <div onClick={handleAddRoomType}>
            <AddButton />
          </div>
        </div>
      </div>
      {/* Add/Update Form */}
      {(isAdding || editingRoomType) && (
        <div className="mb-6 bg-gray-50 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">
            {editingRoomType ? 'Cập Nhật Loại Phòng' : 'Thêm Loại Phòng Mới'}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tên Loại Phòng</label>
              <input
                type="text"
                name="ten_loai"
                value={currentRoomType.ten_loai}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Số Giường</label>
              <input
                type="number"
                name="so_giuong"
                value={currentRoomType.so_giuong}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Giá (VNĐ)</label>
              <input
                type="number"
                name="gia_thue"
                value={currentRoomType.gia_thue}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Diện tích (m²)</label>
              <input
                type="number"
                name="dien_tich"
                value={currentRoomType.dien_tich}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Mô Tả</label>
              <textarea
                name="ghi_chu"
                value={currentRoomType.mo_ta}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                rows="2"
              />
            </div>
            <div className="flex items-center md:col-span-2">
              <input
                type="checkbox"
                id="dang_hien"
                name="dang_hien"
                checked={currentRoomType.dang_hien}
                onChange={handleInputChange}
                className="h-5 w-5 text-purple-600 border-gray-300 rounded"
              />
              <label htmlFor="dang_hien" className="ml-2 text-sm font-medium text-gray-700">Đang hiển thị</label>
            </div>
            <div className="md:col-span-2 flex justify-end space-x-2 mt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={loading}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                disabled={loading}
              >
                {editingRoomType ? 'Cập Nhật' : 'Thêm Mới'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Room Type List */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="text-center py-4">Đang tải...</div>
        ) : filteredRoomTypes.length === 0 ? (
          <div className="text-center py-4 text-gray-500">Không tìm thấy loại phòng nào.</div>
        ) : (
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Tên Loại Phòng</th>
                <th className="px-4 py-2 text-left">Số Giường</th>
                <th className="px-4 py-2 text-left">Giá</th>
                <th className="px-4 py-2 text-left">Diện Tích</th>
                <th className="px-4 py-2 text-left">Mô Tả</th>
                <th className="px-4 py-2 text-center">Hiển Thị</th>
                <th className="px-4 py-2 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredRoomTypes.map((roomType) => (
                <tr key={roomType.id} className="border-t">
                  <td className="px-4 py-2">{roomType.id}</td>
                  <td className="px-4 py-2">{roomType.ten_loai}</td>
                  <td className="px-4 py-2">{roomType.so_giuong}</td>
                  <td className="px-4 py-2">{Number(roomType.gia_thue).toLocaleString('vi-VN')} VNĐ</td>
                  <td className="px-4 py-2">{roomType.dien_tich}</td>
                  <td className="px-4 py-2">{roomType.mo_ta || '-'}</td>
                  <td className="px-4 py-2 text-center">
                    {roomType.dang_hien ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Có
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Không
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-center flex flex-row items-center justify-center">
                    <div onClick={() => handleEdit(roomType)} disabled={loading}><UpdateButton /></div>
                    <div onClick={() => handleDelete(roomType.id)} disabled={loading}><DeleteButton /></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
};
export default RoomTypeManager;
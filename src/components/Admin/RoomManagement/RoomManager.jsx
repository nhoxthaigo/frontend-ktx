import React, { useState, useEffect } from 'react';
import { roomService } from '../../../services/room/room.service';
import { roomTypeService } from '../../../services/room/room.service';
import AddButton from '../../Button/AddButton';
import UpdateButton from '../../Button/UpdateButton';
import DeleteButton from '../../Button/DeleteButton';
const initialRoomState = {
  id: '',
  ten_phong: '',
  id_loai_phong: '',
  so_tang: '',
  trang_thai: '',
  gioi_tinh: '',
  ghi_chu: '',
  dang_hien: true,
  hinh_anh: '', // Thêm trường này
};

const RoomManager = () => {
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [searchTermName, setSearchTermName] = useState('');
  const [searchTermRoomType, setSearchTermRoomType] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [currentRoom, setCurrentRoom] = useState(initialRoomState);
  const [loading, setLoading] = useState(false);

  // Load room types
  useEffect(() => {
    roomTypeService.getAll().then(res => {
      const data = res.data?.roomTypes || res.data || [];
      setRoomTypes(data);
    });
  }, []);

  // Load rooms
  const fetchRooms = async () => {
    setLoading(true);
    try {
      const res = await roomService.getAll();
      const data = res.data?.rooms || res.data || [];
      setRooms(data);
      setFilteredRooms(data);
    } catch {
      setRooms([]);
      setFilteredRooms([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // Filtering
  useEffect(() => {
    let results = rooms;
    if (searchTermName) {
      results = results.filter(room =>
        room.ten_phong?.toLowerCase().includes(searchTermName.toLowerCase())
      );
    }
    if (searchTermRoomType) {
      results = results.filter(room =>
        String(room.id_loai_phong) === searchTermRoomType
      );
    }
    setFilteredRooms(results);
  }, [searchTermName, searchTermRoomType, rooms]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentRoom(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddRoom = () => {
    setIsAdding(true);
    setEditingRoom(null);
    setCurrentRoom({
      ...initialRoomState,
      dang_hien: true
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingRoom) {
        await roomService.update(currentRoom.id, currentRoom);
      } else {
        await roomService.create(currentRoom);
      }
      await fetchRooms();
      setIsAdding(false);
      setEditingRoom(null);
      setCurrentRoom(initialRoomState);
    } catch (err) {
      alert('Có lỗi xảy ra khi lưu phòng!');
    }
    setLoading(false);
  };

  const handleEdit = (room) => {
    setEditingRoom(room);
    setCurrentRoom(room);
    setIsAdding(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phòng này?')) {
      setLoading(true);
      try {
        await roomService.delete(id);
        await fetchRooms();
        if (editingRoom && editingRoom.id === id) {
          setEditingRoom(null);
          setIsAdding(false);
          setCurrentRoom(initialRoomState);
        }
      } catch {
        alert('Xóa thất bại!');
      }
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingRoom(null);
    setCurrentRoom(initialRoomState);
  };

  return (
    <div>
      {/* Filter + Add */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col justify-between md:flex-row md:items-center md:space-x-4 w-full">
          <div className="md:space-x-4 space-y-2 mb-4 md:mb-0">
            <input
              type="text"
              placeholder="Lọc theo Tên Phòng"
              className="p-3 border border-gray-300 rounded-md w-full md:w-[300px] focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={searchTermName}
              onChange={(e) => setSearchTermName(e.target.value)}
            />
            <select
              className="p-3 border border-gray-300 rounded-md w-full md:w-[300px] focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={searchTermRoomType}
              onChange={(e) => setSearchTermRoomType(e.target.value)}
            >
              <option value="">Tất cả loại phòng</option>
              {roomTypes.map(rt => (
                <option key={rt.id} value={rt.id}>{rt.ten_loai}</option>
              ))}
            </select>
          </div>
          <div onClick={handleAddRoom}>
            <AddButton />
          </div>
        </div>
      </div>

      {/* Add/Update Form */}
      {(isAdding || editingRoom) && (
        <div className="mb-6 bg-gray-50 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">
            {editingRoom ? 'Cập Nhật Phòng' : 'Thêm Phòng Mới'}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tên Phòng</label>
              <input
                type="text"
                name="ten_phong"
                value={currentRoom.ten_phong}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Loại Phòng</label>
              <select
                name="id_loai_phong"
                value={currentRoom.id_loai_phong}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              >
                <option value="">Chọn loại phòng</option>
                {roomTypes.map(rt => (
                  <option key={rt.id} value={rt.id}>{rt.ten_loai}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Số Tầng</label>
              <input
                type="number"
                name="so_tang"
                value={currentRoom.so_tang}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Trạng Thái</label>
              <select
                name="trang_thai"
                value={currentRoom.trang_thai}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              >
                <option value="">Chọn trạng thái</option>
                <option value="available">Còn trống</option>
                <option value="occupied">Đã thuê</option>
                <option value="maintenance">Bảo trì</option>
                <option value="reserved">Đã đặt</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Giới Tính Phòng</label>
              <select
                name="gioi_tinh"
                value={currentRoom.gioi_tinh}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              >
                <option value="">Không phân biệt</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Ảnh Phòng</label>
              <input
                type="text"
                name="hinh_anh"
                value={currentRoom.hinh_anh}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="https://..."
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Mô Tả</label>
              <textarea
                name="ghi_chu"
                value={currentRoom.ghi_chu}
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
                checked={currentRoom.dang_hien}
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
                {editingRoom ? 'Cập Nhật' : 'Thêm Mới'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Room List */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="text-center py-4">Đang tải...</div>
        ) : filteredRooms.length === 0 ? (
          <div className="text-center py-4 text-gray-500">Không tìm thấy phòng nào.</div>
        ) : (
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-200 shadow-sm">
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Tên Phòng</th>
                <th className="px-4 py-2 text-left">Loại Phòng</th>
                <th className="px-4 py-2 text-left">Số Tầng</th>
                <th className="px-4 py-2 text-left">Giới Tính</th>
                <th className="px-4 py-2 text-left">Trạng Thái</th>
                <th className="px-4 py-2 text-left">Giá</th>
                <th className="px-4 py-2 text-center">Hiển Thị</th>
                <th className="px-4 py-2 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredRooms.map((room) => (
                <tr key={room.id} className="border-t">
                  <td className="px-4 py-2">{room.id}</td>
                  <td className="px-4 py-2">{room.ten_phong}</td>
                  <td className="px-4 py-2">
                    {room.RoomType?.ten_loai ||
                      roomTypes.find(rt => rt.id === room.id_loai_phong)?.ten_loai ||
                      ''}
                  </td>
                  <td className="px-4 py-2">{room.so_tang}</td>
                  <td className="px-4 py-2">{room.gioi_tinh}</td>
                  <td className="px-4 py-2">{room.trang_thai}</td>
                  <td className="px-4 py-2">
                    {room.RoomType
                      ? Number(room.RoomType.gia_thue).toLocaleString('vi-VN') + ' VNĐ'
                      : (
                        roomTypes.find(rt => rt.id === room.id_loai_phong)
                          ? Number(roomTypes.find(rt => rt.id === room.id_loai_phong).gia_thue).toLocaleString('vi-VN') + ' VNĐ'
                          : ''
                      )
                    }
                  </td>
                  <td className="px-4 py-2 text-center">
                    {room.dang_hien ? (
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
                    <div onClick={() => handleEdit(room)} disabled={loading}><UpdateButton /></div>
                    <div onClick={() => handleDelete(room.id)} disabled={loading}><DeleteButton /></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
export default RoomManager;
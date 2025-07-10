import React, { useState, useEffect } from "react";
import { roomService } from "../../../services/room/room.service";
import AddButton from "../../Button/AddButton";
import UpdateButton from "../../Button/UpdateButton";
import DeleteButton from "../../Button/DeleteButton";

const initialBedState = {
  id: "",
  ten_giuong: "",
  trang_thai: "available",
  id_sinh_vien: null,
};

const BedManager = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [beds, setBeds] = useState([]);
  const [filteredBeds, setFilteredBeds] = useState([]);
  const [searchTermName, setSearchTermName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [editingBed, setEditingBed] = useState(null);
  const [currentBed, setCurrentBed] = useState(initialBedState);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const res = await roomService.getAll({ limit: 100 });
        const data = res.data?.rooms || res.data?.data?.rooms || [];
        setRooms(data);
      } catch {
        setRooms([]);
      }
      setLoading(false);
    };
    fetchRooms();
  }, []);

  useEffect(() => {
    if (!selectedRoomId) {
      setBeds([]);
      setFilteredBeds([]);
      return;
    }
    const fetchBeds = async () => {
      setLoading(true);
      try {
        const res = await roomService.getBeds(selectedRoomId);
        const data = res.data?.beds || res.data || [];
        setBeds(data);
        setFilteredBeds(data);
      } catch {
        setBeds([]);
        setFilteredBeds([]);
      }
      setLoading(false);
    };
    fetchBeds();
  }, [selectedRoomId]);

  useEffect(() => {
    let results = beds;
    if (searchTermName) {
      results = results.filter((bed) =>
        (bed.ten_giuong || "").toLowerCase().includes(searchTermName.toLowerCase())
      );
    }
    setFilteredBeds(results);
  }, [searchTermName, beds]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentBed((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddBed = () => {
    setIsAdding(true);
    setEditingBed(null);
    setCurrentBed({ ...initialBedState, trang_thai: "available" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingBed) {
        await roomService.updateBed(selectedRoomId, currentBed.id, {
          ten_giuong: currentBed.ten_giuong,
          trang_thai: currentBed.trang_thai,
        });
      } else {
        await roomService.createBed(selectedRoomId, {
          ten_giuong: currentBed.ten_giuong,
          trang_thai: currentBed.trang_thai,
        });
      }
      const res = await roomService.getBeds(selectedRoomId);
      const data = res.data?.beds || res.data || [];
      setBeds(data);
      setFilteredBeds(data);
      setIsAdding(false);
      setEditingBed(null);
      setCurrentBed(initialBedState);
    } catch (err) {
      alert("Có lỗi xảy ra khi lưu giường!");
    }
    setLoading(false);
  };

  const handleEdit = (bed) => {
    setEditingBed(bed);
    setCurrentBed(bed);
    setIsAdding(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa giường này?")) {
      setLoading(true);
      try {
        await roomService.deleteBed(selectedRoomId, id);
        const res = await roomService.getBeds(selectedRoomId);
        const data = res.data?.beds || res.data || [];
        setBeds(data);
        setFilteredBeds(data);
      } catch {
        alert("Xóa thất bại!");
      }
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingBed(null);
    setCurrentBed(initialBedState);
  };

  return (
    <div>
      {/* Filter Section */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 w-full justify-between">
          <div className="md:space-x-4 space-y-2 mb-4 md:mb-0">
            <select
              className="p-3 border border-gray-300 rounded-md w-full md:w-[300px] focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={selectedRoomId}
              onChange={(e) => setSelectedRoomId(e.target.value)}
            >
              <option value="">Chọn phòng</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.ten_phong}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Lọc theo Tên Giường"
              className="p-3 border border-gray-300 rounded-md w-full md:w-[300px] focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={searchTermName}
              onChange={(e) => setSearchTermName(e.target.value)}
              disabled={!selectedRoomId}
            />
          </div>
          <div onClick={handleAddBed}>
            <AddButton />
          </div>
        </div>
      </div>

      {/* Form Add / Edit */}
      {(isAdding || editingBed) && (
        <div className="mb-6 bg-gray-50 p-6 rounded-lg shadow">
          <h3 className="text-2xl font-semibold mb-4">
            {editingBed ? "Cập Nhật Giường" : "Thêm Giường Mới"}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tên Giường</label>
              <input
                type="text"
                name="ten_giuong"
                value={currentBed.ten_giuong}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Trạng Thái</label>
              <select
                name="trang_thai"
                value={currentBed.trang_thai}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              >
                <option value="available">Còn trống</option>
                <option value="occupied">Đã sử dụng</option>
                <option value="maintenance">Bảo trì</option>
              </select>
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
                {editingBed ? "Cập Nhật" : "Thêm Mới"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table Bed List */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="text-center py-4">Đang tải...</div>
        ) : filteredBeds.length === 0 ? (
          <div className="text-center py-4 text-gray-500">Không tìm thấy giường nào.</div>
        ) : (
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-200 shadow-sm">
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Tên Giường</th>
                <th className="px-4 py-2 text-left">Trạng Thái</th>
                <th className="px-4 py-2 text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredBeds.map((bed) => (
                <tr key={bed.id} className="border-t">
                  <td className="px-4 py-2">{bed.id}</td>
                  <td className="px-4 py-2">{bed.ten_giuong}</td>
                  <td className="px-4 py-2">
                    {bed.trang_thai === "available" ? "Còn trống" :
                     bed.trang_thai === "occupied" ? "Đã sử dụng" : "Bảo trì"}
                  </td>
                  <td className="px-4 py-2 text-center flex flex-row items-center justify-center">
                    <div onClick={() => handleEdit(bed)} disabled={loading}><UpdateButton /></div>
                    <div onClick={() => handleDelete(bed.id)} disabled={loading}><DeleteButton /></div>
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

export default BedManager;

//D:\LuanVanTotNghiep\frontend-ktx\src\components\Admin\ElectricManagement\ElectricRateManager.jsx
import React, { useEffect, useState } from "react";
import { electricityService } from "../../../services/electricity/electricity.service";
import AddButton from "../../Button/AddButton";
import UpdateButton from "../../Button/UpdateButton";
import DeleteButton from "../../Button/DeleteButton";
import { buildParams } from "../../../utils/buildParams.util";
import { toast } from "react-hot-toast";

const initialForm = { don_gia: "", tu_ngay: "" };

const ElectricRateManager = () => {
  const [rates, setRates] = useState([]);
  const [filteredRates, setFilteredRates] = useState([]);
  const [searchDate, setSearchDate] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [electricityRates, setElectricityRates] = useState([]);
  const [rateForm, setRateForm] = useState({
    don_gia: '',
    tu_ngay: '',
    den_ngay: '',
    ghi_chu: ''
  });
  const fetchRates = async () => {
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
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [filters, setFilters] = useState({
    id_phong: '',
    trang_thai: '',
    trang_thai_thanh_toan: '',
    tu_ngay: '',
    den_ngay: ''
  });

  useEffect(() => {
    fetchRates();
  }, []);

  useEffect(() => {
    let filtered = rates;
    if (searchDate)
      filtered = filtered.filter((r) =>
        r.tu_ngay.includes(searchDate)
      );
    setFilteredRates(filtered);
  }, [searchDate, rates]);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setRateForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = () => {
    setIsAdding(true);
    setEditing(null);
    setRateForm(initialForm);
  };

  const handleEdit = (rate) => {
    setEditing(rate);
    setIsAdding(true);
    setRateForm(rate);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditing(null);
    setRateForm(initialForm);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa đơn giá này?")) return;
    setLoading(true);
    try {
      await electricityService.delete(id);
      toast.success("Xóa thành công!");
      fetchRates();
    } catch {
      toast.error("Không thể xóa đơn giá.");
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editing) {
        await electricityService.updateElectricityRate(editing.id, rateForm);
        toast.success("Cập nhật thành công!");
      } else {
        await electricityService.createElectricityRate(rateForm);
        toast.success("Thêm đơn giá thành công!");
      }
      setRateForm(initialForm);
      setEditing(null);
      setIsAdding(false);
      fetchRates();
    } catch {
      toast.error("Không thể lưu đơn giá.");
    }
    setLoading(false);
  };
  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('vi-VN');
  };
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 w-full justify-between">
          <div className="md:space-x-4 space-y-2 mb-4 md:mb-0 ">
            <input
              type="date"
              placeholder="Lọc theo ngày áp dụng"
              className="p-3 border border-gray-300 rounded-md w-full md:w-[300px] focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
            />
          </div>

          <div onClick={handleAdd}><AddButton /></div>
        </div>
      </div>

      {(isAdding || editing) && (
        <div className="mb-6 bg-gray-50 p-6 rounded-lg shadow max-w-lg">
          <h3 className="text-lg font-semibold mb-4">
            {editing ? "Cập Nhật Đơn Giá" : "Thêm Đơn Giá Mới"}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
            <input
              type="number"
              name="don_gia"
              value={rateForm.don_gia}
              onChange={handleInput}
              className="border border-gray-300 rounded-md px-3 py-2"
              placeholder="Đơn Giá (VND/kWh)"
              required
            />
            <input
              type="date"
              name="tu_ngay"
              value={rateForm.tu_ngay}
              onChange={handleInput}
              className="border border-gray-300 rounded-md px-3 py-2"
              required
            />
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
              >
                {editing ? "Cập Nhật" : "Thêm Mới"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-x-auto">
        {loading ? (
          <div className="text-center py-4">Đang tải...</div>
        ) : electricityRates.length === 0 ? (
          <div className="text-center py-4 text-gray-500">Không có đơn giá nào.</div>
        ) : (
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Đơn Giá (VND)</th>
                <th className="px-4 py-2 text-left">Từ Ngày</th>
                <th className="px-4 py-2 text-left">Đến Ngày</th>
                <th className="px-4 py-2 text-left">Ghi Chú</th>
                <th className="px-4 py-2 text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {electricityRates.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="px-4 py-2">{r.id}</td>
                  <td className="px-4 py-2">{r.don_gia}</td>
                  <td className="px-4 py-2">{formatDate(r.tu_ngay)}</td>
                  <td className="px-4 py-2">{r.den_ngay ? formatDate(r.den_ngay) : 'Không giới hạn'}</td>
                  <td className="px-4 py-2">{r.ghi_chu || '-'}</td>
                  <td className="px-4 py-2 text-center flex items-center justify-center">
                    <div onClick={() => handleEdit(r)}><UpdateButton /></div>
                    <div onClick={() => handleDelete(r.id)}><DeleteButton /></div>
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

export default ElectricRateManager;

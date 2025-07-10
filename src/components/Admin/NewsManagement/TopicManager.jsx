// D:\LuanVanTotNghiep\frontend-ktx\src\components\Admin\NewsManagement\TopicManager.jsx
import React, { useEffect, useState } from "react";
import { topicService } from "../../../services/topic/topic.services";
import AddButton    from "../../Button/AddButton";
import UpdateButton from "../../Button/UpdateButton";
import DeleteButton from "../../Button/DeleteButton";

const initialTopic = { ten_chu_de: "", mo_ta: "", dang_hien: true };

const TopicManager = () => {
  const [topics, setTopics] = useState([]);
  const [filteredTopics, setFilteredTopics] = useState([]);
  const [searchName, setSearchName]       = useState("");
  const [searchStatus, setSearchStatus]   = useState("");
  const [editing, setEditing]   = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [currentTopic, setCurrentTopic] = useState(initialTopic);
  const [loading, setLoading]   = useState(false);
  const [msg, setMsg]           = useState("");

  const fetchTopics = async () => {
    setLoading(true);
    try {
      const res = await topicService.getAll();
      const data = res.data?.topics || [];
      setTopics(data);
      setFilteredTopics(data);
    } catch {
      setMsg("Lỗi khi tải chủ đề");
    }
    setLoading(false);
  };
  useEffect(() => { fetchTopics(); }, []);

  /* --- filter --- */
  useEffect(() => {
    let res = topics;
    if (searchName)
      res = res.filter(t =>
        (t.ten_chu_de || "").toLowerCase().includes(searchName.toLowerCase()));
    if (searchStatus)
      res = res.filter(t => String(t.dang_hien) === searchStatus);
    setFilteredTopics(res);
  }, [searchName, searchStatus, topics]);

  /* --- handlers --- */
  const openAddForm = () => { setIsAdding(true); setEditing(null); setCurrentTopic(initialTopic); setMsg(""); };
  const openEditForm = (t) => { setEditing(t); setIsAdding(true); setCurrentTopic({ ...t }); setMsg(""); };
  const cancelForm   = () => { setIsAdding(false); setEditing(null); setCurrentTopic(initialTopic); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      if (editing) await topicService.update(editing.id, currentTopic);
      else         await topicService.create(currentTopic);
      fetchTopics(); cancelForm();
      setMsg(editing ? "Đã cập nhật!" : "Đã thêm!");
    } catch { setMsg("Lỗi khi lưu!"); }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa chủ đề?")) return;
    setLoading(true);
    try { await topicService.delete(id); fetchTopics(); }
    catch { setMsg("Lỗi khi xóa!"); }
    setLoading(false);
  };

  return (
    <div>
      {/* 1. Thanh lọc + Add */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 w-full justify-between">
          <div className="md:space-x-4 space-y-2 mb-4 md:mb-0 ">
            <input
              className="border border-gray-300 rounded-md px-3 py-2 mb-2 md:mb-0"
              placeholder="Lọc theo Tên"
              value={searchName}
              onChange={(e)=>setSearchName(e.target.value)}
            />
            <select
              className="border border-gray-300 rounded-md px-3 py-2 mb-2 md:mb-0"
              value={searchStatus}
              onChange={(e)=>setSearchStatus(e.target.value)}
            >
              <option value="">Tất cả trạng thái</option>
              <option value="true">Hiển thị</option>
              <option value="false">Ẩn</option>
            </select>
          </div>
          <div onClick={openAddForm}><AddButton /></div>
        </div>
      </div>

      {/* 2. Form Add / Edit */}
      {(isAdding || editing) && (
        <div className="mb-6 bg-gray-50 p-6 rounded-lg shadow w-[80%] mx-auto">
          <h3 className="text-2xl font-semibold mb-4 text-center">
            {editing ? "Cập Nhật Chủ Đề" : "Thêm Chủ Đề Mới"}
          </h3>
          {msg && <p className="mb-3 text-center text-red-600">{msg}</p>}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 w-[60%] mx-auto">
            <input
              className="border border-gray-300 rounded-md px-3 py-2"
              placeholder="Tên Chủ Đề"
              name="ten_chu_de"
              value={currentTopic.ten_chu_de}
              onChange={(e)=>setCurrentTopic({...currentTopic,ten_chu_de:e.target.value})}
              required
            />
            <textarea
              rows="2"
              className="border border-gray-300 rounded-md px-3 py-2"
              placeholder="Mô tả"
              name="mo_ta"
              value={currentTopic.mo_ta}
              onChange={(e)=>setCurrentTopic({...currentTopic,mo_ta:e.target.value})}
            />
            <select
              className="border border-gray-300 rounded-md px-3 py-2"
              value={currentTopic.dang_hien}
              onChange={(e)=>setCurrentTopic({...currentTopic,dang_hien:e.target.value==="true"})}
            >
              <option value="true">Hiển thị</option>
              <option value="false">Ẩn</option>
            </select>
            <div className="flex justify-end space-x-2">
              <button type="button" onClick={cancelForm}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">Hủy</button>
              <button type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                disabled={loading}>
                {editing ? "Cập Nhật" : "Thêm Mới"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. Bảng */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="text-center py-4">Đang tải...</div>
        ) : filteredTopics.length === 0 ? (
          <div className="text-center py-4 text-gray-500">Không có chủ đề.</div>
        ) : (
          <table className="min-w-full table-auto">
            <thead><tr className="bg-gray-200 shadow-sm">
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Tên Chủ Đề</th>
              <th className="px-4 py-2 text-left">Mô Tả</th>
              <th className="px-4 py-2 text-center">Hiển Thị</th>
              <th className="px-4 py-2 text-center">Thao Tác</th>
            </tr></thead>
            <tbody>
              {filteredTopics.map(t => (
                <tr key={t.id} className="border-t">
                  <td className="px-4 py-2">{t.id}</td>
                  <td className="px-4 py-2">{t.ten_chu_de}</td>
                  <td className="px-4 py-2">{t.mo_ta}</td>
                  <td className="px-4 py-2 text-center">
                    <span className={`px-2 inline-flex text-xs font-semibold rounded-full ${
                      t.dang_hien ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                      {t.dang_hien ? "Hiển thị" : "Ẩn"}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center flex items-center justify-center">
                    <div onClick={()=>openEditForm(t)}><UpdateButton/></div>
                    <div onClick={()=>handleDelete(t.id)}><DeleteButton/></div>
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

export default TopicManager;

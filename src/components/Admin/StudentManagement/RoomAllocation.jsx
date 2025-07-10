// D:\LuanVanTotNghiep\frontend-ktx\src\components\Admin\RoomManagement\RoomAllocation.jsx
import React, { useEffect, useState } from "react";
import { roomAllocationService } from "../../../services/roomAlocation/roomAlocation.service";
import { studentService } from "../../../services/student/student.service";
import { roomService } from "../../../services/room/room.service";
import { calculateQuarterEndDate } from "../../../utils/quater.utils";
import AddButton    from "../../Button/AddButton";
import UpdateButton from "../../Button/UpdateButton";
import DeleteButton from "../../Button/DeleteButton";

const init = { id_sv:"", id_giuong:"", ngay_bat_dau:"", ngay_ket_thuc:"", trang_thai:"active", ly_do_ket_thuc:"" };
const fmtDate = d => d ? new Date(d).toISOString().slice(0,10) : "";

const RoomAllocation = () => {
  const [allocs,setAllocs]     = useState([]);  const [filtered,setFiltered]=useState([]);
  const [students,setStudents] = useState([]);  const [rooms,setRooms]     = useState([]);
  const [beds,setBeds]         = useState([]);  const [roomId,setRoomId]   = useState("");

  const [search,setSearch]     = useState("");
  const [formOpen,setFormOpen] = useState(false);
  const [editing,setEditing]   = useState(null);
  const [form,setForm]         = useState(init);
  const [loading,setLoading]   = useState(false);
  const [err,setErr]           = useState("");

  /* fetch */
  const fetchAllocs=async()=>{setLoading(true);
    try{const r=await roomAllocationService.getAll();setAllocs(r.data.allocations||[]);setFiltered(r.data.allocations||[]);}
    catch{setErr("Không thể tải phân bổ!");}
    setLoading(false);
  };
  const fetchRefs=async()=>{
    try{const sv=await studentService.getAll({eligible:true});setStudents(sv.data.students||[]);}catch{}
    try{const rm=await roomService.getAll({limit:100});setRooms(rm.data.rooms||[]);}catch{}
  };
  useEffect(()=>{fetchAllocs();fetchRefs();},[]);

  /* beds when room change */
  useEffect(()=>{
    if(!roomId){setBeds([]);return;}
    roomService.getBeds(roomId).then(res=>{
      const av=(res.data.beds||[]).filter(b=>b.trang_thai==="available");
      setBeds(av);
    });
  },[roomId]);

  /* filter */
  useEffect(()=>{
    const t=search.toLowerCase();
    setFiltered(
      allocs.filter(a=>
        (a.Student?.ten||"").toLowerCase().includes(t)||
        (a.Student?.mssv||"").toLowerCase().includes(t)||
        (a.Bed?.ten_giuong||"").toLowerCase().includes(t)||
        (a.Bed?.Room?.ten_phong||"").toLowerCase().includes(t)
      )
    );
  },[search,allocs]);

  /* form handlers */
  const openAdd = ()=>{setFormOpen(true);setEditing(null);setForm(init);setRoomId("");setBeds([]);setErr("");};
  const openEdit = (a)=>{
    setEditing(a); setForm({
      id_sv:a.id_sv, id_giuong:a.id_giuong,
      ngay_bat_dau:fmtDate(a.ngay_bat_dau), ngay_ket_thuc:fmtDate(a.ngay_ket_thuc),
      trang_thai:a.trang_thai, ly_do_ket_thuc:a.ly_do_ket_thuc||""
    });
    setRoomId(a.Bed?.Room?.id||""); setFormOpen(true); setErr("");
    roomService.getBeds(a.Bed?.Room?.id).then(res=>{
      const av=(res.data.beds||[]).filter(b=>b.trang_thai==="available"||b.id===a.id_giuong);
      setBeds(av);
    });
  };
  const cancelForm=()=>{setFormOpen(false);setEditing(null);setForm(init);setRoomId("");setBeds([]);};
  const handleInput=e=>{
    const {name,value}=e.target;
    if(name==="ngay_bat_dau"&&!editing){
      const {endDate}=calculateQuarterEndDate(value);
      setForm(f=>({...f,ngay_bat_dau:value,ngay_ket_thuc:fmtDate(endDate)}));
    }else setForm(f=>({...f,[name]:value}));
  };
  const save=async e=>{
    e.preventDefault(); setLoading(true); setErr("");
    try{
      const send={...form,ngay_ket_thuc:form.ngay_ket_thuc||null};
      editing? await roomAllocationService.update(editing.id,send)
              : await roomAllocationService.create(send);
      fetchAllocs(); fetchRefs(); cancelForm();
    }catch(x){setErr(x?.response?.data?.error?.message||"Lỗi lưu!");}
    setLoading(false);
  };
  const del=async id=>{
    if(!window.confirm("Xóa phân bổ?"))return;
    setLoading(true); try{await roomAllocationService.delete(id);fetchAllocs();fetchRefs();}
    catch(x){setErr("Lỗi xóa!");} setLoading(false);
  };

  const badgeColor=s=>({
    active:"bg-green-100 text-green-700",
    expired:"bg-gray-200 text-gray-700",
    temporarily_away:"bg-yellow-100 text-yellow-700",
    suspended:"bg-orange-100 text-orange-700",
    terminated:"bg-red-100 text-red-700",
    pending_checkout:"bg-blue-100 text-blue-700",
    transferred:"bg-purple-100 text-purple-700"
  }[s]||"bg-gray-100 text-gray-700");

  const trangThaiText=s=>({
    active:"Đang ở",expired:"Hết hạn",temporarily_away:"Tạm vắng",
    suspended:"Tạm dừng",terminated:"Kết thúc",pending_checkout:"Chờ trả phòng",
    transferred:"Chuyển phòng"
  }[s]||s);

  /* UI */
  return (
    <div>
      {/* alert */}
      {err&&<div className="mb-4 p-3 rounded-md bg-red-100 text-red-700">{err}</div>}

      {/* top bar: search + add */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 w-full justify-between">
          <div className="md:space-x-4 space-y-2 mb-4">
            <input
            className="p-3 border border-gray-300 rounded-md w-full md:w-[300px] focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Tìm nhanh (SV, MSSV, Giường, Phòng...)"
            value={search} onChange={e=>setSearch(e.target.value)}
          />
          </div>
          <div onClick={openAdd}><AddButton/></div>
        </div>
      </div>

      {/* form */}
      {formOpen&&(
        <div className="mb-6 bg-gray-50 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">{editing?"Cập Nhật Phân Bổ":"Thêm Phân Bổ Mới"}</h3>
          <form onSubmit={save} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* SV */}
            <select name="id_sv" value={form.id_sv} onChange={handleInput}
              className="border border-gray-300 rounded-md px-3 py-2" required disabled={!!editing}>
              <option value="">-- Chọn sinh viên --</option>
              {students.map(s=><option key={s.id} value={s.id}>{s.mssv} – {s.ten}</option>)}
            </select>
            {/* phòng */}
            <select value={roomId} onChange={e=>{setRoomId(e.target.value);setForm(f=>({...f,id_giuong:""}));}}
              className="border border-gray-300 rounded-md px-3 py-2" required>
              <option value="">-- Chọn phòng --</option>
              {rooms.map(r=><option key={r.id} value={r.id}>{r.ten_phong}</option>)}
            </select>
            {/* giường */}
            <select name="id_giuong" value={form.id_giuong} onChange={handleInput}
              className="border border-gray-300 rounded-md px-3 py-2" required disabled={!roomId}>
              <option value="">-- Chọn giường --</option>
              {beds.map(b=><option key={b.id} value={b.id}>{b.ten_giuong}</option>)}
            </select>
            {/* dates */}
            <input type="date" name="ngay_bat_dau" value={form.ngay_bat_dau} onChange={handleInput}
              className="border border-gray-300 rounded-md px-3 py-2" required/>
            <input type="date" name="ngay_ket_thuc" value={form.ngay_ket_thuc||""} onChange={handleInput}
              className="border border-gray-300 rounded-md px-3 py-2"
              readOnly={!editing} style={{background:!editing?"#f5f5f5":""}}/>
            {/* trạng thái */}
            <select name="trang_thai" value={form.trang_thai} onChange={handleInput}
              className="border border-gray-300 rounded-md px-3 py-2" required>
              <option value="active">Đang ở</option>
              <option value="expired">Hết hạn</option>
              <option value="temporarily_away">Tạm vắng</option>
              <option value="suspended">Tạm dừng</option>
              <option value="terminated">Kết thúc</option>
              <option value="pending_checkout">Chờ trả phòng</option>
              <option value="transferred">Chuyển phòng</option>
            </select>
            <input name="ly_do_ket_thuc" value={form.ly_do_ket_thuc} onChange={handleInput}
              className="border border-gray-300 rounded-md px-3 py-2" placeholder="Lý do kết thúc (nếu có)"/>
            {/* actions */}
            <div className="md:col-span-2 flex justify-end space-x-2">
              <button type="button" onClick={cancelForm}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">Hủy</button>
              <button type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                disabled={loading}>{editing?"Cập Nhật":"Thêm Mới"}</button>
            </div>
          </form>
        </div>
      )}

      {/* table */}
      <div className="overflow-x-auto">
        {loading?(
          <div className="text-center py-4">Đang tải...</div>
        ):filtered.length===0?(
          <div className="text-center py-4 text-gray-500">Không có phân bổ.</div>
        ):(
          <table className="min-w-full table-auto">
            <thead><tr className="bg-gray-200 shadow-sm">
              {["MSSV","Tên SV","Giường","Phòng","Tầng","Bắt đầu","Kết thúc","Trạng thái","Thanh toán","Thao tác"].map(h=>(
                <th key={h} className={`px-4 py-2 ${h==="Thao tác"?"text-center":"text-left"}`}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.map(a=>(
                <tr key={a.id} className="border-t">
                  <td className="px-4 py-2">{a.Student?.mssv}</td>
                  <td className="px-4 py-2">{a.Student?.ten}</td>
                  <td className="px-4 py-2">{a.Bed?.ten_giuong}</td>
                  <td className="px-4 py-2">{a.Bed?.Room?.ten_phong}</td>
                  <td className="px-4 py-2">{a.Bed?.Room?.so_tang}</td>
                  <td className="px-4 py-2">{a.ngay_bat_dau?new Date(a.ngay_bat_dau).toLocaleDateString("vi-VN"):""}</td>
                  <td className="px-4 py-2">{a.ngay_ket_thuc?new Date(a.ngay_ket_thuc).toLocaleDateString("vi-VN"):"—"}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 inline-flex text-xs font-semibold rounded-full ${badgeColor(a.trang_thai)}`}>
                      {trangThaiText(a.trang_thai)}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <span className={`px-2 inline-flex text-xs font-semibold rounded-full ${
                      a.trang_thai_thanh_toan ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {a.trang_thai_thanh_toan ? "Đã TT" : "Chưa TT"}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center flex items-center justify-center">
                    <div onClick={()=>openEdit(a)}><UpdateButton/></div>
                    <div onClick={()=>del(a.id)}><DeleteButton/></div>
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

export default RoomAllocation;

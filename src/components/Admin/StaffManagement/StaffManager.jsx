// D:\LuanVanTotNghiep\frontend-ktx\src\components\Admin\StaffManagement\StaffManager.jsx
import React, { useState, useEffect } from "react";
import { staffService } from "../../../services/staff/staff.service";
import AddButton    from "../../Button/AddButton";
import UpdateButton from "../../Button/UpdateButton";
import DeleteButton from "../../Button/DeleteButton";

const initialStaffState = {
  ma_nv:"", ten:"", mat_khau:"", role:"",
  sdt:"", email:"", cmnd:"", phai:"",
  phong_ban:"", ngay_vao_lam:"", trang_thai:"",
  dang_hien:true,
};

const StaffManager = () => {
  const [staff,setStaff]       = useState([]);
  const [filtered,setFiltered] = useState([]);
  const [kwName,setKwName]     = useState("");
  const [kwRole,setKwRole]     = useState("");

  const [isAdding,setAdding]   = useState(false);
  const [editing,setEditing]   = useState(null);
  const [cur,setCur]           = useState(initialStaffState);
  const [loading,setLoading]   = useState(false);

  /* fetch staff */
  const fetch = async()=>{setLoading(true);
    try{
      const r=await staffService.getAll();
      const data=r.data.staff||[];
      setStaff(data); setFiltered(data);
    }catch{alert("Không thể tải danh sách nhân viên!");}
    setLoading(false);
  };
  useEffect(()=>{fetch();},[]);

  /* filter */
  useEffect(()=>{
    let res=staff;
    if(kwName) res=res.filter(m=>(m.ten||"").toLowerCase().includes(kwName.toLowerCase()));
    if(kwRole) res=res.filter(m=>(m.role||"").toLowerCase().includes(kwRole.toLowerCase()));
    setFiltered(res);
  },[kwName,kwRole,staff]);

  /* handlers */
  const openAdd = ()=>{setAdding(true);setEditing(null);setCur(initialStaffState);};
  const openEdit = m=>{setEditing(m);setAdding(true);setCur(m);};
  const cancel   = ()=>{setAdding(false);setEditing(null);setCur(initialStaffState);};

  const change=e=>{
    const {name,value,type,checked}=e.target;
    setCur(p=>({...p,[name]:type==="checkbox"?checked:value}));
  };

  const submit=async e=>{
    e.preventDefault();
    try{
      if(editing){
        const {mat_khau,...update}=cur;
        await staffService.update(editing.id,update);
        alert("Cập nhật thành công!");
      }else{
        await staffService.create(cur);
        alert("Thêm mới thành công!");
      }
      cancel(); fetch();
    }catch(err){
      alert(err?.response?.data?.error?.message||"Có lỗi xảy ra khi lưu!");
    }
  };

  const del=async id=>{
    if(!window.confirm("Xóa nhân viên?"))return;
    try{await staffService.delete(id); fetch();}
    catch(err){alert(err?.response?.data?.error?.message||"Lỗi xóa!");}
  };

  /* UI */
  return (
    <div className="w-full">
      {/* top bar filter + add */}
      <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
        <div className="flex flex-wrap gap-4 flex-grow min-w-[250px] justify-between">
          <input
            className="border border-gray-300 rounded-md px-3 py-2 flex-grow min-w-[140px]"
            placeholder="Lọc theo Tên"
            value={kwName} onChange={e=>setKwName(e.target.value)}
          />
          <input
            className="border border-gray-300 rounded-md px-3 py-2 flex-grow min-w-[140px]"
            placeholder="Lọc theo Chức vụ"
            value={kwRole} onChange={e=>setKwRole(e.target.value)}
          />
        </div>
        <div onClick={openAdd}><AddButton/></div>
      </div>

      {/* form add / edit */}
      {(isAdding||editing)&&(
        <div className="mb-6 bg-gray-50 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">{editing?"Cập Nhật Nhân Viên":"Thêm Nhân Viên Mới"}</h3>
          <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.keys(initialStaffState).map(key=>{
              if(key==="dang_hien") return null;
              if(key==="mat_khau" && editing) return null;

              /* select fields */
              if(["phai","role","trang_thai"].includes(key)){
                const opts = key==="phai"
                  ?["Nam","Nữ","Khác"]
                  :key==="role"
                  ?["admin","staff"]
                  :["active","inactive","suspended"];
                return(
                  <div key={key} className="flex flex-col">
                    <label className="text-sm font-medium mb-1 capitalize">{key.replace(/_/g," ")}</label>
                    <select name={key} value={cur[key]} onChange={change}
                      className="border border-gray-300 rounded-md px-3 py-2" required>
                      <option value="">Chọn {key.replace(/_/g," ")}</option>
                      {opts.map(o=><option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                );
              }

              /* normal input */
              return(
                <div key={key} className="flex flex-col">
                  <label className="text-sm font-medium mb-1 capitalize">{key.replace(/_/g," ")}</label>
                  <input
                    type={key==="ngay_vao_lam"?"date":key==="mat_khau"?"password":"text"}
                    name={key} value={cur[key]} onChange={change}
                    className="border border-gray-300 rounded-md px-3 py-2"
                    placeholder={key.replace(/_/g," ")}
                    required={["ma_nv","ten","role","email"].includes(key)}
                  />
                </div>
              );
            })}
            <div className="md:col-span-2 lg:col-span-3 flex justify-end gap-2 mt-4">
              <button type="button" onClick={cancel}
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
          <div className="text-center py-4 text-gray-500">Không tìm thấy nhân viên nào.</div>
        ):(
          <table className="min-w-full table-auto">
            <thead><tr className="bg-gray-50">
              {["Mã NV","Tên","Chức vụ","Phòng ban","SĐT","Email","Trạng thái",""].map(h=>(
                <th key={h} className={`px-4 py-2 ${h===""?"text-center":"text-left"}`}>{h||"Thao Tác"}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.map(m=>(
                <tr key={m.id} className="border-t">
                  <td className="px-4 py-2">{m.ma_nv}</td>
                  <td className="px-4 py-2">{m.ten}</td>
                  <td className="px-4 py-2">{m.role}</td>
                  <td className="px-4 py-2">{m.phong_ban}</td>
                  <td className="px-4 py-2">{m.sdt}</td>
                  <td className="px-4 py-2">{m.email}</td>
                  <td className="px-4 py-2 text-center">
                    <span className={`px-2 inline-flex text-xs font-semibold rounded-full ${
                      m.trang_thai==="active"
                        ?"bg-green-100 text-green-800"
                        :"bg-red-100 text-red-800"
                    }`}>{m.trang_thai}</span>
                  </td>
                  <td className="px-4 py-2 text-center flex items-center justify-center">
                    <div onClick={()=>openEdit(m)}><UpdateButton/></div>
                    <div onClick={()=>del(m.id)}   ><DeleteButton/></div>
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

export default StaffManager;

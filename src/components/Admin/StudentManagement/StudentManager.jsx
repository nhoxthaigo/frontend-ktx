// D:\LuanVanTotNghiep\frontend-ktx\src\components\Admin\StudentManagement\StudentManager.jsx
import React, { useState, useEffect } from "react";
import { studentService } from "../../../services/student/student.service";
import AddButton    from "../../Button/AddButton";
import UpdateButton from "../../Button/UpdateButton";
import DeleteButton from "../../Button/DeleteButton";

const initialStudentState = {
  mssv:"", ten:"", dia_chi:"", phai:"", ngay_sinh:"",
  noi_sinh:"", dan_toc:"", ton_giao:"", khoa:"", sdt:"",
  cmnd:"", ngay_cap_cmnd:"", noi_cap_cmnd:"", ho_khau:"",
  dia_chi_lien_he:"", trang_thai:"", email:"", lop:"",
  dang_hien:true,
};

const StudentManager = () => {
  const [students,setStudents] = useState([]);
  const [filtered,setFiltered] = useState([]);
  const [searchName,setSearchName] = useState("");
  const [searchMSSV,setSearchMSSV] = useState("");
  const [searchPhone,setSearchPhone] = useState("");

  const [isAdding,setIsAdding] = useState(false);
  const [editing,setEditing]   = useState(null);
  const [cur,setCur]           = useState(initialStudentState);
  const [loading,setLoading]   = useState(false);

  /* fetch */
  const fetch = async()=>{setLoading(true);
    try{
      const r=await studentService.getAll();
      const data=r.data.students||r.data.sinh_vien||[];
      setStudents(data); setFiltered(data);
    }catch{alert("Không thể tải danh sách sinh viên!");}
    setLoading(false);
  };
  useEffect(()=>{fetch();},[]);

  /* filter */
  useEffect(()=>{
    let res=students;
    if(searchName) res=res.filter(s=>(s.ten||"").toLowerCase().includes(searchName.toLowerCase()));
    if(searchMSSV) res=res.filter(s=>(s.mssv||"").toLowerCase().includes(searchMSSV.toLowerCase()));
    if(searchPhone)res=res.filter(s=>(s.sdt||"").includes(searchPhone));
    setFiltered(res);
  },[searchName,searchMSSV,searchPhone,students]);

  /* handlers */
  const openAdd = ()=>{setIsAdding(true);setEditing(null);setCur(initialStudentState);};
  const openEdit = s=>{setEditing(s);setIsAdding(true);setCur(s);};
  const cancel   = ()=>{setIsAdding(false);setEditing(null);setCur(initialStudentState);};

  const change=e=>{
    const {name,value}=e.target;
    setCur(p=>({...p,[name]:value}));
  };

  const submit=async e=>{
    e.preventDefault();
    try{
      editing ? await studentService.update(editing.id,cur)
              : await studentService.create(cur);
      fetch(); cancel();
    }catch(err){
      alert(err?.response?.data?.error?.message||"Có lỗi xảy ra khi lưu sinh viên!");
    }
  };

  const del=async id=>{
    if(!window.confirm("Xóa sinh viên?"))return;
    try{await studentService.delete(id);fetch();}
    catch(err){alert(err?.response?.data?.error?.message||"Có lỗi xảy ra khi xóa sinh viên!");}
  };

  /* ui */
  return (
    <div>
      {/* top bar: filter + add */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 w-full justify-between">
          <div className="space-x-4">
            <input
              className="border border-gray-300 rounded-md px-3 py-2 mb-2 md:mb-0"
              placeholder="Tìm theo Tên"
              value={searchName} onChange={e=>setSearchName(e.target.value)}
            />
            <input
              className="border border-gray-300 rounded-md px-3 py-2 mb-2 md:mb-0"
              placeholder="Tìm theo MSSV"
              value={searchMSSV} onChange={e=>setSearchMSSV(e.target.value)}
            />
            <input
              className="border border-gray-300 rounded-md px-3 py-2 mb-2 md:mb-0"
              placeholder="Tìm theo SĐT"
              value={searchPhone} onChange={e=>setSearchPhone(e.target.value)}
            />
          </div>
          <div onClick={openAdd}><AddButton/></div>
        </div>
      </div>

      {/* form add / edit */}
      {(isAdding||editing)&&(
        <div className="mb-6 bg-gray-50 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">{editing?"Cập Nhật SV":"Thêm SV Mới"}</h3>
          <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.keys(initialStudentState).filter(k=>"dang_hien"!==k).map(key=>{
              if(key==="phai"){
                return(
                  <div key={key} className="flex flex-col">
                    <label className="text-sm font-medium mb-1 capitalize">{key}</label>
                    <select name={key} value={cur[key]} onChange={change}
                      className="border border-gray-300 rounded-md px-3 py-2" required>
                      <option value="">Giới tính</option>
                      {["Nam","Nu","Khac"].map(o=><option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                );
              }
              if(key==="trang_thai"){
                return(
                  <div key={key} className="flex flex-col">
                    <label className="text-sm font-medium mb-1 capitalize">{key.replace(/_/g," ")}</label>
                    <select name={key} value={cur[key]} onChange={change}
                      className="border border-gray-300 rounded-md px-3 py-2" required>
                      <option value="">Trạng thái</option>
                      <option value="active_resident">Đang ở</option>
                      <option value="applicant">Chờ duyệt</option>
                      <option value="inactive">Chưa đăng ký</option>
                    </select>
                  </div>
                );
              }
              const type=(key==="ngay_sinh"||key==="ngay_cap_cmnd")?"date":(key==="sdt"||key==="cmnd")?"number":"text";
              return(
                <div key={key} className="flex flex-col">
                  <label className="text-sm font-medium mb-1 capitalize">{key.replace(/_/g," ")}</label>
                  <input name={key} type={type} value={cur[key]} onChange={change}
                    className="border border-gray-300 rounded-md px-3 py-2"
                    placeholder={key.replace(/_/g," ")} required/>
                </div>
              );
            })}
            <div className="md:col-span-2 lg:col-span-3 flex justify-end space-x-2 mt-4">
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
          <div className="text-center py-4 text-gray-500">Không có sinh viên.</div>
        ):(
          <table className="min-w-full table-auto">
            <thead><tr className="bg-gray-50">
              {["MSSV","Tên","Giới Tính","Ngày Sinh","SĐT","Khoa","Trạng Thái","Thao tác"].map(h=>(
                <th key={h} className={`px-4 py-2 ${h==="Thao tác"?"text-center":"text-left"}`}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.map(s=>(
                <tr key={s.id} className="border-t">
                  <td className="px-4 py-2">{s.mssv}</td>
                  <td className="px-4 py-2">{s.ten}</td>
                  <td className="px-4 py-2">{s.phai}</td>
                  <td className="px-4 py-2">{s.ngay_sinh}</td>
                  <td className="px-4 py-2">{s.sdt}</td>
                  <td className="px-4 py-2">{s.khoa}</td>
                  <td className="px-4 py-2">{s.trang_thai}</td>
                  <td className="px-4 py-2 text-center flex items-center justify-center">
                    <div onClick={()=>openEdit(s)}><UpdateButton/></div>
                    <div onClick={()=>del(s.id)}><DeleteButton/></div>
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

export default StudentManager;

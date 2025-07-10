// D:\LuanVanTotNghiep\frontend-ktx\src\components\Admin\NewsManagement\NewsManager.jsx
import React, { useEffect, useState } from "react";
import { newsService, topicService } from "../../../services/topic/topic.services";
import AddButton    from "../../Button/AddButton";
import UpdateButton from "../../Button/UpdateButton";
import DeleteButton from "../../Button/DeleteButton";

const initialNewsState = {
  tieu_de:"", mo_ta:"", noi_dung:"", hinh_nen:"", id_chu_de:""
};

const NewsManager = () => {
  const [news, setNews] = useState([]);
  const [topics, setTopics] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [searchTitle, setSearchTitle]   = useState("");
  const [searchTopic, setSearchTopic]   = useState("");
  const [editing,   setEditing]   = useState(null);
  const [isAdding,  setIsAdding]  = useState(false);
  const [currentNews, setCurrentNews] = useState(initialNewsState);
  const [loading, setLoading]    = useState(false);
  const [msg, setMsg]            = useState({type:"",text:""});

  const fetchNews = async () => {
    setLoading(true);
    try { const res = await newsService.getAll(); const data = res.data?.news||[]; setNews(data); setFilteredNews(data);}
    catch(err){ setMsg({type:"error",text:"Lỗi tải bản tin"}); }
    setLoading(false);
  };
  const fetchTopics=async()=>{
    try{ const res=await topicService.getAll(); setTopics(res.data?.topics||[]);}catch{}
  };
  useEffect(()=>{fetchNews(); fetchTopics();},[]);

  /* --- filter --- */
  useEffect(()=>{
    let res=news;
    if (searchTitle) res=res.filter(n=> (n.tieu_de||"").toLowerCase().includes(searchTitle.toLowerCase()));
    if (searchTopic) res=res.filter(n=> String(n.id_chu_de)===searchTopic);
    setFilteredNews(res);
  },[searchTitle,searchTopic,news]);

  /* --- handlers --- */
  const openAddForm=()=>{setIsAdding(true); setEditing(null); setCurrentNews(initialNewsState); setMsg({});};
  const openEditForm=(n)=>{setEditing(n); setIsAdding(true); setCurrentNews({...n}); setMsg({});};
  const cancelForm=()=>{setIsAdding(false); setEditing(null); setCurrentNews(initialNewsState);};

  const handleInput=(e)=>{const{ name,value }=e.target; setCurrentNews(p=>({...p,[name]:value}));};

  const handleSubmit=async(e)=>{
    e.preventDefault(); setLoading(true);
    try{
      if(editing) await newsService.update(editing.id,currentNews);
      else        await newsService.create(currentNews);
      fetchNews(); cancelForm();
      setMsg({type:"success",text:editing?"Đã cập nhật!":"Đã thêm!"});
    }catch(err){setMsg({type:"error",text:"Lỗi lưu!"});}
    setLoading(false);
  };

  const handleDelete=async(id)=>{
    if(!window.confirm("Xóa bản tin?"))return;
    setLoading(true);
    try{await newsService.delete(id); fetchNews();}
    catch{setMsg({type:"error",text:"Lỗi xóa!"});}
    setLoading(false);
  };

  const getTopicName=(id)=> topics.find(t=>t.id===id)?.ten_chu_de||"";

  return(
    <div>
      {msg.text && (
        <div className={`mb-4 p-3 rounded-md text-center font-medium ${
          msg.type==="success"?"bg-green-100 text-green-700":"bg-red-100 text-red-700"}`}>
          {msg.text}
          <button className="float-right font-bold" onClick={()=>setMsg({})}>&times;</button>
        </div>
      )}
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 w-full justify-between">
          <div className="md:space-x-4 space-y-2 mb-4 md:mb-0">
            <select
              className="p-3 border border-gray-300 rounded-md w-full md:w-[300px] focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={searchTopic}
              onChange={(e)=>setSearchTopic(e.target.value)}
            >
              <option value="">Tất cả chủ đề</option>
              {topics.map(t=> <option key={t.id} value={t.id}>{t.ten_chu_de}</option>)}
            </select>
            <input
              className="p-3 border border-gray-300 rounded-md w-full md:w-[300px] focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Lọc theo Tiêu Đề"
              value={searchTitle}
              onChange={(e)=>setSearchTitle(e.target.value)}
            />
          </div>
          <div onClick={openAddForm}><AddButton/></div>
        </div>
      </div>

      {/* 2. Form Add / Edit */}
      {(isAdding||editing) && (
        <div className="mb-6 bg-gray-50 p-6 rounded-lg shadow w-[80%] mx-auto">
          <h3 className="text-2xl font-semibold mb-4 text-center">{editing?"Cập Nhật Bản Tin":"Thêm Bản Tin Mới"}</h3>
          <form onSubmit={handleSubmit} className="w-[60%] mx-auto grid grid-cols-1 gap-4">
            <input  name="tieu_de"  value={currentNews.tieu_de}  onChange={handleInput}
              className="border border-gray-300 rounded-md px-3 py-2" placeholder="Tiêu Đề" required/>
            <input  name="mo_ta"    value={currentNews.mo_ta}    onChange={handleInput}
              className="border border-gray-300 rounded-md px-3 py-2" placeholder="Mô Tả"/>
            <textarea name="noi_dung"value={currentNews.noi_dung}onChange={handleInput} rows="4"
              className="border border-gray-300 rounded-md px-3 py-2" placeholder="Nội Dung" required/>
            <input  name="hinh_nen" value={currentNews.hinh_nen} onChange={handleInput}
              className="border border-gray-300 rounded-md px-3 py-2" placeholder="URL Ảnh (Hình nền)"/>
            <select name="id_chu_de" value={currentNews.id_chu_de} onChange={handleInput}
              className="border border-gray-300 rounded-md px-3 py-2" required>
              <option value="">-- Chọn Chủ Đề --</option>
              {topics.map(t=> <option key={t.id} value={t.id}>{t.ten_chu_de}</option>)}
            </select>
            <div className="flex justify-end space-x-2">
              <button type="button" onClick={cancelForm}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">Hủy</button>
              <button type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                disabled={loading}>{editing?"Cập Nhật":"Thêm Mới"}</button>
            </div>
          </form>
        </div>
      )}

      {/* 3. Bảng */}
      <div className="overflow-x-auto">
        {loading?(
          <div className="text-center py-4">Đang tải...</div>
        ):filteredNews.length===0?(
          <div className="text-center py-4 text-gray-500">Không có bản tin.</div>
        ):(
          <table className="min-w-full table-auto">
            <thead><tr className="bg-gray-200 shadow-sm">
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Ảnh</th>
              <th className="px-4 py-2 text-left">Tiêu Đề</th>
              <th className="px-4 py-2 text-left">Mô Tả</th>
              <th className="px-4 py-2 text-left">Chủ Đề</th>
              <th className="px-4 py-2 text-center">Thao Tác</th>
            </tr></thead>
            <tbody>
              {filteredNews.map(n=>(
                <tr key={n.id} className="border-t">
                  <td className="px-4 py-2">{n.id}</td>
                  <td className="px-4 py-2">
                    {n.hinh_nen ? <img src={n.hinh_nen} alt="" className="w-16 h-10 object-cover rounded"/> : "—"}
                  </td>
                  <td className="px-4 py-2">{n.tieu_de}</td>
                  <td className="px-4 py-2 max-w-xs truncate">{n.mo_ta}</td>
                  <td className="px-4 py-2">{getTopicName(n.id_chu_de)}</td>
                  <td className="px-4 py-2 text-center flex items-center justify-center">
                    <div onClick={()=>openEditForm(n)}><UpdateButton/></div>
                    <div onClick={()=>handleDelete(n.id)}><DeleteButton/></div>
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
export default NewsManager;

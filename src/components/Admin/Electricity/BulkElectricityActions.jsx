import React, { useState } from 'react';
import { electricityService } from '../../../services/electricity/electricity.service';
import { FaUpload, FaDownload, FaFileExcel } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const BulkElectricityActions = ({ onRefresh }) => {
  const [loading, setLoading] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkData, setBulkData] = useState('');

  const handleBulkCreate = async () => {
    if (!bulkData.trim()) {
      toast.error('Vui lòng nhập dữ liệu');
      return;
    }

    setLoading(true);
    try {
      // Parse CSV-like data
      const lines = bulkData.trim().split('\n');
      const bills = lines.map(line => {
        const [id_phong, tu_ngay, den_ngay, so_dien_cu, so_dien_moi, ghi_chu] = line.split(',');
        return {
          id_phong: parseInt(id_phong?.trim()),
          tu_ngay: tu_ngay?.trim(),
          den_ngay: den_ngay?.trim(),
          so_dien_cu: parseInt(so_dien_cu?.trim()),
          so_dien_moi: parseInt(so_dien_moi?.trim()),
          ghi_chu: ghi_chu?.trim() || ''
        };
      });

      const response = await electricityService.bulkCreateRoomBills({ bills });
      toast.success(`Tạo thành công ${response.data.created} hóa đơn`);
      
      if (response.data.errors.length > 0) {
        toast.error(`Có ${response.data.errors.length} lỗi xảy ra`);
      }

      setShowBulkModal(false);
      setBulkData('');
      onRefresh();
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Không thể tạo hóa đơn hàng loạt');
    }
    setLoading(false);
  };

  const downloadTemplate = () => {
    const template = `id_phong,tu_ngay,den_ngay,so_dien_cu,so_dien_moi,ghi_chu
1,2024-01-01,2024-01-31,100,150,Hóa đơn tháng 1
2,2024-01-01,2024-01-31,200,250,Hóa đơn tháng 1`;

    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'bulk_electricity_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => setShowBulkModal(true)}
          className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md flex items-center space-x-2"
        >
          <FaUpload className="w-4 h-4" />
          <span>Tạo hàng loạt</span>
        </button>
        
        <button
          onClick={downloadTemplate}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center space-x-2"
        >
          <FaDownload className="w-4 h-4" />
          <span>Tải template</span>
        </button>
      </div>

      {/* Bulk Create Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Tạo Hóa đơn Hàng loạt</h3>
            
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Dữ liệu CSV (id_phong,tu_ngay,den_ngay,so_dien_cu,so_dien_moi,ghi_chu)
                </label>
                <button
                  onClick={downloadTemplate}
                  className="text-blue-600 hover:text-blue-800 text-sm flex items-center space-x-1"
                >
                  <FaFileExcel className="w-4 h-4" />
                  <span>Tải template</span>
                </button>
              </div>
              
              <textarea
                value={bulkData}
                onChange={(e) => setBulkData(e.target.value)}
                className="w-full h-64 border border-gray-300 rounded-md px-3 py-2 font-mono text-sm"
                placeholder="1,2024-01-01,2024-01-31,100,150,Hóa đơn tháng 1
2,2024-01-01,2024-01-31,200,250,Hóa đơn tháng 1"
              />
              
              <p className="text-sm text-gray-500 mt-2">
                Mỗi dòng đại diện cho một hóa đơn. Các trường cách nhau bằng dấu phẩy.
              </p>
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => {
                  setShowBulkModal(false);
                  setBulkData('');
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleBulkCreate}
                disabled={loading || !bulkData.trim()}
                className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:opacity-50"
              >
                {loading ? 'Đang xử lý...' : 'Tạo hóa đơn'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkElectricityActions;

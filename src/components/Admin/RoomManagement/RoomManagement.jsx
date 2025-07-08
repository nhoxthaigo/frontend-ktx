//D:\LuanVanTotNghiep\frontend-ktx\src\components\Admin\RoomManagement\RoomManagement.jsx
import React, { useState } from 'react';
import RoomManager from './RoomManager';
import RoomTypeManager from './RoomTypeManager';
import BedManager from './BedManager';
const RoomManagement = () => {
  const [activeTab, setActiveTab] = useState('rooms');
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">QUẢN LÝ PHÒNG</h2>
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('roomTypes')}
            className={`py-2 px-1 border-b-2 font-medium text-lg ${
              activeTab === 'roomTypes'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent transition transform duration-200 text-gray-500 hover:text-orange-700 hover:border-orange-200'
            }`}
          >
            Loại Phòng
          </button>
          <button
            onClick={() => setActiveTab('rooms')}
            className={`py-2 px-1 border-b-2 font-medium text-lg ${
              activeTab === 'rooms'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent transition transform duration-200 text-gray-500 hover:text-orange-700 hover:border-orange-200'
            }`}
          >
            Phòng
          </button>
          <button
            onClick={() => setActiveTab('beds')}
            className={`py-2 px-1 border-b-2 font-medium text-lg ${
              activeTab === 'beds'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent transition transform duration-200 text-gray-500 hover:text-orange-700 hover:border-orange-200'
            }`}
          >
            Giường
          </button>
        </nav>
      </div>
      <div>
        {activeTab === 'rooms' && <RoomManager />}
        {activeTab === 'roomTypes' && <RoomTypeManager />}
        {activeTab === 'beds' && <BedManager />}
      </div>
    </div>
  );
};

export default RoomManagement;
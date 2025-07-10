import React, { useState } from 'react';
import StaffManager from './StaffManager';
const StaffManagement = () => {
  const [activeTab, setActiveTab] = useState('staff');
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">QUẢN LÝ NHÂN VIÊN</h2>
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('staff')}
            className={`py-2 px-1 border-b-2 font-medium text-lg ${activeTab === 'staff'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent transition transform duration-200 text-gray-500 hover:text-orange-700 hover:border-orange-200'
              }`}
          >
            Nhân Viên
          </button>
        </nav>
      </div>
      <div>
        {activeTab === 'staff' && <StaffManager />}
      </div>
    </div>
  );
}

export default StaffManagement
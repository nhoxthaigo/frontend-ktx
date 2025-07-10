import React, { useState } from 'react';
import RoomAllocation from './RoomAllocation';
import StudentManager from './StudentManager';
const StudentManagement = () => {
    const [activeTab, setActiveTab] = useState('students');
    return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">QUẢN LÝ SINH VIÊN</h2>
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('students')}
            className={`py-2 px-1 border-b-2 font-medium text-lg ${
              activeTab === 'students'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent transition transform duration-200 text-gray-500 hover:text-orange-700 hover:border-orange-200'
            }`}
          >
            Sinh Viên
          </button>
          <button
            onClick={() => setActiveTab('roomallocation')}
            className={`py-2 px-1 border-b-2 font-medium text-lg ${
              activeTab === 'roomallocation'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent transition transform duration-200 text-gray-500 hover:text-orange-700 hover:border-orange-200'
            }`}
          >
            Phân Bổ Phòng
          </button>
        </nav>
      </div>
      <div>
        {activeTab === 'students' && <StudentManager />}
        {activeTab === 'roomallocation' && <RoomAllocation />}
      </div>
    </div>
  );
}

export default StudentManagement
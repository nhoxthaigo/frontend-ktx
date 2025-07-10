import React,{ useState } from 'react'
import ElectricRate from './ElectricRateManager'
import ElectricRoomInvoices from './ElectricRoomInvoices'
import ElectricStudentInvoices from './ElectricStudentInvoices'
const ElectricManagement = () => {
    const [activeTab, setActiveTab] = useState('electricrates');
    return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">QUẢN LÝ ĐIỆN</h2>
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('electricrates')}
            className={`py-2 px-1 border-b-2 font-medium text-lg ${
              activeTab === 'electricrates'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent transition transform duration-200 text-gray-500 hover:text-orange-700 hover:border-orange-200'
            }`}
          >
            Đơn Giá Điện
          </button>
          <button
            onClick={() => setActiveTab('electricroominvoices')}
            className={`py-2 px-1 border-b-2 font-medium text-lg ${
              activeTab === 'electricroominvoices'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent transition transform duration-200 text-gray-500 hover:text-orange-700 hover:border-orange-200'
            }`}
          >
            Hóa Đơn Điện Theo Phòng
          </button>
          <button
            onClick={() => setActiveTab('electricstudentinvoices')}
            className={`py-2 px-1 border-b-2 font-medium text-lg ${
              activeTab === 'electricstudentinvoices'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent transition transform duration-200 text-gray-500 hover:text-orange-700 hover:border-orange-200'
            }`}
          >
            Hóa Đơn Điện Sinh Viên
          </button>
        </nav>
      </div>
      <div>
        {activeTab === 'electricrates' && <ElectricRate />}
        {activeTab === 'electricroominvoices' && <ElectricRoomInvoices />}
        {activeTab === 'electricstudentinvoices' && <ElectricStudentInvoices />}
      </div>
    </div>
  );
}

export default ElectricManagement
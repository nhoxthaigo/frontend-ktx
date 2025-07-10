import React, {useState} from 'react'
import StudentRequestManager from './StudentRequestManager'
const StudentRequestManagement = () => {
    const [activeTab, setActiveTab] = useState('r');
    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">QUẢN LÝ YÊU CẦU ĐĂNG KÝ SINH VIÊN</h2>
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('r')}
                        className={`py-2 px-1 border-b-2 font-medium text-lg ${activeTab === 'r'
                            ? 'border-orange-500 text-orange-600'
                            : 'border-transparent transition transform duration-200 text-gray-500 hover:text-orange-700 hover:border-orange-200'
                            }`}
                    >
                        Yêu Cầu Đăng Ký Ký Túc Xá
                    </button>
                </nav>
            </div>
            <div>
                {activeTab === 'r' && <StudentRequestManager />}
            </div>
        </div>
    );
}

export default StudentRequestManagement
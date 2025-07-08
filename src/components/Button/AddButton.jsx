import React from 'react'
import { FaPlus } from 'react-icons/fa';

const AddButton = () => {
    return (
        <button
            className="ml-auto bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center space-x-2"
        >
            <FaPlus className="w-4 h-4" />
            <span>Thêm</span>
        </button>
    )
}

export default AddButton
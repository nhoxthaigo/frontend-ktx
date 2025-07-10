import React from 'react'
import { FaPlus } from 'react-icons/fa';

const AddButton = () => {
    return (
        <button
            className="ml-auto bg-orange-500 hover:bg-orange-700 text-white px-8 py-3 rounded-md flex items-center space-x-2"
        >
            <FaPlus className="w-4 h-4" />
            <span>Thêm</span>
        </button>
    )
}

export default AddButton
import React from 'react'
import { FaTrash } from 'react-icons/fa';

const DeleteButton = () => {
    return (
        <button
            className="text-red-600 hover:text-red-800"
        >
            <FaTrash />
        </button>
    )
}

export default DeleteButton
import React from 'react'
import { v4 as uuid } from 'uuid'

const Switch = ({ checked, onChange, label }) => {
    const id = uuid();
    return (
        <label htmlFor={id} className="flex items-center cursor-pointer">
            <div className="relative">
                <input type="checkbox" id={id} className="switch sr-only" checked={checked} onChange={onChange} />
                <div className="block bg-gray-500 w-10 h-5 rounded-full"></div>
                <div className="dot absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition"></div>
            </div>
            <div className="ml-1 text-sky-500 font-medium">{label}</div>
        </label>
    )
}

export default Switch;
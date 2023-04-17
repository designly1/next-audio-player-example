import React from "react"
import { ClockLoader } from 'react-spinners'
import { FaMusic } from 'react-icons/fa'

const Loading = ({ loaded, title }) => (
    <div className="flex gap-2 [&>*]:my-auto">
        {loaded ? <FaMusic size={20} color="magenta" /> : <ClockLoader size={20} color="white" />}
        <div>{loaded ? title : 'Loading...'}</div>
    </div>
)

export default Loading;
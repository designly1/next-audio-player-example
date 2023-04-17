import React from "react";
import { parseTime } from '@/lib/helpers'

const TimeItem = ({ time }) => {
    const hms = parseTime(time).join(':');
    return (
        <span>{hms}</span>
    )
}

export default TimeItem;
import React from 'react'
interface HeaderInfoProps{
    time: number;
    clickTimes: number;
}
const HeaderInfo = ({clickTimes,time}:HeaderInfoProps) => {
  return (
    <div className="flex justify-between items-center w-full">
          <h2 className="text-lg font-bold">
            تعداد حدس: <span>{clickTimes}</span>
          </h2>
          <h2 className="text-lg font-bold">
            زمان:{" "}
            <span>
              {Math.floor(time / 60)}:{Math.floor(time % 60)}
            </span>
          </h2>
        </div>
  )
}

export default HeaderInfo
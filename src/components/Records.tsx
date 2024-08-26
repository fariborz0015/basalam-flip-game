import useRecordStore from "@/hooks/useRecordStore";
import React, { useEffect } from "react";

const Records = () => {
  const { records, loadRecords } = useRecordStore();
  useEffect(() => {
    loadRecords();
  }, [loadRecords]);
  return (
    <div className="w-full ">
      <h2 className="bg-slate-200 p-4 rounded-t-md font-extrabold">
        رکورد های شما{" "}
      </h2>

      <div className="w-full" dir="rtl">
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500  ">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
              <tr>
                <th scope="col" className="px-6 py-3">
                  تاریخ بازی
                </th>
                <th scope="col" className="px-6 py-3">
                  تعداد حرکت
                </th>
                <th scope="col" className="px-6 py-3">
                  زمان صرف شده
                </th>
                <th scope="col" className="px-6 py-3">
                  امتیاز
                </th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr className="bg-white border-b " key={record.date}>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap  "
                  >
                    {record.date}
                  </th>
                  <td className="px-6 py-4">{record.movesLeft}</td>
                  <td className="px-6 py-4">
                    {record.timeSpent} <span>ثانیه</span>
                  </td>
                  <td className="px-6 py-4">{record.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Records;

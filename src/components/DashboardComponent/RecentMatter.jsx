import React from 'react';
import matterIcon from '@/assets/Icons/matter.png';

const RecentMatters = () => {
  return (
    <div className="w-full md:w-[48%] h-[400px] border border-[#7393B3] rounded-[8px] flex flex-col p-3">
        <h2 className='text-base font-semibold flex justify-center'>My Recent Matter</h2>
        <div className="h-full flex flex-col justify-center items-center">
            <img src={matterIcon} alt="" width={150} />
            <p className="text-gray-500 text-sm mt-2">You do not have any recent Matter.</p>
        </div>
    </div>
  );
};

export default RecentMatters;
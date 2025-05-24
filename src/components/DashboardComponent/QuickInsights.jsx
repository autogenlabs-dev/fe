import React, { useEffect, useState } from "react";
import Loader from "../loader";
import { Radio } from 'lucide-react';
import LogoImage from "../Layout/LogoImage";
// import logo from "@/assets/Logo_png.png";
// import { GiExpense } from "react-icons/gi";
// import laboutBudgetICon from "../../assets/labourBudget.png"
// import totalBudgetICon from "../../assets/totalBudget.png"

const QuickInsights = ({
  projects,
  liveProjects,
  loading,
  budget,
  expenseBudget,
  labourBudget,
}) => {
  let InsightsArr = [
    "Live Projects",
    "Total Budget",
    "Total Labour Budget",
    "Total Expense Budget",
  ];

  return (
    <div className=" ">
      {/* <h3 className="border-b p-2 px-6 flex justify-between items-end flex-wrap font-bold text-[#002147]">
        Quick Insight
      </h3> */}
      <div className="border-b p-2 px-6 flex justify-between items-end flex-wrap font-bold text-[#002147]">
        {/* <img src={logo} className="w-[40px] h-[40px] object-contain bg-main rounded-full" /> */}
        <LogoImage />
      </div>
      {liveProjects && budget && expenseBudget && labourBudget ? (
        <div className="Insights flex justify-center 2xl:gap-10 flex-wrap gap-2 p-2 md:p-6">
          <div className="bg-[#002147] text-white shadow-lg hover:scale-105 hover:translate-y-[-5%] transition-all flex text-black py-2  rounded-lg min-h-[90px]  min-w-full md:md:min-w-[280px]">
            <div className="flex justify-center items-center w-1/3 ">
            <Radio />
            </div>
            <div className="flex justify-center  items-start w-2/3 flex-col gap-2">

            <h4>{InsightsArr[0]}</h4>
            <p>{liveProjects ? liveProjects : "0"}</p>
            </div>
          </div>
          <div className="bg-[#002147] text-white shadow-lg hover:scale-105 hover:translate-y-[-5%] transition-all flex text-black py-2  rounded-lg min-h-[90px]  min-w-full md:md:min-w-[280px]">
          <div className="flex justify-center items-center w-1/3 ">
          {/* <img src={totalBudgetICon} alt="totalBudgetICon" className="h-[34px] w-[48px]"/> */}
          <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24" width="24" height="24" stroke="white" fill="white">
            <path d="m24,19c0,1.654-1.346,3-3,3v1c0,.553-.448,1-1,1s-1-.447-1-1v-1h-.268c-1.067,0-2.063-.574-2.598-1.499-.276-.479-.113-1.09.365-1.366.477-.278,1.09-.113,1.366.364.179.31.511.501.867.501h2.268c.551,0,1-.448,1-1,0-.379-.271-.698-.644-.761l-3.041-.506c-1.342-.224-2.315-1.374-2.315-2.733,0-1.654,1.346-3,3-3v-1c0-.553.448-1,1-1s1,.447,1,1v1h.268c1.067,0,2.063.574,2.598,1.499.276.479.113,1.09-.365,1.366-.477.278-1.089.114-1.366-.364-.179-.31-.511-.501-.867-.501h-2.268c-.551,0-1,.448-1,1,0,.379.271.698.644.761l3.041.506c1.342.224,2.315,1.374,2.315,2.733ZM5,4h1c.552,0,1-.447,1-1s.449-1,1-1h2c.551,0,1,.448,1,1s.448,1,1,1h1c1.654,0,3,1.346,3,3v2c0,.553.448,1,1,1s1-.447,1-1v-2c0-2.757-2.243-5-5-5h-.171c-.413-1.164-1.525-2-2.829-2h-2c-1.304,0-2.416.836-2.829,2h-.171C2.243,2,0,4.243,0,7v12c0,2.757,2.243,5,5,5h8c.421,0,.841-.053,1.249-.157.535-.138.857-.683.72-1.217-.137-.535-.68-.859-1.217-.721-.245.062-.498.095-.751.095H5c-1.654,0-3-1.346-3-3V7c0-1.654,1.346-3,3-3Z" stroke="white"/>
            <path d="m9.727,6.793c.391.391.391,1.023,0,1.414l-2.179,2.179c-.409.409-.946.613-1.483.613s-1.074-.204-1.483-.613l-1.288-1.289c-.391-.391-.391-1.024,0-1.414.391-.391,1.023-.391,1.414,0l1.288,1.289c.033.033.105.033.139,0l2.179-2.179c.391-.391,1.023-.391,1.414,0h-.001Z" stroke="white"/>
            <path d="m9.727,12.793c.391.391.391,1.023,0,1.414l-2.179,2.179c-.409.409-.946.613-1.483.613s-1.074-.204-1.483-.613l-1.288-1.289c-.391-.391-.391-1.024,0-1.414.391-.391,1.023-.391,1.414,0l1.288,1.289c.033.033.105.033.139,0l2.179-2.179c.391-.391,1.023-.391,1.414,0h-.001Z" stroke="white"/>
          </svg>
          </div>
            <div className="flex justify-center  items-start w-2/3 flex-col gap-2">

            <h4>{InsightsArr[1]}</h4>
            <p>£ {budget ? budget : "N/A"}</p>
            </div>
          </div>
          <div className="bg-[#002147] text-white shadow-lg hover:scale-105 hover:translate-y-[-5%] transition-all flex text-black py-2  rounded-lg min-h-[90px]  min-w-full md:md:min-w-[280px]">
          <div className="flex justify-center items-center w-1/3 ">
            {/* <img src={laboutBudgetICon} alt="laboutbudgetIcon" className="h-[24px] w-[24px]"/> */}
            <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24" width="24" height="24">
              <path stroke="white" fill="white" d="m10,10c0,.378.271.698.644.76l3.041.507c1.342.223,2.315,1.373,2.315,2.733,0,1.654-1.346,3-3,3v2h-2v-2c-1.654,0-3-1.346-3-3h2c0,.551.448,1,1,1h2c.552,0,1-.449,1-1,0-.378-.271-.698-.644-.76l-3.041-.507c-1.342-.223-2.315-1.373-2.315-2.733,0-1.654,1.346-3,3-3v-2h2v2c1.654,0,3,1.346,3,3h-2c0-.551-.448-1-1-1h-2c-.552,0-1,.449-1,1Zm6.307-3.721l1.115-1.115c-.269-.495-.422-1.062-.422-1.664,0-1.93,1.57-3.5,3.5-3.5s3.5,1.57,3.5,3.5-1.57,3.5-3.5,3.5c-.602,0-1.169-.153-1.664-.422l-1.317,1.317c-.291-.621-.706-1.165-1.212-1.616Zm2.693-2.779c0,.827.673,1.5,1.5,1.5s1.5-.673,1.5-1.5-.673-1.5-1.5-1.5-1.5.673-1.5,1.5Zm-12.422,1.664l1.115,1.115c-.506.451-.921.995-1.212,1.616l-1.317-1.317c-.495.269-1.062.422-1.664.422-1.93,0-3.5-1.57-3.5-3.5S1.57,0,3.5,0s3.5,1.57,3.5,3.5c0,.602-.153,1.169-.422,1.664Zm-3.078-.164c.827,0,1.5-.673,1.5-1.5s-.673-1.5-1.5-1.5-1.5.673-1.5,1.5.673,1.5,1.5,1.5Zm20.5,15.5c0,1.93-1.57,3.5-3.5,3.5s-3.5-1.57-3.5-3.5c0-.602.153-1.169.422-1.664l-1.115-1.115c.506-.451.921-.995,1.212-1.616l1.317,1.317c.495-.269,1.062-.422,1.664-.422,1.93,0,3.5,1.57,3.5,3.5Zm-2,0c0-.827-.673-1.5-1.5-1.5s-1.5.673-1.5,1.5.673,1.5,1.5,1.5,1.5-.673,1.5-1.5Zm-14.307-2.779l-1.115,1.115c.269.495.422,1.062.422,1.664,0,1.93-1.57,3.5-3.5,3.5s-3.5-1.57-3.5-3.5,1.57-3.5,3.5-3.5c.602,0,1.169.153,1.664.422l1.317-1.317c.291.621.706,1.165,1.212,1.616Zm-2.693,2.779c0-.827-.673-1.5-1.5-1.5s-1.5.673-1.5,1.5.673,1.5,1.5,1.5,1.5-.673,1.5-1.5Z"/>
            </svg>
          </div>
            <div className="flex justify-center  items-start w-2/3 flex-col gap-2">
              <h4>{InsightsArr[2]}</h4>
              <p>£ {labourBudget ? labourBudget : "N/A"}</p>
            </div>
          </div>
          <div className="bg-[#002147] text-white shadow-lg hover:scale-105 hover:translate-y-[-5%] transition-all flex text-black py-2  rounded-lg min-h-[90px]  min-w-full md:md:min-w-[280px]">
          <div className="flex justify-center items-center w-1/3 ">
          {/* <GiExpense className="h-[24px] w-[24px]"/> */}
          <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24" width="24" height="24">
            <path stroke="white" fill="white" d="m14,17h6v2h-6v-2Zm0-4v2h2v-2h-2Zm6-9h-12v3.159c.716.113,1.387.284,2,.511v-1.67h8v2h-7.233c1.045.508,1.878,1.189,2.437,2h6.796v-6Zm1-4H7c-1.657,0-3,1.343-3,3v4.159c.634-.1,1.3-.159,2-.159V3c0-.552.448-1,1-1h14c.552,0,1,.448,1,1v19h-8.275c-.278.752-.76,1.428-1.417,2h11.692V3c0-1.657-1.343-3-3-3Zm-1,13h-2v2h2v-2Zm-8-.5v8c0,1.995-2.579,3.5-6,3.5s-6-1.505-6-3.5v-8c0-1.995,2.579-3.5,6-3.5s6,1.505,6,3.5Zm-2,8v-1.348c-1.046.533-2.435.848-4,.848s-2.954-.315-4-.848v1.348c0,.529,1.519,1.5,4,1.5s4-.971,4-1.5Zm0-4v-1.348c-1.046.533-2.435.848-4,.848s-2.954-.315-4-.848v1.348c0,.529,1.519,1.5,4,1.5s4-.971,4-1.5Zm0-4c0-.529-1.519-1.5-4-1.5s-4,.971-4,1.5,1.519,1.5,4,1.5,4-.971,4-1.5Z"/>
          </svg>
          </div>
            <div className="flex justify-center  items-start w-2/3 flex-col gap-2">

            <h4>{InsightsArr[3]}</h4>
            <p>£ {expenseBudget ? expenseBudget : "N/A"}</p>
            </div>
          </div>
        </div>
      ) : loading ? (
        <div className="flex justify-center items-center h-[100px]">
          <Loader />
        </div>
      ): null}
    </div>
  );
};

export default QuickInsights;

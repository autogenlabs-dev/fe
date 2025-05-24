import React from "react";
import AppWrapper from "./AppWrapper";

const TableWrapper = ({ children, heading }) => {
  return (
    <>
     {/* <AppWrapper> */}
      <h1 className="text-center text-5xl my-6">{heading}</h1>
      <div className="w-[95%] m-auto overflow-auto h-full relative ">
        {children}
      </div>
      {/* </AppWrapper> */}
    </>
  );
};

export default TableWrapper;

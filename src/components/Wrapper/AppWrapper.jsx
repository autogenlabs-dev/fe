import Navbar from "@/Header/Navbar";
import Sidebar from "@/components/SideBar/Sidebar";
import React from "react";

const AppWrapper = ({ children, heading }) => {
  return (
    <div className="flex w-full h-full box-border overflow-auto mb-28">
      <Sidebar />
      <div className="w-full overflow-hidden">
        <Navbar />
        {children}
      </div>
    </div>
  );
};

export default AppWrapper;

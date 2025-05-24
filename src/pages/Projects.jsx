import React from "react";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "@/components/loader";
import { useSelector } from "react-redux";
import { projectSelector } from "@/redux/project/projectSlice";
import { ProjectTable } from "@/components/Tables/ProjectTable";
import WrapperComponent from "@/components/Wrapper/TableWrapper";

const Projects = () => {
  const navigate = useNavigate();

  const {
    projects,
    loading: projectLoading,
    error: userError,
  } = useSelector(projectSelector);
  return (
    <>
      {projectLoading && (
        <div className="absolute bg-white w-full h-full flex justify-center items-center z-50">
          <Loader />
        </div>
      )}
      <ProjectTable />
    </>
  );
};

export default Projects;

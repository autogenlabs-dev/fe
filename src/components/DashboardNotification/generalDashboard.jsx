import React from "react";
import { MessageSquareWarning } from "lucide-react";
import { Button } from "@/components/ui/button";
import Loader from "@/components/loader";
import { Link } from "react-router-dom";

const GeneralDashboard = ({ notifications, loading, handleRefresh }) => {
  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <div className="w-full ">
        <div className="overflow-auto max-h-[50vh]">
          {notifications && notifications.length > 0 ? (
            notifications.map((notification) => (
            <Link to={notification.link} key={notification.id}>
              <h1 className="flex text-lg pb-4">
                {notification.message}{" "}
                <MessageSquareWarning className="ml-6 cursor-pointer" />
              </h1>
            </Link>
            ))
          ) : (
            <h1 className="flex text-lg">
              No Notifications{" "}
              <MessageSquareWarning className="ml-4 cursor-pointer" />
            </h1>
          )}
        </div>
        <Button className="mt-2 flex " onClick={handleRefresh}>
          Refresh
        </Button>
      </div>
    </>
  );
};

export default GeneralDashboard;

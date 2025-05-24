import PropTypes from 'prop-types'
import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import './layout.css';

const Layout = ({ children=<></> }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleCloseSidebar = () => {
    if(isSidebarOpen){
        setIsSidebarOpen(false);
    }
  }

  return (
    <div className="layout">
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="content" onClick={handleCloseSidebar}>
        {children}
      </div>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;


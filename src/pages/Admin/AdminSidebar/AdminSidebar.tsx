import { useEffect, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  LogOut,
  ChevronLeft,
  ChevronRight,
  School2Icon,
  PanelsTopLeftIcon,
  ComputerIcon,
  DockIcon,
  Package,
  FileSliders,
} from 'lucide-react';
import { confirmAlert } from "../../../utils/confirmAlert"; // adjust path

import "./AdminSidebar.css";
import { useAuth } from '../../../hooks/useAuth';

interface SidebarProps {
  children?: ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation(); // to track current path
  const { user, logout } = useAuth();
  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: School2Icon, label: 'Schools', path: '/admin/school' },
    { icon: FileSliders, label: 'Plans', path: '/admin/plans' },
  ];

  useEffect(() => {
    // Function to handle resize and update collapsed state
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };

    // Initial check
    handleResize();

    // Add resize event listener
    window.addEventListener('resize', handleResize);

    // Cleanup on unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className='d-flex w-100'>


      <div className="d-flex adminHeader">
        {/* Sidebar */}
        <div className={`sidebar bg-white shadow ${isCollapsed ? 'collapsed' : ''}`}>

          {/* Header */}
          <div className="p-3 border-bottom sidebar-header">
            <div className="d-flex align-items-center justify-content-center">
              <img
                src={isCollapsed ? "/logo.png" : "/logo.png"} // 👈 change here
                alt="Logo"
                className="brand-logo-img"
              />
            </div>
          </div>

          {/* User Info */}
          {!isCollapsed && (

            <div className="text-center m-2 border-bottom pb-2  ">
              <h6 className="mb-0">{user?.name} <span style={{ color: "#a0a0a0ff" }}>({user?.role})</span></h6>
              <small className="text-muted d-block">{user?.email}</small>
            </div>
          )}

          {/* Menu Items */}
          <div className="flex-grow-1 py-2 ">
            <nav>
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={index}
                    to={item.path}
                    className={`menu-item ${isActive ? 'active' : ''}`}
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}  // 👈 scroll to top

                  >
                    <Icon className="menu-icon" />
                    <span className="menu-text">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Bottom Items */}
          <div className="border-top p-2">
            <button
              onClick={async () => {
                const confirmed = await confirmAlert(
                  "Are you sure?",
                  "You will be logged out of the application.",
                  "Logout",
                  "Cancel"
                );
                if (confirmed) {
                  logout(); // from useAuth
                }
              }}
              className={`menu-item btn btn-link p-0 text-start w-100 d-flex ${isCollapsed ? "m-0" : ""}`}

            >
              <LogOut className="menu-icon" />
              <span className="menu-text">Logout</span>
            </button>
          </div>


          {/* Collapse/Expand Button */}
          <button onClick={toggleSidebar} className="arrow-btn">
            {isCollapsed ? (
              <ChevronRight style={{ width: '14px', height: '14px' }} />
            ) : (
              <ChevronLeft style={{ width: '14px', height: '14px' }} />
            )}
          </button>
        </div>
      </div>

      <div className={`w-100 content-area  ${isCollapsed ? 'page-content-collapsed' : ''}`} >
        <div className={`page-content`} >{children}</div>
      </div>

    </div>

  );
};

export default Sidebar;

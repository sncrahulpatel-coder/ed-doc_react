import React, { useEffect, useState, type ReactNode } from 'react';
import './SchoolSidebar.css';
import { confirmAlert } from '../../utils/confirmAlert';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLoader } from '../../context/LoaderContext';
import { toast } from 'react-toastify';
import api from '../../services/api';

const logoUrl = '/logo.png';
const bellIconUrl = '/Sidebar/notification.png';
const userIconUrl = '/Sidebar/logout.png';
const dashboardIconUrl = '/Sidebar/dashboardicon.png';
const schoolIconUrl = '/Sidebar/document.png';

interface SidebarProps {
  children?: ReactNode;
}

const SchoolSidebar: React.FC<SidebarProps> = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  // const [isDropdownOpen, setDropdownOpen] = useState(false);
  // const [selectedYear, setSelectedYear] = useState('2026/2027');
  const navigate = useNavigate();
  const location = useLocation();

  // const academicYears = ['2026/2027', '2025/2026', '2024/2025'];


 const [schoolData, setSchoolData] = useState<any>({school_name:'NA'});

  const { showLoader, hideLoader } = useLoader();
   const getData = async () => {
    try {
      showLoader();
      const res = await api.get('/dashboard');
      setSchoolData(res.data.data); // store response
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      hideLoader();
    }
  };




  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
      
    };
    window.addEventListener('resize', handleResize);
    getData();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

 

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  // const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);
  // const selectYear = (year: string) => {
  //   setSelectedYear(year);
  //   setDropdownOpen(false);
  // };

  const handleNavItemClick = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="Ed-container">
      {isSidebarOpen && isMobile && <div className="Ed-overlay" onClick={toggleSidebar}></div>}

      <aside className={`Ed-sidebar ${isSidebarOpen ? 'Ed-sidebar-visible' : ''}`}>
        <div className="Ed-sidebar-top">
          <div className='w-100' style={{ textAlign: 'center', alignItems: "center" }}>
            <img src={logoUrl} alt="ED-DOC Logo" className="Ed-logo-img" />
          </div>
          <div className="Ed-school-info">
            {schoolData.school_name}
          </div>
          <nav className="Ed-navigation">
            <ul>
              <li
                className={`Ed-nav-item  ${location.pathname.includes('/school/dashboard') ? 'active' : ''}`}
                onClick={handleNavItemClick}
              >
                <a onClick={() => navigate('/school/dashboard')}>
                  <img src={dashboardIconUrl} alt="Dashboard" className="Ed-nav-icon" />
                  Dashboard
                </a>
              </li>

              <li
                className={`Ed-nav-item ${location.pathname.includes('/school/schoolRecords') ? 'active' : ''}`}
                onClick={handleNavItemClick}
              >
                <a onClick={() => navigate('/school/schoolRecords')}>
                  <img src={schoolIconUrl} alt="School Records" className="Ed-nav-icon" />
                  School Records
                </a>
              </li>

              <li
                className={`Ed-nav-item ${location.pathname.includes('/school/studentRecords') ? 'active' : ''}`}
                onClick={handleNavItemClick}
              >
                <a onClick={() => navigate('/school/studentRecords')}>
                  <img src={schoolIconUrl} alt="Student Records" className="Ed-nav-icon" />
                  Student Records
                </a>
              </li>

              <li
                className={`Ed-nav-item ${location.pathname.includes('/school/TeacherRecords') ? 'active' : ''}`}
                onClick={handleNavItemClick}
              >
                <a onClick={() => navigate('/school/TeacherRecords')}>
                  <img src={schoolIconUrl} alt="Teacher Records" className="Ed-nav-icon" />
                  Teacher Records
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="Ed-sidebar-bottom">
          <div className="Ed-upgrade-card">
            <p>UPGRADE</p>
            <span>Go Pro for more features</span>
          </div>
        </div>
      </aside>

      <div className="Ed-main-panel">
        <header className="Ed-navbar">
          <div className="Ed-navbar-left">
            <button onClick={toggleSidebar} className="Ed-hamburger-btn">
              &#9776;
            </button>
            <div className="Ed-search-container">
              <input type="text" placeholder="Search..." className="Ed-search-input" />
            </div>
          </div>
          <div className="Ed-navbar-right">
            {/* <div className="Ed-year-dropdown">
              <button onClick={toggleDropdown} className="Ed-year-selector">
                Academic Year: {selectedYear} &#9662;
              </button>
              {isDropdownOpen && (
                <ul className="Ed-dropdown-menu">
                  {academicYears.map(year => (
                    <li key={year} onClick={() => selectYear(year)}>
                      {year}
                    </li>
                  ))}
                </ul>
              )}
            </div> */}

            <img src={bellIconUrl} alt="Notifications" className="Ed-navbar-icon" onClick={() => alert('Notifications clicked!')} />
            <img
              src={userIconUrl}
              alt="Profile"
              className="Ed-navbar-icon"
              onClick={async () => {
                const cnf = await confirmAlert('Logout', "Are you Sure.?");
                if (cnf) {
                  navigate('/logout');
                }
              }}
            />
          </div>
        </header>

        <main className="Ed-content-area">
          {children}
        </main>
      </div>
    </div>
  );
};

export default SchoolSidebar;

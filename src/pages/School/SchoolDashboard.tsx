import { useEffect, useState } from 'react';
import { Doughnut, Pie } from 'react-chartjs-2';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './SchoolDashboard.css';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { toast } from 'react-toastify';
import { useLoader } from '../../context/LoaderContext';
import api from '../../services/api';

Chart.register(ArcElement, Tooltip, Legend);

const SchoolDashboard = () => {
  const [date, setDate] = useState(new Date());
  const [schoolData, setSchoolData] = useState<any>({used_gb:0,total_gb:0});

  const { showLoader, hideLoader } = useLoader();

  const totalDocumentsData = {
    labels: ['School Doc', 'Student Doc'],
    datasets: [
      {
        data: [80, 20],
        backgroundColor: ['#007bff', '#ffc107'],
        borderWidth: 0,
      },
    ],
  };

  const storagePanelData = {
    labels: [ 'Used','Available'],
    datasets: [
      {
        data: [schoolData.used_gb, schoolData.total_gb- schoolData.used_gb],
        backgroundColor: ['#fa1e1eff', '#d8d8d89d'],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: { display: false },
    },
    cutout: '70%',
  };

  const quickLinks = [
    { name: 'Calendar', icon: '/Dashboard/Calendar.png' },
    { name: 'Exam Result', icon: '/Dashboard/ExamResult.png' },
    { name: 'Attendance', icon: '/Dashboard/Attendance.png' },
    { name: 'Fees', icon: '/Dashboard/Fees.png' },
    { name: 'Records', icon: '/Dashboard/Records.png' },
    { name: 'Reports', icon: '/Dashboard/Reports.png' },
  ];

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
    getData();
  }, []);

  if (!schoolData) {
    return <div className="ed-doc-dashboard">Loading...</div>;
  }

  return (
    <div className="ed-doc-dashboard">
      <header className="ed-doc-header">
        <div className="ed-doc-school-info">
          <img src={schoolData.logo} alt="School Logo" className="ed-doc-logo" />
          <h1 className="ed-doc-schoolname m-0 p-0">{schoolData.school_name}</h1>
        </div>
        <div className="ed-doc-establishment-info">
          <div className="ed-doc-info-card">
            <p className="ed-doc-info-card-title">Year of Establishment</p>
            <p className="ed-doc-info-card-value">{schoolData.year_of_establishment}</p>
          </div>
          <div className="ed-doc-info-card">
            <p className="ed-doc-info-card-title">Total Standard</p>
            <p className="ed-doc-info-card-value">{schoolData.total_standard}</p>
          </div>
        </div>
      </header>

      <main className="ed-doc-main-content">
        <div className="ed-doc-stats-grid">
          <div className="ed-doc-stat-card">
            <div>
              <h3 style={{ color: "#006fe6" }}>{schoolData.total_students}</h3>
              <p className="p-0 m-0">Total Students</p>
            </div>
            <div className="ed-doc-stat-image-container">
              <img src="/Dashboard/totalstudenticon.png" alt="Students" />
            </div>
          </div>

          <div className="ed-doc-stat-card">
            <div>
              <h3 style={{ color: "#f4bd27" }}>{schoolData.total_teachers}</h3>
              <p className="p-0 m-0">Total Teachers</p>
            </div>
            <div className="ed-doc-stat-image-container">
              <img src="/Dashboard/totalteachericon.png" alt="Teachers" />
            </div>
          </div>

          <div className="ed-doc-stat-card">
            <div>
              <h3 style={{ color: "#f55d0b" }}>{schoolData.total_subjects}</h3>
              <p className="p-0 m-0">Total Subjects</p>
            </div>
            <div className="ed-doc-stat-image-container">
              <img src="/Dashboard/totalsubject.png" alt="Subjects" />
            </div>
          </div>
        </div>

        <div className="ed-doc-widgets-grid">
          <div className="ed-doc-widget-card">
            <h2>Total Documents</h2>
            <div className="ed-doc-chart-container">
              <Doughnut data={totalDocumentsData} options={chartOptions} />
            </div>
            <div className="ed-doc-legend">
              <div><span className="ed-doc-legend-color" style={{ backgroundColor: '#007bff' }}></span> School Doc</div>
              <div><span className="ed-doc-legend-color" style={{ backgroundColor: '#ffc107' }}></span> Student Doc</div>
            </div>
          </div>

          <div className="ed-doc-widget-card">
            <h2>Schedules</h2>
            <Calendar
              onChange={(value) => {
                if (value instanceof Date) setDate(value);
              }}
              value={date}
            />
          </div>

          <div className="ed-doc-widget-card">
            <h2>Storage Panel</h2>
            <div className="ed-doc-chart-container">
              <Pie data={storagePanelData} options={{ plugins: { legend: { display: false } } }} />
            </div>
            <div className="ed-doc-storage-info">
              <p className="p-0 m-0">{schoolData.used_gb} GB of {schoolData.total_gb} GB</p>
              <div className="ed-doc-legend">
                <div><span className="ed-doc-legend-color" style={{ backgroundColor: '#969696ff' }}></span> Available</div>
                <div><span className="ed-doc-legend-color" style={{ backgroundColor: '#fa1e1eff' }}></span> Used</div>
              </div>
            </div>
            <button className="ed-doc-upgrade-btn">Upgrade Plan</button>
          </div>

          <div className="ed-doc-widget-card">
            <h2>Quick Links</h2>
            <div className="ed-doc-quick-links-grid">
              {quickLinks.map((link) => (
                <button key={link.name} className="ed-doc-quick-link-btn">
                  <img src={link.icon} alt={link.name} />
                  <span>{link.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SchoolDashboard;

import { useNavigate } from "react-router-dom";
import "./StudentDocument.css";

export default function StudentDocument() {
  const cards = [
    { title: "Admission Form", theme: "beige" },
    { title: "Annual Report", theme: "blue" },
    { title: "Migration Certificate", theme: "beige" },
    { title: "LC Document", theme: "blue" },
    { title: "Fees Receipt", theme: "beige" },
    { title: "Other Documents", theme: "blue" },
  ];
  const navigate = useNavigate();

  return (
    <div className="student-docs-container">
      <div className="student-docs-wrapper">
        <h1 className="docs-heading">Student Documents</h1>

        <div className="cards-grid">
          {cards.map((item, index) => (
            <div key={index} className={`document-card ${item.theme}`}>
              <div className={`decor-bg ${item.theme}`}></div>

              <div className="card-icon">📄</div>

              <h2 className="card-title">{item.title}</h2>

              <div className="button-group">
                <button className={`btn ${item.theme}`} onClick={()=>{
                    navigate('studentRecords')
                }}>View Documents</button>
                <button className={`btn ${item.theme}`}>Upload Documents</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

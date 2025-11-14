import "./SchoolRecord.css";

const folderButtons = [
  { label: "Administrative & Governance", className: "top-left" },
  { label: "Financial & Audit", className: "top-right" },
  { label: "Coming Soon", className: "middle-left disabled" },
  { label: "Academic & Operational", className: "middle-right" },
  { label: "Withdrawl", className: "bottom-left " },
  { label: "Legal & Compliance", className: "bottom-right" },
];

export default function SchoolRecord() {
  return (
    <div className="ed-docFoldertree">
      <div className="foldertree-center">
        <img
          src="/Others/foldertree.png"
          alt="Folder Center"   
          className="foldertree-img"
        />
        {folderButtons.map((btn, idx) => (
          <div key={idx} className={`foldertree-btn ${btn.className}`}>
            {btn.label}
          </div>
        ))}
      </div>
    </div>
  );
}

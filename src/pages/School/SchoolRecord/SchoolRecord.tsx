import { useNavigate } from "react-router-dom";
import "./SchoolRecord.css";

const folderButtons = [
  {
    label: "Administrative & Governance",
    className: "top-left",
    data: [{
      title: 'Administrative & Governance',
      SubTopics: [
        {
          title: 'School Managing Committee <br /> Meeting Minutes',
          type: 'SchoolManagingCommittee'
        },
        {
          title: 'Trust / Society <br /> Registration Records',
          type: 'TrustSocietyRegistration'
        },
        {
          title: 'Affiliation/Recognition Certificate<br />(CBSE/State Board)',
          type: 'AffiliationRecognitionCertificate'
        },
        {
          title: 'School Registration <br />Certificate',
          type: 'SchoolRegistrationCertificate'
        },
        {
          title: 'NOC from state <br /> Government',
          type: 'NOCFromStateGovernment'
        }
      ]
    }]
  },

  {
    label: "Financial & Audit",
    className: "top-right",
    data: [{
      title: 'Financial & Audit',
      SubTopics: [
        {
          title: 'Annual Audit Reports',
          type: 'AnnualAuditReports'
        },
        {
          title: 'Fee receipts & fee structure records',
          type: 'FeeReceiptsAndStructure'
        },
        {
          title: 'Budget documents',
          type: 'BudgetDocuments'
        },
        {
          title: 'Vouchers, bills, payment registers',
          type: 'VouchersBillsPaymentRegisters'
        },
        {
          title: 'Bank statements<br/> (as per financial regulation norms)',
          type: 'BankStatements'
        }
      ]
    }]
  },

  {
    label: "Academic & Operational",
    className: "bottom-left",
    data: [{
      title: 'Academic & Operational',
      SubTopics: [
        {
          title: 'School Academic Calendar',
          type: 'SchoolAcademicCalendar'
        },
        {
          title: 'Lesson plans & annual curriculum plans',
          type: 'LessonAndCurriculumPlans'
        },
        {
          title: 'Time table records',
          type: 'TimeTableRecords'
        },
        {
          title: 'Inspection reports by Education Department / Board',
          type: 'InspectionReports'
        },
        {
          title: 'School Improvement Plans (SIP)',
          type: 'SchoolImprovementPlans'
        }
      ]
    }]
  },

  {
    label: "Legal & Compliance",
    className: "middle-right",
    data: [{
      title: 'Legal & Compliance',
      SubTopics: [
        {
          title: 'Safety compliance certificates <br/>(Fire, Building Stability, Sanitation)',
          type: 'SafetyComplianceCertificates'
        },
        {
          title: 'Disaster management plans',
          type: 'DisasterManagementPlans'
        },
        {
          title: 'CCTV maintenance logs <br/> (duration varies but major certificates kept for long-term)',
          type: 'CCTVMaintenanceLogs'
        },
        {
          title: 'Health & sanitation compliance reports',
          type: 'HealthSanitationReports'
        },
        {
          title: 'Coming Soon',
          type: ''
        }
      ]
    }]
  },

  {
    label: "Coming Soon",
    className: "middle-left disabled"
  },

  {
    label: "Admission & Withdrawal",
    className: "bottom-right",
    data: [{
      title: 'Admission & Withdrawal',
      SubTopics: [
        {
          title: 'Admission registers <br/>(must be preserved for at least 10 years)',
          type: 'AdmissionRegisters'
        },
        {
          title: 'School Leaving Certificate (SLC) issue registers',
          type: 'SLCIssueRegisters'
        },
        {
          title: 'Transfer Certificate registers',
          type: 'TransferCertificateRegisters'
        },
        {
          title: 'Coming Soon',
          type: ''
        },
        {
          title: 'Coming Soon',
          type: ''
        }
      ]
    }]
  }
];


export default function SchoolRecord() {

  const navigate = useNavigate();

  return (
    <div className="ed-docFoldertree">
      <div className="foldertree-center">
        <img
          src="/Others/foldertree.png"
          alt="Folder Center"
          className="foldertree-img"
        />
        {folderButtons.map((btn, idx) => (
          <div key={idx} className={`foldertree-btn ${btn.className}`} onClick={() => {
            navigate('folder',{
              state:{
                data:btn.data
              }
            })
          }}>
            {btn.label}
          </div>
        ))}
      </div>
    </div>
  );
}

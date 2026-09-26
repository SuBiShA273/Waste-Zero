import React from 'react';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';

const CustomerComplaintsPage = () => {
  return (
    <div className="placeholder-page-wrapper">
      <div className="placeholder-card">
        <ReportProblemIcon className="placeholder-icon" />
        <h2>Support & Complaints System</h2>
        <p>
          Report missed collections, collector feedback, or service issues directly to the WasteZero admin team.
        </p>
        <span className="planned-tag">Module Planned for Future Release</span>
      </div>
    </div>
  );
};

export default CustomerComplaintsPage;

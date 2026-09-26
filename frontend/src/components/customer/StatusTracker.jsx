import React from 'react';
import CheckIcon from '@mui/icons-material/Check';

const STEPS = [
  { key: 'REQUESTED', label: 'Requested' },
  { key: 'ASSIGNED', label: 'Assigned' },
  { key: 'ACCEPTED', label: 'Accepted' },
  { key: 'ON_THE_WAY', label: 'On the Way' },
  { key: 'ARRIVED', label: 'Arrived' },
  { key: 'COLLECTED', label: 'Collected' },
  { key: 'RECYCLED', label: 'Recycled' },
];

const getStepState = (stepKey, currentStatus) => {
  if (currentStatus === 'CANCELLED') {
    return 'disabled';
  }

  const stepOrder = ['REQUESTED', 'ASSIGNED', 'ACCEPTED', 'ON_THE_WAY', 'ARRIVED', 'COLLECTED', 'RECYCLED'];
  const currentIndex = stepOrder.indexOf(currentStatus);
  const stepIndex = stepOrder.indexOf(stepKey);

  if (stepIndex < 0) return 'future';

  if (stepIndex < currentIndex) {
    return 'completed';
  } else if (stepIndex === currentIndex) {
    return 'active';
  } else {
    return 'future';
  }
};

const StatusTracker = ({ status }) => {
  if (status === 'CANCELLED') {
    return (
      <div className="status-tracker-cancelled">
        <span className="cancelled-badge">Status: CANCELLED</span>
        <p className="cancelled-text">This pickup request was cancelled.</p>
      </div>
    );
  }

  return (
    <div className="status-tracker-container">
      <div className="status-tracker-scroll">
        <div className="status-tracker-steps">
          {STEPS.map((step, idx) => {
            const state = getStepState(step.key, status);
            const isLast = idx === STEPS.length - 1;

            return (
              <React.Fragment key={step.key}>
                <div className={`tracker-step ${state}`}>
                  <div className="step-circle">
                    {state === 'completed' ? (
                      <CheckIcon className="check-icon" fontSize="small" />
                    ) : state === 'active' ? (
                      <div className="active-dot" />
                    ) : (
                      <span className="step-number">{idx + 1}</span>
                    )}
                  </div>
                  <span className="step-label">{step.label}</span>
                </div>
                {!isLast && (
                  <div
                    className={`step-line ${
                      state === 'completed' ? 'active' : ''
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StatusTracker;

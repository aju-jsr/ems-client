import React from "react";
import '../styles/event.css';

const SubmitSuccessPopup = ({
  requestNo,
  onClose
}) => {
  return (
    <div className="submit-popup">
      <div className="submit-popup-content">

        <button
          type="button"
          className="popup-close"
          onClick={onClose}
        >
          ×
        </button>

        <h4>Proposal submitted successfully.</h4>

        <div style={{ textAlign: "left" }}>
          <p>EBP No: {requestNo}</p>
        </div>

        <button
          type="button"
          onClick={onClose}
        >
          Continue
        </button>

      </div>
    </div>
  );
};

export default SubmitSuccessPopup;
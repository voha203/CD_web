import React from 'react';
import './ui.css';

function LoadingSpinner({ label = 'Đang tải...' }) {
    return (
        <div className="ui-loading-state" role="status" aria-live="polite">
            <span className="ui-spinner" aria-hidden="true"></span>
            <span>{label}</span>
        </div>
    );
}

export default LoadingSpinner;

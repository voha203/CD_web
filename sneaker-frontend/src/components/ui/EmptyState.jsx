import React from 'react';
import './ui.css';

function EmptyState({ title = 'Chưa có dữ liệu', description, action }) {
    return (
        <div className="ui-empty-panel">
            <div className="ui-empty-icon" aria-hidden="true">!</div>
            <h2>{title}</h2>
            {description && <p>{description}</p>}
            {action}
        </div>
    );
}

export default EmptyState;

import React from 'react';
import './ui.css';

function Toast({ items = [], onClose }) {
    if (!items.length) return null;

    return (
        <div className="ui-toast-stack" role="status" aria-live="polite">
            {items.map(item => (
                <div key={item.id || item.message} className={`ui-toast ${item.type || 'info'}`}>
                    <span>{item.message}</span>
                    {onClose && (
                        <button type="button" aria-label="Đóng thông báo" onClick={() => onClose(item.id)}>
                            x
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
}

export default Toast;

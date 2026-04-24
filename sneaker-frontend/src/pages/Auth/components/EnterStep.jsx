export default function EnterStep({ identifier, setIdentifier, onContinue, error }) {
    return (
        <div className="enter-box">
            <div className="enter-box-header">
                <h1>Sign in or create account</h1>
            </div>

            <div className="enter-box-input">
                <label>Enter mobile number or email</label>
                <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                />

                {identifier && (
                    <span className="clear-btn" onClick={() => setIdentifier("")}>
                        <span className="material-symbols-outlined">
                            close_small
                        </span>
                    </span>
                )}

                {/* {error && <p className="error">{error}</p>} */}
            </div>

            <div className="enter-box-btn">
                <button onClick={onContinue}>Continue</button>
            </div>

            <p className="terms">
                By continuing, you agree to mysneaker's{" "}
                <span>Conditions of Use</span> and{" "}
                <span>Privacy Notice</span>.
            </p>

            <a href="/" className="help">
                <span>Need help?</span>
            </a>

            <div className="divider"></div>

            <p className="business-title">Buying for work?</p>
            <span className="business-link">
                Create a free business account
            </span>
        </div>
    );
}
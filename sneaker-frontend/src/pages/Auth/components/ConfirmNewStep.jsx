export default function ConfirmNewStep({
    identifier,
    identifierType,
    onBack,
    onCreate
}) {
    return (
        <div className="confirm-new-box">
            <div className="confirm-new-box-header">
                <h2>Looks like you're new to mysneaker</h2>
            </div>

            <div className="information">
                <p>
                    {identifier}{" "}
                    <a className="change-btn">
                        <span onClick={onBack}>Change</span>
                    </a>
                </p>
            </div>

            <div className="text">
                <p>
                    Let's create an account using your{" "}
                    {identifierType === "phone" ? "mobile number" : "email"}
                </p>
            </div>

            <div className="confirm-new-box-btn">
                <button onClick={onCreate}>
                    Proceed to create an account
                </button>
            </div>

            <div className="divider"></div>

            <div className="confirm-new-box-footer">
                <p>Already a customer?</p>
                <span onClick={onBack}>
                    Sign in with another email or mobile
                </span>
            </div>
        </div>
    );
}
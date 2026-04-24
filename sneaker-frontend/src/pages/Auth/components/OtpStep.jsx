import { useState } from "react";
import OtpInput from "./OtpInput";

export default function OtpStep({ identifier, identifierType, onBack, onSuccess }) {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);

    const handleSubmit = () => {
        const code = otp.join("");

        if (code.length < 6) {
            alert("Please enter full OTP");
            return;
        }

        // giả lập đúng OTP
        if (code === "123456") {
            onSuccess();
        } else {
            alert("Invalid OTP");
        }
    };

    return (
        <div className="verify-box">
            <div className="verify-box-header">
                <h2>Verify {identifierType === "email" ? "email address" : "mobile number"}</h2>
            </div>

            <div className="text">
                <p>To verify your {identifierType === "email" ? "email address" : "mobile number"}, we've sent a One Time Password (OTP) to</p>
                <p>
                    {identifier}{" "}
                    <a className="change-btn">
                        <span onClick={onBack}>(Change)</span>
                    </a>
                </p>
            </div>

            <div className="request">
                <h2>Enter security code</h2>
            </div>

            <OtpInput otp={otp} setOtp={setOtp} />

            <button className="verify-btn" onClick={handleSubmit}>Verify</button>

            <span className="resend">Resend code</span>
        </div>
    );
}
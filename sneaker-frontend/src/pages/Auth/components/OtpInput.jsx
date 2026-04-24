import { useRef } from "react";

export default function OtpInput({ otp, setOtp }) {
    const inputsRef = useRef([]);

    const handleChange = (e, index) => {
        const value = e.target.value.replace(/[^0-9]/g, "");
        if (!value) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (index < 5) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace") {
            const newOtp = [...otp];

            if (otp[index]) {
                newOtp[index] = "";
            } else if (index > 0) {
                inputsRef.current[index - 1]?.focus();
            }

            setOtp(newOtp);
        }
    };

    const handlePaste = (e) => {
        const paste = e.clipboardData.getData("text").slice(0, 6);
        const newOtp = paste.split("").map((c) => c.replace(/[^0-9]/g, ""));;
        if (newOtp.length === 6) setOtp(newOtp);
    };

    return (
        <div className="otp-container">
            {otp.map((digit, index) => (
                <input
                    key={index}
                    ref={(el) => (inputsRef.current[index] = el)}
                    type="text"
                    value={digit}
                    maxLength={1}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={handlePaste}
                />
            ))}
        </div>
    );
}
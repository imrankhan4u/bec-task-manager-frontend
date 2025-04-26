import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function ResetPassword() {
  const { token } = useParams();

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const handleReset = async () => {
    try {
      const response = await axios.post(`/api/reset-password/${token}`, { password });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleResend = async () => {
    const email = prompt("Enter your email to resend reset link:");
    if (!email) return;

    try {
      await axios.post("/api/forgot-password", { email });
      setMessage("Reset link resent.");
      setTimeLeft(60);
      setCanResend(false);
    } catch (err) {
      setMessage("Failed to resend email.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-black text-white p-4">
      <h2 className="text-2xl mb-4">Reset Your Password</h2>
      <input
        type="password"
        placeholder="New password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="p-2 rounded bg-transparent border border-gray-500 text-white mb-4"
      />
      <button onClick={handleReset} className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">
        Submit
      </button>

      <div className="mt-4 text-sm text-gray-400">
        {canResend ? (
          <button onClick={handleResend} className="text-blue-400 underline">
            Resend reset link
          </button>
        ) : (
          <span>Reset link expires in {timeLeft}s</span>
        )}
      </div>

      {message && <p className="mt-4 text-green-400">{message}</p>}
    </div>
  );
}

export default ResetPassword;

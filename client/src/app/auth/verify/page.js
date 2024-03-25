"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";

export default function Verify() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [code, setCode] = useState("");
  const search = searchParams.get("email");
  const [email, setEmail] = useState(search);

  const maskEmail = (email) => {
    if (!email) return ""; // Handle empty email case

    const atIndex = email.indexOf("@");
    const firstChars = email.slice(0, 2);
    const lastChars = email.slice(atIndex - 2, atIndex);
    const domain = email.slice(atIndex);
    const maskedPart = email.slice(2, atIndex - 2).replace(/./g, "*"); // Mask middle characters

    return `${firstChars}${maskedPart}${lastChars}${domain}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/verify", { email, code });
      alert(response.data);
      if (response.status === 200) {
        // Redirect to the login page
        router.push("/auth/login");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Verify Email</h1>
      <p className="text-gray-700 mb-4">
        A verification code has been sent to {maskEmail(email)}.
      </p>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-md"
      >
        <input
          type="text"
          placeholder="Verification Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="rounded-md border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none"
        >
          Verify
        </button>
      </form>
    </div>
  );
}

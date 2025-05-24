import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import axiosIns from "@/api/axios";
import { MailOpen } from "lucide-react";
import Loader from "@/components/loader";
import { useNavigate } from "react-router-dom";
import PromoSection from "@/components/PromoSection/PromoSection";

const Forgetpassword = () => {
  const [email, setEmail] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axiosIns.post("/auth/forgot-password", {
        email,
      });
      setShowMessage(true);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      const errMsg = error.response?.data?.error || "Email not sent";
      alert(errMsg);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4 sm:p-6 lg:p-8">
      {/* Promo Section on top for smaller screens */}
      <div className="w-full max-w-2xl mb-6 md:hidden">
        <PromoSection />
      </div>

      {/* Main Container for Form and Promo Section Side by Side on larger screens */}
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-lg overflow-hidden flex flex-col-reverse md:flex-row">
        {/* Left Side - Forget Password Form */}
        <div className="w-full md:w-1/2 p-8 flex items-center justify-center">
          {showMessage ? (
            <div className="pb-5 flex flex-col justify-center items-center">
              <MailOpen className="stroke-primary" size={64} />
              <h1 className="text-2xl text-center pt-6 font-semibold text-primary">
                Check your mail
              </h1>
              <p>We have sent a password reset link to your email</p>
              <p className="text-xs">
                Did not receive the email? Check your spam.
              </p>
              <button
                onClick={() => navigate(-1)}
                className="px-4 py-2 mt-3 bg-gray-200 hover:bg-gray-300 text-black rounded-md"
              >
                Go Back
              </button>
            </div>
          ) : (
            <form
              className="pb-5 w-full max-w-md rounded-lg flex flex-col justify-center items-center"
              onSubmit={submitHandler}
            >
              <h1 className="text-2xl text-center pt-6 font-semibold text-[#002147]">
                Forget Your Password?
              </h1>
              <h6 className="text-center text-xs pt-3">
                Your password will be reset by your email.
              </h6>
              <div className="w-3/4">
                <span className="pt-6 flex gap-10 text-sm">
                  Enter your email address
                </span>
                <input
                  className="w-full mt-2 text-sm focus:border-blue-500 focus:outline-none focus:shadow-outline-purple form-input border rounded-md px-2 py-2"
                  placeholder="Enter Your Email"
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button
                  type="submit"
                  className="w-full text-white mt-6 bg-[#011c3b] hover:bg-[#002147]"
                >
                  Reset your password
                  {loading && <Loader className={`h-3 w-3 text-white ml-3`} />}
                </Button>
              </div>
              <Link to={"/login"}>
                <span className="text-sm pt-2 text-[#011c3b] flex cursor-pointer">
                  {" "}
                  Back to login
                </span>
              </Link>
            </form>
          )}
        </div>

        {/* Right Side - Promotional Content visible only on medium and larger screens */}
        <div className="w-full md:w-1/2 hidden md:flex">
          <PromoSection />
        </div>
      </div>
    </div>
  );
};

export default Forgetpassword;

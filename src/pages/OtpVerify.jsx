import React, { useState, useEffect } from "react";
import {
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { authSelector, setUserInfo } from "@/redux/auth/authSlice";
import { verifyOtp } from "@/redux/auth/authThunk"; // Assuming you have an action to verify OTP
import { useNavigate } from "react-router-dom";
import Loader from "@/components/loader";
import toastMessage from "@/lib/toastMessage";
import { useSearchParams } from "react-router-dom";

export default function OtpVerify() {
  const [otp, setOtp] = useState(""); // State to store OTP input
  const [isLoading, seIstLoading] = useState(false); // State to store OTP input
  const { loading, error, userInfo } = useSelector(authSelector);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam); // Set the email from query params
    }
  }, [searchParams]);

  // Function to handle OTP submission
  const submitHandler = (e) => {
    e.preventDefault();
    if (otp.length === 6) {
        seIstLoading(true);
        console.log({ email, otp }, "====email,otpssss");
        
        dispatch(verifyOtp({ email, otp }))
        .then(res => {
            console.log(res, "==res");
            localStorage.setItem("userInfo", JSON.stringify(res.payload));
            dispatch(setUserInfo(res.payload));
            toastMessage("Otp Verified", "succes");
            navigate("/dashboard");
        }).catch(err => {
            toastMessage("Invalid Otp", "error");
            console.log(err);
        }).finally(()=>{
            seIstLoading(false);
        });
    }
    else {
        toastMessage("Please enter valid otp", "error").unwrap()
        
    }
  };

  useEffect(() => {
    // If OTP is successfully verified, navigate to dashboard
    if (userInfo?.access?.token) {
      navigate("/dashboard");
    }
  }, [userInfo, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md bg-white rounded-lg overflow-hidden shadow-lg p-6 sm:p-8">
        <form onSubmit={submitHandler} className="space-y-6">
          <Card className="space-y-6 shadow-none border-0">
            <CardHeader>
              <div className="flex justify-center items-center">
                <h4 className="mt-6 text-center text-2xl text-gray-900">
                  Verify OTP
                </h4>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">Enter the 6-digit OTP sent to your email</Label>
                  <Input
                    id="otp"
                    name="otp"
                    placeholder="Enter OTP"
                    required
                    type="text"
                    onChange={(e) => setOtp(e.target.value)}
                    value={otp}
                    maxLength="6"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-center">
              {isLoading ? (
                <Loader />
              ) : (
                <Button type="submit" className="w-full bg-[#011c3b] hover:bg-[#002147]" disabled={otp.length !== 6}>
                  Verify OTP
                </Button>
              )}
            </CardFooter>
          </Card>
        </form>

        {/* Display error message if OTP verification fails */}
        {error && (
          <div className="text-red-500 text-sm mt-4 text-center">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

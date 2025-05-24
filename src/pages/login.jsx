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
import { authSelector } from "@/redux/auth/authSlice";
import { loginUser } from "@/redux/auth/authThunk";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import Loader from "@/components/loader";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import PromoSection from "@/components/PromoSection/PromoSection";
import toastMessage from "@/lib/toastMessage";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [passwordError, setPasswordError] = useState("");
  const { loading, error, userInfo } = useSelector(authSelector);
  const dispatch = useDispatch();
  const navigation = useNavigate();
  const [query] = useSearchParams();
  const redirect =
    query.get("redirect") === null ? "/dashboard" : query.get("redirect");

  const pattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    const isValid = pattern.test(newPassword);
    if (!isValid && newPassword.length > 0) {
      setPasswordError(
        "Password must be at least 8 characters & should be a combination of letters and numbers"
      );
    } else {
      setPasswordError("");
    }
  };

  const handlePasswordFocus = () => {
    if (!pattern.test(password)) {
      setPasswordError(
        "Password must be at least 8 characters & should be a combination of letters and numbers"
      );
    } else {
      setPasswordError("");
    }
  };

  const handlePasswordBlur = () => {
    if (password && pattern.test(password)) {
      setPasswordError("");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password })).unwrap().then(res => {
      console.log(res, "====res:loginnnnn");
      toastMessage(res.message, "success")
      navigation(`/verify-otp?email=${email}`);
      // navigation('/dashboard')
    });
  };

  useEffect(() => {
    if (userInfo?.access?.token) {
      navigation(redirect);
    }
  }, [userInfo, navigation, redirect]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4 sm:p-6 lg:p-8">
      {/* Promo Section on top for smaller screens */}
      <div className="w-full max-w-2xl mb-6 md:hidden">
        <PromoSection />
      </div>

      {/* Main Container for Form and Promo Section Side by Side on larger screens */}
      <div className="w-full max-w-5xl bg-white rounded-lg overflow-hidden shadow-lg flex flex-col-reverse md:flex-row">
        {/* Left Side - Form */}
        <div className="w-full md:w-1/2 p-6 sm:p-8">
          <form onSubmit={submitHandler} className="space-y-6">
            <Card className="space-y-6 shadow-none border-0">
              <CardHeader>
                <div className="flex justify-center items-center">
                  <h4 className="mt-6 text-center text-2xl text-gray-900">
                    Sign In
                  </h4>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      autoComplete="email"
                      id="email"
                      name="email"
                      placeholder="Email"
                      required
                      type="email"
                      onChange={(e) => setEmail(e.target.value)}
                      value={email}
                    />
                  </div>
                  <div>
                    <div className="space-y-2 relative flex flex-col justify-center">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        autoComplete="current-password"
                        id="password"
                        name="password"
                        placeholder="Password"
                        type={showPassword ? "text" : "password"}
                        onChange={handlePasswordChange}
                        // onFocus={handlePasswordFocus}z 
                        onBlur={handlePasswordBlur}
                        required
                        value={password}
                      />
                      <div
                        className="absolute inset-y-0 right-0 pr-3 top-3 flex items-center cursor-pointer"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? (
                          <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                        ) : (
                          <EyeIcon className="h-5 w-5 text-gray-500" />
                        )}
                      </div>
                    </div>
                      {passwordError && (
                        <div className="text-red-500 text-sm mt-1">
                          {passwordError}
                        </div>
                      )}
                  </div>
                  <div className="text-sm text-right">
                    <Link
                      className="font-medium text-[#011c3b] hover:text-[#002147]"
                      to={"/forget-password"}
                    >
                      Forgot your password?
                    </Link>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-center">
                {loading ? (
                  <Loader />
                ) : (
                  <Button disabled={passwordError} type="submit" className="w-full bg-[#011c3b] hover:bg-[#002147]">
                    Log In
                  </Button>
                )}
              </CardFooter>
            </Card>
          </form>
        </div>

        {/* Right Side - Promo Section visible only on medium and larger screens */}
        <div className="w-full md:w-1/2 hidden md:flex">
          <PromoSection />
        </div>
      </div>

      {/* Error Message */}
      {/* {error && (
        <div className="absolute bottom-20 left-8 z-100 text-red-500">
          {error}
        </div>
      )} */}
    </div>
  );
}
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import Loader from "@/components/loader";
import axiosIns from "@/api/axios";
import PromoSection from "@/components/PromoSection/PromoSection";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"; // Import Eye icons for password toggle

const Confirmpassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State to toggle confirm password visibility
  const [showMessage, setShowMessage] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      if (password.length < 8) {
        setError("Password must be at least 8 characters");
        return;
      }
      if (confirmPassword.length < 8) {
        setError("Password must be at least 8 characters");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      const token = searchParams.get("token");
      if (!token) {
        setError("No token found");
        return;
      }
      setError("");
      setLoading(true);
      await axiosIns.post(`/auth/reset-password?token=${token}`, {
        password,
      });
      setLoading(false);
      setShowMessage(true);
      setTimeout(() => {
        navigate("/login");
      }, 1800);
    } catch (error) {
      setLoading(false);
      setError(error.response.data.error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4 sm:p-6 lg:p-8">
      {/* Promo Section on top for smaller screens */}
      <div className="w-full max-w-2xl mb-6 md:hidden">
        <PromoSection />
      </div>

      {/* Main Container for Form and Promo Section Side by Side on larger screens */}
      <div className="w-full max-w-5xl bg-white rounded-lg overflow-hidden shadow-lg flex flex-col-reverse md:flex-row">
        {/* Left Side - Confirm Password Form */}
        <div className="w-full md:w-1/2 p-8 flex items-center justify-center">
          <form
            className="pb-5 w-full max-w-md rounded-lg flex flex-col justify-center items-center"
            onSubmit={submitHandler}
          >
            <h1 className="text-2xl text-center pt-6 font-semibold text-[#002147]">
              Reset Your Password?
            </h1>
            <h6 className="text-center text-sm pt-3 text-gray-500 px-3">
              Enter a new password for your account. We'll ask for this password
              whenever you log in.
            </h6>
            <div className="w-3/4">
              <span className="pt-6 flex gap-10 text-sm">New Password *</span>
              <div className="relative">
                <input
                  className="w-full mt-2 text-sm focus:border-blue-400 focus:outline-none focus:shadow-outline-purple form-input border rounded-md px-2 py-2"
                  placeholder="Enter Your New Password"
                  type={showPassword ? "text" : "password"}
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  required
                />
                <div
                  className="absolute inset-y-0 right-0 top-2 pr-3 flex items-center cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-500" />
                  )}
                </div>
              </div>

              <span className="pt-6 flex gap-10 text-sm">
                Confirm New Password *
              </span>
              <div className="relative">
                <input
                  className="w-full mt-2 text-sm focus:border-blue-400 focus:outline-none focus:shadow-outline-purple form-input border rounded-md px-2 py-2"
                  placeholder="Re-enter Your Password"
                  type={showConfirmPassword ? "text" : "password"}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  value={confirmPassword}
                  required
                />
                <div
                  className="absolute inset-y-0 right-0 top-2 pr-3 flex items-center cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-500" />
                  )}
                </div>
              </div>

              {error && <p className="text-red-500 text-sm pt-2">{error}</p>}
              {loading ? (
                <div className="flex justify-center items-center py-2">
                  <Loader />
                </div>
              ) : showMessage ? (
                <p className="text-green-500 text-sm pt-2 text-center">
                  Password reset successfully. Redirecting to login page
                </p>
              ) : (
                <Button
                  className="w-full mt-6 bg-[#011c3b] hover:bg-[#002147]"
                  type="submit"
                >
                  Reset your password
                </Button>
              )}
            </div>
            <span className="text-sm pt-2 text-gray-500 flex ">
              Know your password?{" "}
              <Link to={"/login"}>
                <span className="text-[#011c3b] hover:text-[#002147] cursor-pointer">
                  {" "}
                  &nbsp; Log in
                </span>
              </Link>
            </span>
          </form>
        </div>

        {/* Right Side - Promotional Content visible only on medium and larger screens */}
        <div className="w-full md:w-1/2 hidden md:flex">
          <PromoSection />
        </div>
      </div>
    </div>
  );
};

export default Confirmpassword;























// import React, { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Link, useSearchParams, useNavigate } from "react-router-dom";
// import Loader from "@/components/loader";
// import axiosIns from "@/api/axios";
// import PromoSection from "@/components/PromoSection/PromoSection";
// import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"; // Import Eye icons for password toggle

// const Confirmpassword = () => {
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State to toggle confirm password visibility
//   const [showMessage, setShowMessage] = useState(false);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();

//   const submitHandler = async (e) => {
//     e.preventDefault();
//     try {
//       if (password.length < 8) {
//         setError("Password must be at least 8 characters");
//         return;
//       }
//       if (confirmPassword.length < 8) {
//         setError("Password must be at least 8 characters");
//         return;
//       }
//       if (password !== confirmPassword) {
//         setError("Passwords do not match");
//         return;
//       }
//       const token = searchParams.get("token");
//       if (!token) {
//         setError("No token found");
//         return;
//       }
//       setError("");
//       setLoading(true);
//       await axiosIns.post(`/auth/reset-password?token=${token}`, {
//         password,
//       });
//       setLoading(false);
//       setShowMessage(true);
//       setTimeout(() => {
//         navigate("/login");
//       }, 1800);
//     } catch (error) {
//       setLoading(false);
//       setError(error.response.data.error);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="w-full max-w-5xl flex bg-white rounded-lg overflow-hidden">
//         {/* Left Side - Confirm Password Form */}
//         <div className="w-1/2 p-8 flex items-center justify-center">
//           <form
//             className="pb-5 w-full max-w-md rounded-lg flex flex-col justify-center items-center"
//             onSubmit={submitHandler}
//           >
//             <h1 className="text-2xl text-center pt-6 font-semibold text-[#002147]">
//               Reset Your Password?
//             </h1>
//             <h6 className="text-center text-sm pt-3 text-gray-500 px-3">
//               Enter a new password for your account. We'll ask for this password
//               whenever you log in.
//             </h6>
//             <div className="w-3/4">
//               <span className="pt-6 flex gap-10 text-sm">New Password *</span>
//               <div className="relative">
//                 <input
//                   className="w-full mt-2 text-sm focus:border-blue-400 focus:outline-none focus:shadow-outline-purple form-input border rounded-md px-2 py-2"
//                   placeholder="Enter Your New Password"
//                   type={showPassword ? "text" : "password"}
//                   onChange={(e) => setPassword(e.target.value)}
//                   value={password}
//                   required
//                 />
//                 <div
//                   className="absolute inset-y-0 right-0 top-2 pr-3 flex items-center cursor-pointer"
//                   onClick={() => setShowPassword(!showPassword)}
//                 >
//                   {showPassword ? (
//                     <EyeSlashIcon className="h-5 w-5 text-gray-500" />
//                   ) : (
//                     <EyeIcon className="h-5 w-5 text-gray-500" />
//                   )}
//                 </div>
//               </div>

//               <span className="pt-6 flex gap-10 text-sm">
//                 Confirm New Password *
//               </span>
//               <div className="relative">
//                 <input
//                   className="w-full mt-2 text-sm focus:border-blue-400 focus:outline-none focus:shadow-outline-purple form-input border rounded-md px-2 py-2"
//                   placeholder="Re-enter Your Password"
//                   type={showConfirmPassword ? "text" : "password"}
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                   value={confirmPassword}
//                   required
//                 />
//                 <div
//                   className="absolute inset-y-0 right-0 top-2 pr-3 flex items-center cursor-pointer"
//                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                 >
//                   {showConfirmPassword ? (
//                     <EyeSlashIcon className="h-5 w-5 text-gray-500" />
//                   ) : (
//                     <EyeIcon className="h-5 w-5 text-gray-500" />
//                   )}
//                 </div>
//               </div>

//               {error && <p className="text-red-500 text-sm pt-2">{error}</p>}
//               {loading ? (
//                 <div className="flex justify-center items-center py-2">
//                   <Loader />
//                 </div>
//               ) : showMessage ? (
//                 <p className="text-green-500 text-sm pt-2 text-center">
//                   Password reset successfully. Redirecting to login page
//                 </p>
//               ) : (
//                 <Button
//                   className="w-full mt-6 bg-[#011c3b] hover:bg-[#002147]"
//                   type="submit"
//                 >
//                   Reset your password
//                 </Button>
//               )}
//             </div>
//             <span className="text-sm pt-2 text-gray-500 flex ">
//               Know your password?{" "}
//               <Link to={"/login"}>
//                 <span className="text-[#011c3b] hover:text-[#002147] cursor-pointer">
//                   {" "}
//                   &nbsp; Log in
//                 </span>
//               </Link>
//             </span>
//           </form>
//         </div>

//         {/* Right Side - Promotional Content */}
//         <PromoSection />
//       </div>
//     </div>
//   );
// };

// export default Confirmpassword;
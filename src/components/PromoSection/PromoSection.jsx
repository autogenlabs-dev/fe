// PromoSection.jsx
import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircleIcon } from "@heroicons/react/24/outline"; // Import check icon
import visa from "@/assets/payments/visa-only.png";
import master from "@/assets/payments/master.png";
import echeck from "@/assets/payments/echeck.png";
import main_logo from '@/assets/main-logo.png'

const PromoSection = () => {
  return (
    <div className="w-full bg-white border-l border-black/35 my-3 flex items-center justify-center text-white px-4 md:px-8 py-6 relative">
      <img src={main_logo} />
      {/* <div className="text-center space-y-4">
        <div className="flex justify-center items-center gap-2 md:gap-3">
          <p className="text-2xl md:text-3xl">FMS</p>
          <div className="w-[2px] h-6 md:h-[30px] bg-white"></div>
          <h3 className="font-semibold text-2xl md:text-3xl">Payment</h3>
        </div>
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold">
          Stop Waiting for Paper Checks
        </h2>

        <div className="space-y-2 text-sm md:text-lg">
          <div className="flex items-center">
            <CheckCircleIcon className="h-5 w-5 md:h-6 md:w-6 text-green-500 mr-2" />
            <span>70% faster payments</span>
          </div>
          <div className="flex items-center">
            <CheckCircleIcon className="h-5 w-5 md:h-6 md:w-6 text-green-500 mr-2" />
            <span>Industry-low, flat pricing</span>
          </div>
          <div className="flex items-center">
            <CheckCircleIcon className="h-5 w-5 md:h-6 md:w-6 text-green-500 mr-2" />
            <span>All credit cards and eChecks</span>
          </div>
          <div className="flex items-center">
            <CheckCircleIcon className="h-5 w-5 md:h-6 md:w-6 text-green-500 mr-2" />
            <span>ABA, IOLTA & PCI compliant</span>
          </div>
        </div>

        <div className="mt-4 bg-[#002147] text-white font-bold py-2 px-4 md:px-6 rounded-full">
          Log In to Activate
        </div>

        <div className="mt-4 flex justify-center space-x-6 md:space-x-10">
          <img src={visa} alt="Visa" className="w-10 md:w-12" />
          <img src={master} alt="MasterCard" className="w-10 md:w-12" />
          <img src={echeck} alt="eCheck" className="w-10 md:w-12" />
        </div>
      </div> */}
    </div>
  );
};

export default PromoSection;































// // PromoSection.jsx
// import React from "react";
// import { Button } from "@/components/ui/button";
// import { CheckCircleIcon } from "@heroicons/react/24/outline"; // Import check icon
// import visa from "@/assets/payments/visa-only.png";
// import master from "@/assets/payments/master.png";
// import echeck from "@/assets/payments/echeck.png";

// const PromoSection = () => {
//   return (
//     <div className="w-1/2 bg-[#011c3b] flex items-center justify-center text-white px-8 py-6 relative">
//       <div className="text-center space-y-4">
//         <div className="flex justify-center items-center gap-3">
//           <p className="text-3xl">FMS</p>
//           <div className="w-1 h-[30px] bg-white"></div>
//           <h3 className="font-semibold text-2xl">Payment</h3>
//         </div>
//         <h2 className="xl:text-5xl lg:text-4xl md:text-3xl sm:text-2xl font-bold">Stop Waiting for Paper Checks</h2>

//         {/* Features with Check Icons */}
//         <div className="space-y-2 text-lg">
//           <div className="flex items-center">
//             <CheckCircleIcon className="h-6 w-6 text-green-500 mr-2" />
//             <span>70% faster payments</span>
//           </div>
//           <div className="flex items-center">
//             <CheckCircleIcon className="h-6 w-6 text-green-500 mr-2" />
//             <span>Industry-low, flat pricing</span>
//           </div>
//           <div className="flex items-center">
//             <CheckCircleIcon className="h-6 w-6 text-green-500 mr-2" />
//             <span>All credit cards and eChecks</span>
//           </div>
//           <div className="flex items-center">
//             <CheckCircleIcon className="h-6 w-6 text-green-500 mr-2" />
//             <span>ABA, IOLTA & PCI compliant</span>
//           </div>
//         </div>

//         <Button className="mt-4 bg-red-500 text-white font-bold py-2 px-6 rounded-full">
//           Log In to Activate
//         </Button>
//         <div className="mt-4 flex justify-center space-x-10">
//           <img src={visa} alt="Visa" className="w-12" />
//           <img src={master} alt="MasterCard" className="w-12" />
//           <img src={echeck} alt="eCheck" className="w-12" />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PromoSection;
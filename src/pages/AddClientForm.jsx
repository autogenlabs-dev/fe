import Loader from "@/components/loader";
import toastMessage from "@/lib/toastMessage";
import { authSelector } from "@/redux/auth/authSlice";
import { createClient, getClientByIdThunk, updateClient } from "@/redux/client/clientThunk";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";

const AddClientForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { clientId } = useParams(); // Get clientId from URL params
  const location = useLocation(); // Access location state
  const [isLoading, setIsLoading] = useState(false);
  const { userInfo } = useSelector(authSelector);
  const [formData, setFormData] = useState({
    clientName: "",
    email: "",
    phone: "",
    title: ""
  });

  useEffect(() => {
    // Check if client data is passed via location.state (for edit)
    if (location.state && location.state.client) {
      setFormData(location.state.client);
    } else if (clientId) {
      // If no state data and there's a clientId, fetch client data
      setIsLoading(true);
      dispatch(getClientByIdThunk({ id: clientId, token: userInfo?.access?.token }))
        .unwrap()
        .then((clientData) => {
          setFormData(clientData);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err, "=err:fetch-client");
          setIsLoading(false);
          toastMessage(err.message || 'Error fetching client data', "error");
        });
    }
  }, [clientId, location.state, dispatch, userInfo?.access?.token]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    console.log("Form Data:", formData);
    const dataToBeSend = { ...formData };
    setIsLoading(true);
    const dispatchFunc = clientId ? updateClient: createClient
    if(clientId) dataToBeSend["id"] = clientId;
    dispatch(dispatchFunc({ ...dataToBeSend, token: userInfo?.access?.token }))
      .unwrap()
      .then((res) => {
        toastMessage(`Client successfully ${clientId ? "updated": "added"}`, "success");
        console.log(res, "=res:create-client");
        setIsLoading(false);
        navigate("/clients");
      })
      .catch((err) => {
        console.log(err, "=err:create-client");
        setIsLoading(false);
        const errorMsg = err.response?.data?.message || err.message || 'Something went wrong';
        toastMessage(errorMsg, "error");
      });
  };

  const handleClose = () => {
    navigate(-1);
  };

  return (
    <div className="container mx-auto py-5 px-16">
      <h2 className="text-2xl font-semibold mb-6">
        {clientId ? "Edit Client" : "Add Client"}
      </h2>
      <form className="grid grid-cols-1 gap-6">
        <div className="mb-4">
          <label className="block">Client Name:</label>
          <input
            type="text"
            name="clientName"
            value={formData.clientName}
            onChange={handleChange}
            className="border w-full p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="border w-full p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block">Phone:</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="border w-full p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block">Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="border w-full p-2"
          />
        </div>
      </form>
      <div className="flex justify-center gap-6">
        <button
          type="button"
          onClick={handleClose}
          className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded mt-4"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={isLoading}
          className="bg-[#002147] text-white px-4 py-2 rounded mt-4 h-10 flex items-center gap-3"
        >
          Save 
          {isLoading && <span><Loader /></span>}
        </button>
      </div>
    </div>
  );
};

export default AddClientForm;


















// import Loader from "@/components/loader";
// import toastMessage from "@/lib/toastMessage";
// import { authSelector } from "@/redux/auth/authSlice";
// import { createClient } from "@/redux/client/clientThunk";
// import React, { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";

// const AddClientForm = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [isLoading, setIsLoading] = useState(false);
//   const { userInfo } = useSelector(authSelector);
//   const [formData, setFormData] = useState({
//     clientId: "",
//     clientName: "",
//     accountManager: "",
//     primaryContact: "",
//     email: "",
//     phone: "",
//     mobile: "",
//     fax: "",
//     creationDate: "",
//     billingContact: "",
//     billingName: "",
//     address1: "",
//     address2: "",
//     address3: "",
//     country: "United States",
//     city: "",
//     state: "",
//     zip: "",
//     status: "Active",
//     clientType: "N/A",
//     vatNumber: "",
//     abaCodes: "Default",
//     currencyCode: "Firm Default",
//     currencySymbol: "",
//     accountingIsolation: "Firm Default",
//     minimumTrustBalance: ""
//   });

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSave = () => {
//     console.log("Form Data:", formData);
//     setIsLoading(true);
//     dispatch(createClient({ ...formData, token: userInfo?.access?.token, })).unwrap()
//     .then(res => {
//       toastMessage("Client succesfully added", "success");
//       console.log(res, "=res:create-cienttttt");
//       setIsLoading(false);
//       navigate("/clients")
//     }).catch(err => {
//       console.log(err, "=err:create-cienttttt");
//       setIsLoading(false);
//       const errorMsg = err.message || 'something went wrong'
//       toastMessage(errorMsg ,"error");
//     })
//     // Handle save functionality, such as sending the form data to an API
//   };

//   const handleClose = () => {
//     navigate(-1);
//   }

//   return (
//     <div className="container mx-auto py-5 px-16">
//       <h2 className="text-2xl font-semibold mb-6">Client Information</h2>
//       <form className="grid grid-cols-2 gap-6">
//         {/* Left Column */}
//         <div>
//           <div className="mb-4">
//             <label className="block">Client ID:</label>
//             <input
//               type="text"
//               name="clientId"
//               value={formData.clientId}
//               onChange={handleChange}
//               className="border w-full p-2"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block">Client Name:</label>
//             <input
//               type="text"
//               name="clientName"
//               value={formData.clientName}
//               onChange={handleChange}
//               className="border w-full p-2"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block">Account Manager:</label>
//             <input
//               type="text"
//               name="accountManager"
//               value={formData.accountManager}
//               onChange={handleChange}
//               className="border w-full p-2"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block">Primary Contact:</label>
//             <input
//               type="text"
//               name="primaryContact"
//               value={formData.primaryContact}
//               onChange={handleChange}
//               className="border w-full p-2"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block">Email:</label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               className="border w-full p-2"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block">Phone:</label>
//             <input
//               type="text"
//               name="phone"
//               value={formData.phone}
//               onChange={handleChange}
//               className="border w-full p-2"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block">Mobile:</label>
//             <input
//               type="text"
//               name="mobile"
//               value={formData.mobile}
//               onChange={handleChange}
//               className="border w-full p-2"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block">Fax:</label>
//             <input
//               type="text"
//               name="fax"
//               value={formData.fax}
//               onChange={handleChange}
//               className="border w-full p-2"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block">Creation Date:</label>
//             <input
//               type="date"
//               name="creationDate"
//               value={formData.creationDate}
//               onChange={handleChange}
//               className="border w-full p-2"
//             />
//           </div>
//         </div>

//         {/* Right Column */}
//         <div>
//           <div className="mb-4">
//             <label className="block">Billing Contact:</label>
//             <input
//               type="text"
//               name="billingContact"
//               value={formData.billingContact}
//               onChange={handleChange}
//               className="border w-full p-2"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block">Billing Name:</label>
//             <input
//               type="text"
//               name="billingName"
//               value={formData.billingName}
//               onChange={handleChange}
//               className="border w-full p-2"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block">Address 1:</label>
//             <input
//               type="text"
//               name="address1"
//               value={formData.address1}
//               onChange={handleChange}
//               className="border w-full p-2"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block">Address 2:</label>
//             <input
//               type="text"
//               name="address2"
//               value={formData.address2}
//               onChange={handleChange}
//               className="border w-full p-2"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block">Address 3:</label>
//             <input
//               type="text"
//               name="address3"
//               value={formData.address3}
//               onChange={handleChange}
//               className="border w-full p-2"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block">Country:</label>
//             <select
//               name="country"
//               value={formData.country}
//               onChange={handleChange}
//               className="border w-full p-2 h-[42px]"
//             >
//               <option value="United States">United States</option>
//               <option value="Canada">Canada</option>
//               <option value="United Kingdom">United Kingdom</option>
//             </select>
//           </div>
//           <div className="mb-4">
//             <label className="block">City:</label>
//             <input
//               type="text"
//               name="city"
//               value={formData.city}
//               onChange={handleChange}
//               className="border w-full p-2"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block">State:</label>
//             <input
//               type="text"
//               name="state"
//               value={formData.state}
//               onChange={handleChange}
//               className="border w-full p-2"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block">Zip:</label>
//             <input
//               type="text"
//               name="zip"
//               value={formData.zip}
//               onChange={handleChange}
//               className="border w-full p-2"
//             />
//           </div>
//         </div>

//         {/* Client Settings Section */}
//         <div className="col-span-2 grid grid-cols-2 gap-6">
//           <div>
//             <h3 className="text-lg font-semibold mb-2">Client Settings</h3>
//             <div className="mb-4">
//               <label className="block">Status:</label>
//               <select
//                 name="status"
//                 value={formData.status}
//                 onChange={handleChange}
//                 className="border w-full p-2 h-[42px]"
//               >
//                 <option value="Active">Active</option>
//                 <option value="Inactive">Inactive</option>
//               </select>
//             </div>
//             <div className="mb-4">
//               <label className="block">Client Type:</label>
//               <input
//                 type="text"
//                 name="clientType"
//                 value={formData.clientType}
//                 onChange={handleChange}
//                 className="border w-full p-2"
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block">VAT Number:</label>
//               <input
//                 type="text"
//                 name="vatNumber"
//                 value={formData.vatNumber}
//                 onChange={handleChange}
//                 className="border w-full p-2"
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block">ABA Codes:</label>
//               <select
//                 name="abaCodes"
//                 value={formData.abaCodes}
//                 onChange={handleChange}
//                 className="border w-full p-2 h-[42px]"
//               >
//                 <option value="Default">Default</option>
//                 <option value="Custom">Custom</option>
//               </select>
//             </div>
//           </div>

//           <div>
//             <h3 className="text-lg font-semibold mb-2">&nbsp;</h3>
//             <div className="mb-4">
//               <label className="block">Currency Code:</label>
//               <select
//                 name="currencyCode"
//                 value={formData.currencyCode}
//                 onChange={handleChange}
//                 className="border w-full p-2 h-[42px]"
//               >
//                 <option value="Firm Default">Firm Default</option>
//                 <option value="Custom">Custom</option>
//               </select>
//             </div>
//             <div className="mb-4">
//               <label className="block">Currency Symbol:</label>
//               <input
//                 type="text"
//                 name="currencySymbol"
//                 value={formData.currencySymbol}
//                 onChange={handleChange}
//                 className="border w-full p-2"
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block">Accounting Isolation:</label>
//               <select
//                 name="accountingIsolation"
//                 value={formData.accountingIsolation}
//                 onChange={handleChange}
//                 className="border w-full p-2 h-[42px]"
//               >
//                 <option value="Firm Default">Firm Default</option>
//                 <option value="Custom">Custom</option>
//               </select>
//             </div>
//             <div className="mb-4">
//               <label className="block">Minimum Trust Balance:</label>
//               <input
//                 type="text"
//                 name="minimumTrustBalance"
//                 value={formData.minimumTrustBalance}
//                 onChange={handleChange}
//                 className="border w-full p-2"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Save Button */}
//       </form>
//       <div className="flex justify-center gap-6">
//         <button
//           type="button"
//           onClick={handleClose}
//           className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded mt-4"
//         >
//           Cancel
//         </button>
//         <button
//           type="button"
//           onClick={handleSave}
//           className="bg-[#002147] text-white px-4 py-2 rounded mt-4"
//         >
//           Save 
//           {isLoading && <span><Loader /></span>}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default AddClientForm;

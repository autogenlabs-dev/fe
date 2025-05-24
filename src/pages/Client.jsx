import { authSelector } from "@/redux/auth/authSlice";
import { getClientsThunk } from "@/redux/client/clientThunk";
import { Search, Edit, Trash2 } from "lucide-react"; // Icons
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loader from "@/components/loader";
import DeleteClientModal from "@/components/Clients/DeleteClientModal";

const ClientList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [clients, setClients] = useState([]);
  const { userInfo } = useSelector(authSelector);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    setIsLoading(true);
    dispatch(getClientsThunk({ token: userInfo?.access?.token }))
      .unwrap()
      .then((res) => {
        console.log(res, "===res:getClientsThunk");
        setClients(res);
        setIsLoading(false);
      })
      .catch((err) => {
        setClients([]);
        setIsLoading(false);
        console.log(err, "===err:getClientsThunk");
      });
  }, [dispatch, userInfo]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredClients = clients?.filter(
    (client) =>
      client?.clientName?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      client?.email?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );

  const handleFilter = (id) => {
    const filt = clients.filter(client => client.id !== id);
    setClients(filt);
  }

  const handleEdit = (client) => {
    navigate(`/edit-client/${client.id}`, { state: { client } });
  };

  const handleDelete = (clientId) => {
    // Call an action or function to delete the client
    console.log(`Deleting client with ID: ${clientId}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-semibold">Clients</h1>
        <div>
          <button
            className="bg-[#002147] text-white px-4 py-2 rounded mr-2"
            onClick={() => navigate("/add-client")}
          >
            Add Client
          </button>
        </div>
      </div>

      <div className="flex justify-between mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by Name or Email"
            value={searchTerm}
            onChange={handleSearch}
            className="border border-gray-300 p-2 rounded w-64 pr-10"
          />
          <Search className="absolute top-2 right-3" />
        </div>
      </div>

      <table className="table-auto w-full mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Phone</th>
            <th className="border px-4 py-2">Title</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredClients.length > 0 ? (
            filteredClients.map((client, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{client.clientName}</td>
                <td className="border px-4 py-2">{client.email}</td>
                <td className="border px-4 py-2">{client.phone}</td>
                <td className="border px-4 py-2">{client.title}</td>
                <td className="border px-4 py-2 flex justify-center gap-4">
                  <button onClick={() => handleEdit(client)} title="Edit Client">
                    <Edit className="text-blue-500" />
                  </button>
                  <DeleteClientModal client={client} handleFilter={handleFilter} />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="border px-4 py-4 text-center">
                No clients match this search.{" "}
                <a href="/add-client" className="text-blue-800">
                  Create a new client?
                </a>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ClientList;


















// import { authSelector } from "@/redux/auth/authSlice";
// import { getClientsThunk } from "@/redux/client/clientThunk";
// import { Search } from "lucide-react";
// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import Loader from "@/components/loader"; // Assuming you have a Loader component

// const ClientList = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [pageSize, setPageSize] = useState(10);
//   const [clients, setClients] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const { userInfo } = useSelector(authSelector);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   useEffect(() => {
//     setIsLoading(true);
//     dispatch(getClientsThunk({ token: userInfo?.access?.token }))
//       .unwrap()
//       .then((res) => {
//         console.log(res, "===res:getClientsThunk");
//         setClients(res);
//         setIsLoading(false);
//       })
//       .catch((err) => {
//         setClients([]);
//         setIsLoading(false);
//         console.log(err, "===err:getClientsThunk");
//       });
//   }, [dispatch, userInfo]);

//   const handleSearch = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   const handlePageSizeChange = (e) => {
//     setPageSize(e.target.value);
//   };

//   const filteredClients = clients?.filter(
//     (client) =>
//       client?.clientName?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
//       client?.city?.toLowerCase()?.includes(searchTerm?.toLowerCase())
//   );

//   const handlePrevPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   const handleNextPage = () => {
//     if (currentPage < Math.ceil(filteredClients?.length / pageSize)) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <Loader /> {/* Show loader while loading */}
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <div className="flex justify-between mb-4">
//         <h1 className="text-2xl font-semibold">Clients</h1>
//         <div>
//           <button
//             className="bg-[#002147] text-white px-4 py-2 rounded mr-2"
//             onClick={() => navigate("/add-client")}
//           >
//             Add Client
//           </button>
//           <button className="bg-[#002147] text-white px-4 py-2 rounded">
//             Manage Contacts
//           </button>
//         </div>
//       </div>

//       <div className="flex justify-between mb-4">
//         <div className="relative">
//           <input
//             type="text"
//             placeholder="Search"
//             value={searchTerm}
//             onChange={handleSearch}
//             className="border border-gray-300 p-2 rounded w-64 pr-10"
//           />
//           <Search className="absolute top-2 right-3" />
//         </div>
//       </div>

//       <table className="table-auto w-full mb-4">
//         <thead>
//           <tr className="bg-gray-100">
//             <th className="border px-4 py-2">Id</th>
//             <th className="border px-4 py-2">Name</th>
//             <th className="border px-4 py-2">Type</th>
//             <th className="border px-4 py-2">City</th>
//             <th className="border px-4 py-2">State</th>
//             <th className="border px-4 py-2">Zip</th>
//             <th className="border px-4 py-2">Account Mgr.</th>
//             <th className="border px-4 py-2">Billed Balance</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredClients.length > 0 ? (
//             filteredClients
//               .slice((currentPage - 1) * pageSize, currentPage * pageSize)
//               .map((client, index) => (
//                 <tr key={index}>
//                   <td className="border px-4 py-2">{client.id}</td>
//                   <td className="border px-4 py-2">{client.clientName}</td>
//                   <td className="border px-4 py-2">{client.clientType}</td>
//                   <td className="border px-4 py-2">{client.city}</td>
//                   <td className="border px-4 py-2">{client.state}</td>
//                   <td className="border px-4 py-2">{client.zip}</td>
//                   <td className="border px-4 py-2">{client.accountManager}</td>
//                   <td className="border px-4 py-2">{client.billedBalance}</td>
//                 </tr>
//               ))
//           ) : (
//             <tr>
//               <td colSpan="8" className="border px-4 py-4 text-center">
//                 No clients match this search.{" "}
//                 <a href="/add-client" className="text-blue-800">
//                   Create a new client?
//                 </a>
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>

//       <div className="flex justify-between items-center">
//         <div>
//           <label htmlFor="pageSize" className="mr-2">
//             Page Size:
//           </label>
//           <select
//             id="pageSize"
//             value={pageSize}
//             onChange={handlePageSizeChange}
//             className="border border-gray-300 p-2 rounded"
//           >
//             <option value="5">5</option>
//             <option value="10">10</option>
//             <option value="25">25</option>
//             <option value="50">50</option>
//           </select>
//         </div>

//         <div className="flex items-center">
//           <button
//             onClick={handlePrevPage}
//             disabled={currentPage === 1}
//             className="border px-4 py-2 rounded-l bg-gray-200 disabled:opacity-50"
//           >
//             Prev
//           </button>
//           <span className="px-4 py-2">{currentPage}</span>
//           <button
//             onClick={handleNextPage}
//             disabled={currentPage === Math.ceil(filteredClients.length / pageSize)}
//             className="border px-4 py-2 rounded-r bg-gray-200 disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ClientList;




























// import Loader from "@/components/loader";
// import { authSelector } from "@/redux/auth/authSlice";
// import { getClientsThunk } from "@/redux/client/clientThunk";
// import { Search } from "lucide-react";
// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";

// const ClientList = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [pageSize, setPageSize] = useState(10);
//   const [clients, setClients] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const { userInfo } = useSelector(authSelector);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   // Simulated data - You can replace this with your API call data
//   // const clients = []; // Add your client data here

//   useEffect(()=>{
//     setIsLoading(true);
//     dispatch(getClientsThunk({ token: userInfo?.access?.token })).unwrap().then(res => {
//       console.log(res, "===res:getClientsThunk");
//       setClients(res);
//       setIsLoading(false);
//     }).catch(err => {
//       setClients([]);
//       setIsLoading(false);
//       console.log(err, "===err:getClientsThunk");
//     })
//   }, [])

//   const handleSearch = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   const handlePageSizeChange = (e) => {
//     setPageSize(e.target.value);
//   };

//   const filteredClients = clients?.filter(
//     (client) =>
//       client?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
//       client?.city?.toLowerCase()?.includes(searchTerm?.toLowerCase())
//   );

//   const handlePrevPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   const handleNextPage = () => {
//     if (currentPage < Math.ceil(filteredClients?.length / pageSize)) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   if(isLoading){
//     return <Loader />
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <div className="flex justify-between mb-4">
//         <h1 className="text-2xl font-semibold">Clients</h1>
//         <div>
//           <button className="bg-[#002147] text-white px-4 py-2 rounded mr-2" onClick={()=>navigate("/add-client")}>
//             Add Client
//           </button>
//           <button className="bg-[#002147] text-white px-4 py-2 rounded">
//             Manage Contacts
//           </button>
//         </div>
//       </div>

//       <div className="flex justify-between mb-4">
//         <div className="relative">
//           <input
//             type="text"
//             placeholder="Search"
//             value={searchTerm}
//             onChange={handleSearch}
//             className="border border-gray-300 p-2 rounded w-64 pr-10"
//           />
//           <Search className="absolute top-2 right-3" />
//         </div>

//         {/* <button className="text-[#002147] font-semibold">
//           <svg
//             className="inline-block mr-1"
//             xmlns="http://www.w3.org/2000/svg"
//             viewBox="0 0 20 20"
//             fill="currentColor"
//             width="20"
//             height="20"
//           >
//             <path
//               fillRule="evenodd"
//               d="M3 4.5A1.5 1.5 0 014.5 3h11A1.5 1.5 0 0117 4.5v11a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 013 15.5v-11zm1.5.5v10h11V5h-11zM8 8.5h4V10H8V8.5z"
//               clipRule="evenodd"
//             />
//           </svg>
//           Show Filters
//         </button> */}
//       </div>

//       <table className="table-auto w-full mb-4">
//         <thead>
//           <tr className="bg-gray-100">
//             <th className="border px-4 py-2">Id</th>
//             <th className="border px-4 py-2">Name</th>
//             <th className="border px-4 py-2">Type</th>
//             <th className="border px-4 py-2">City</th>
//             <th className="border px-4 py-2">State</th>
//             <th className="border px-4 py-2">Zip</th>
//             <th className="border px-4 py-2">Account Mgr.</th>
//             <th className="border px-4 py-2">Billed Balance</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredClients.length > 0 ? (
//             filteredClients
//               .slice((currentPage - 1) * pageSize, currentPage * pageSize)
//               .map((client, index) => (
//                 <tr key={index}>
//                   <td className="border px-4 py-2">{client.id}</td>
//                   <td className="border px-4 py-2">{client.name}</td>
//                   <td className="border px-4 py-2">{client.type}</td>
//                   <td className="border px-4 py-2">{client.city}</td>
//                   <td className="border px-4 py-2">{client.state}</td>
//                   <td className="border px-4 py-2">{client.zip}</td>
//                   <td className="border px-4 py-2">{client.accountManager}</td>
//                   <td className="border px-4 py-2">{client.billedBalance}</td>
//                 </tr>
//               ))
//           ) : (
//             <tr>
//               <td colSpan="8" className="border px-4 py-4 text-center">
//                 No clients match this search.{" "}
//                 <a href="/add-client" className="text-blue-800">
//                   Create a new client?
//                 </a>
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>

//       <div className="flex justify-between items-center">
//         <div>
//           <label htmlFor="pageSize" className="mr-2">
//             Page Size:
//           </label>
//           <select
//             id="pageSize"
//             value={pageSize}
//             onChange={handlePageSizeChange}
//             className="border border-gray-300 p-2 rounded"
//           >
//             <option value="5">5</option>
//             <option value="10">10</option>
//             <option value="25">25</option>
//             <option value="50">50</option>
//           </select>
//         </div>

//         <div className="flex items-center">
//           <button
//             onClick={handlePrevPage}
//             disabled={currentPage === 1}
//             className="border px-4 py-2 rounded-l bg-gray-200 disabled:opacity-50"
//           >
//             Prev
//           </button>
//           <span className="px-4 py-2">{currentPage}</span>
//           <button
//             onClick={handleNextPage}
//             disabled={currentPage === Math.ceil(filteredClients.length / pageSize)}
//             className="border px-4 py-2 rounded-r bg-gray-200 disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ClientList;

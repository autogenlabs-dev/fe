import "./App.css";
import MainRouter from "./routes/route";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <MainRouter />
      <ToastContainer />
    </>
  );
}

export default App;

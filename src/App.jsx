import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PrimeReactProvider } from "primereact/api";
import { RecoilRoot } from "recoil";
import "./App.css";
import Home from "./components/Home";
import Question from "./components/Question";
import Navbar from "./pages/Navbar";
import Edit from "./pages/Edit";
import Auth from "./pages/Auth";
import { ToastContainer, toast } from "react-toastify";
import Authority from "./pages/Authority";
import CheckQuestion from "./pages/CheckQuestion";
import Referance from "./pages/referance";
import Logout from "./pages/Logout"; 

function App() {
  return (
    <PrimeReactProvider>
      <RecoilRoot>
        <Router>
          <Navbar />
          <ToastContainer />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/user/auth" element={<Auth />} />
            <Route path="/user/createuser" element={<Authority />} />
            <Route path="/question" element={<Question />} />
            <Route path="/question/approved" element={<CheckQuestion />} />
            <Route path="/question/edit/:id" element={<Edit />} />
            <Route path="/question/referance" element={<Referance />} />
            <Route path="/logout" element={<Logout />} />
          </Routes>
        </Router>
      </RecoilRoot>
    </PrimeReactProvider>
  );
}

export default App;
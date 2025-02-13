import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { PrimeReactProvider } from 'primereact/api';
import { RecoilRoot } from 'recoil';
import './App.css'
import Home from "./components/Home";
import Question from "./components/Question";
import Navbar from "./pages/Navbar";
import Edit from "./pages/Edit";

function App() {

  return (
    <PrimeReactProvider>
    <Router>
      <div>
        <Navbar/>
        <RecoilRoot>
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/question" element={<Question />} />
            <Route path="/question/edit" element={<Edit />} />
          </Routes>
        </RecoilRoot>
      </div>
    </Router>
    </PrimeReactProvider>
  );
}

export default App

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PrimeReactProvider } from "primereact/api";
import { RecoilRoot } from "recoil";
import "./App.css";
import Home from "./components/Home";
import Question from "./components/Question";
import Navbar from "./pages/Navbar";
import Edit from "./pages/Edit";

function App() {
  return (
    <PrimeReactProvider>
      <RecoilRoot>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/question" element={<Question />} />
            <Route path="/question/edit/:id" element={<Edit />} />
          </Routes>
        </Router>
      </RecoilRoot>
    </PrimeReactProvider>
  );
}

export default App;
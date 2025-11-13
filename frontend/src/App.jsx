import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import Wip from "./pages/WIP.jsx";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/wip" element={<Wip />} />
        </Routes>
    );
}

export default App;
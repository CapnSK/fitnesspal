import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Home from "./components/Home/home";


const RoutesComponent = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/home"/>}></Route>
                <Route path="/home" element={<Home />}></Route>
            </Routes>
        </BrowserRouter>
    );
}

export default RoutesComponent;
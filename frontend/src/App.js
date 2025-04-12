import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./pages/Home";
import DaftarPelanggan from "./pages/DaftarPelanggan";
import Chasier from "./pages/Chasier";
import DaftarPenjualan from "./pages/DaftarPenjualan";
import PerawatanPage from "./pages/PerawatanPage";
import DaftarBooking from "./pages/DaftarBooking";
import Inventory from "./pages/Inventory";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/daftarpelanggan" element={<DaftarPelanggan />} />
          <Route path="/chasier" element={<Chasier />} />
          <Route path="/daftarpenjualan" element={<DaftarPenjualan />} />
          <Route path="/perawatan" element={<PerawatanPage />} />
          <Route path="/booking" element={<DaftarBooking />} />
          <Route path="/gudang" element={<Inventory />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;

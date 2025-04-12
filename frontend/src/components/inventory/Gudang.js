import { useState } from "react";
import { Tabs, Tab, Container, Card } from "react-bootstrap";
import ListPembelian from "./ListPembelian";
import ListBarang from "./ListBarang";
import ListBarangKeluar from "./ListBarangKeluar";

const Gudang = () => {
  const [key, setKey] = useState("barang");

  const tabStyle = (active) => ({
    color: active ? "#0d6efd" : "black",
    fontWeight: active ? "600" : "normal",
    borderBottom: active ? "2px solid #0d6efd" : "none",
    backgroundColor: "transparent",
  });

  return (
    <Container fluid className="px-2">
      <Card className="mt-3 mb-4 p-3 shadow-sm">
        <div className="nav nav-tabs mb-3">
          <div
            className="nav-link"
            style={tabStyle(key === "barang")}
            onClick={() => setKey("barang")}
          >
            Barang
          </div>
          <div
            className="nav-link"
            style={tabStyle(key === "pembelian")}
            onClick={() => setKey("pembelian")}
          >
            Pembelian
          </div>
          <div
            className="nav-link"
            style={tabStyle(key === "barangKeluar")}
            onClick={() => setKey("barangKeluar")}
          >
            Barang Keluar
          </div>
        </div>

        {key === "barang" && <ListBarang />}
        {key === "pembelian" && <ListPembelian />}
        {key === "barangKeluar" && <ListBarangKeluar />}
      </Card>
    </Container>
  );
};

export default Gudang;

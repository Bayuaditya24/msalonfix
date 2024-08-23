import Navigation from "../components/Navigation";
import ListPenjualan from "../components/kasir/ListPenjualan";
import { Link } from "react-router-dom";
import { IoHome } from "react-icons/io5";
import { Col } from "react-bootstrap";

const DaftarPenjualan = () => {
  return (
    <>
      <Navigation />
      <Col
        className="mb-3 p-2 card d-block"
        style={{ background: "white", color: "grey" }}
      >
        <small className="m-1">
          <Link style={{ textDecoration: "none", color: "grey" }} to={"/"}>
            <IoHome className="mb-1" /> Home /
          </Link>
        </small>
        <small className="m-1">Daftar Penjualan</small>
      </Col>
      <ListPenjualan />
    </>
  );
};

export default DaftarPenjualan;

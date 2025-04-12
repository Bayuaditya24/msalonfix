import Navigation from "../components/Navigation";
import { Link } from "react-router-dom";
import { IoHome } from "react-icons/io5";
import { Col } from "react-bootstrap";
// Assuming this is the correct path for your ListPembelian component
import Gudang from "../components/inventory/Gudang";

const Inventory = () => {
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
        <small className="m-1">Inventory</small>
      </Col>
      <Gudang />
    </>
  );
};

export default Inventory;

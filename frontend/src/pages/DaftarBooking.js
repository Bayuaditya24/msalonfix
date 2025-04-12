import Navigation from "../components/Navigation";
import { Link } from "react-router-dom";
import { IoHome } from "react-icons/io5";
import { Col } from "react-bootstrap";
import ListBooking from "../components/booking/ListBooking";

const DaftarBooking = () => {
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
        <small className="m-1">Daftar Booking</small>
      </Col>
      <ListBooking />
    </>
  );
};

export default DaftarBooking;

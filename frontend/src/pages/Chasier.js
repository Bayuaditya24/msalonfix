import { Container, Col, Row, Card } from "react-bootstrap";
import Navigation from "../components/Navigation";
import Pembayaran from "../components/kasir/Pembayaran";
import { Link } from "react-router-dom";
import { IoHome } from "react-icons/io5";
import logobeaty from "../image/logobeaty.png";

const Chasier = () => {
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
        <small className="m-1">Pembayaran</small>
      </Col>

      <Container fluid>
        <Pembayaran logobeaty={logobeaty} />
      </Container>
    </>
  );
};
export default Chasier;

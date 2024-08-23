import { Container, Col, Row, Card } from "react-bootstrap";
import Navigation from "../components/Navigation";
import { Link } from "react-router-dom";
import { IoHome } from "react-icons/io5";
import ListCategory from "../components/perawatan/ListCategory";

const PerawatanPage = () => {
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
        <small className="m-1">Perawatan</small>
      </Col>

      <Container fluid>
        <ListCategory />
      </Container>
    </>
  );
};
export default PerawatanPage;

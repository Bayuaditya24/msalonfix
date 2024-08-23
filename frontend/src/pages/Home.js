import { Button, Card, CardBody, Col, Container, Row } from "react-bootstrap";
import Navigation from "../components/Navigation";
import { Link } from "react-router-dom";
import { IoHome } from "react-icons/io5";
import logobeaty from "../image/logobeaty.png";

const Home = () => {
  return (
    <>
      <Navigation />
      <Col
        className="mb-3 p-2 card d-block"
        style={{ background: "white", color: "grey" }}
      >
        <small className="m-1">
          <Link style={{ textDecoration: "none", color: "grey" }} to={"/"}>
            <IoHome className="mb-1" /> Home
          </Link>
        </small>
      </Col>
      <Container style={{ marginTop: "60px" }}>
        <Card className="p-4 table-responsive">
          <Col>
            <Card className="p-2">
              <div className="text-center">
                <img
                  src={logobeaty}
                  style={{ width: "600px", height: "150px" }}
                ></img>
              </div>
            </Card>
          </Col>
        </Card>
      </Container>
      <Container className="mt-3 text-center">
        <small style={{ color: "grey" }}>
          Jalan Raya By Pass Dharma Giri. Gianyar, Bali
        </small>
      </Container>
    </>
  );
};
export default Home;

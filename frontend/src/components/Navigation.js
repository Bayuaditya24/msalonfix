import {
  Navbar,
  Container,
  Nav,
  NavLink,
  Image,
  FigureImage,
  Badge,
} from "react-bootstrap";
import { IoHomeOutline } from "react-icons/io5";
import { BsCart4 } from "react-icons/bs";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaList } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { BsFillPersonLinesFill } from "react-icons/bs";
import logosputih from "../image/logosputih.png";
import { FaHandHoldingHeart } from "react-icons/fa6";

function Navigation() {
  const navigate = useNavigate();
  return (
    <>
      <Navbar
        sticky="top"
        expand="lg"
        className="bg-body-tertiary fw-bold"
        bg="dark"
        data-bs-theme="dark"
      >
        <Container fluid>
          <Navbar.Brand href="#">
            <Badge
              bg="#d4b64c"
              className="text-wrap mb-1"
              style={{ background: "#d4b64c" }}
            >
              MSalon
            </Badge>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto gap-3 fs-6">
              <Nav.Link onClick={() => navigate("/")}>
                <IoHomeOutline className="mb-1" /> Home
              </Nav.Link>
              <Nav.Link onClick={() => navigate("/perawatan")}>
                <FaHandHoldingHeart className="mb-1" /> Perawatan
              </Nav.Link>
              <Nav.Link onClick={() => navigate("/daftarpelanggan")}>
                <BsFillPersonLinesFill className="mb-1" /> Pelanggan
              </Nav.Link>
              <Nav.Link onClick={() => navigate("/chasier")}>
                <BsCart4 className="mb-1" /> Kasir
              </Nav.Link>
              <Nav.Link onClick={() => navigate("/daftarpenjualan")}>
                <FaList className="mb-1" /> Penjualan
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default Navigation;

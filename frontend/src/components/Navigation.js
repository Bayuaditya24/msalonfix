import { Navbar, Container, Nav, Button, Badge } from "react-bootstrap";
import { IoHomeOutline } from "react-icons/io5";
import { BsCart4, BsFillPersonLinesFill } from "react-icons/bs";
import {
  FaList,
  FaHandHoldingHeart,
  FaAddressBook,
  FaAddressCard,
} from "react-icons/fa";
import { MdInventory } from "react-icons/md";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

function Navigation({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const menuItems = [
    { label: "Home", icon: <IoHomeOutline className="me-2 mb-1" />, path: "/" },
    {
      label: "Perawatan",
      icon: <FaHandHoldingHeart className="me-2 mb-1" />,
      path: "/perawatan",
    },
    {
      label: "Pelanggan",
      icon: <BsFillPersonLinesFill className="me-2 mb-1" />,
      path: "/daftarpelanggan",
    },
    {
      label: "Kasir",
      icon: <BsCart4 className="me-2 mb-1" />,
      path: "/chasier",
    },
    {
      label: "Penjualan",
      icon: <FaList className="me-2 mb-1" />,
      path: "/daftarpenjualan",
    },
    {
      label: "Booking",
      icon: <FaAddressBook className="me-2 mb-1" />,
      path: "/booking",
    },
    {
      label: "Inventory",
      icon: <MdInventory className="me-2 mb-1" />,
      path: "/gudang",
    },
    {
      label: "Member",
      icon: <FaAddressCard className="me-2 mb-1" />,
      path: "/member",
    },
  ];

  const styles = {
    layout: {
      display: "flex",
      position: "relative",
    },
    sidebar: {
      position: "fixed",
      top: "48px",
      bottom: 0,
      left: 0,
      width: sidebarOpen ? "220px" : "0",
      backgroundColor: "#343a40",
      color: "#fff",
      overflowY: "auto",
      transition: "width 0.3s ease",
      whiteSpace: "nowrap",
      zIndex: 1020,
    },
    navLink: (active) => ({
      color: active ? "#d4b64c" : "#fff",
      padding: "10px 15px",
      display: "flex",
      alignItems: "center",
      textDecoration: "none",
      cursor: "pointer",
      fontWeight: active ? "bold" : "normal",
      backgroundColor: active ? "#212529" : "transparent",
      transition: "background-color 0.2s",
    }),
    // ⬇️ MAIN sekarang menjadi fungsi
    main: (sidebarOpen) => ({
      flex: 1,
      marginLeft: sidebarOpen ? "220px" : "0",
      transition: "margin-left 0.3s ease",
      padding: "0",
      marginTop: "48px",
      minHeight: "100vh",
      backgroundColor: "#f8f9fa",
      overflowX: "hidden",
      position: "relative",
    }),
  };

  return (
    <>
      {/* Navbar */}
      <Navbar
        bg="dark"
        variant="dark"
        fixed="top"
        style={{ height: "48px", padding: "0 1rem" }} // Navbar sedikit lebih kecil
      >
        <Container fluid className="p-0">
          {/* Tombol dan Brand berdampingan */}
          <div className="d-flex align-items-center">
            <Navbar.Brand
              className="mb-0"
              style={{
                background: "#d4b64c",
                color: "white",
                padding: "2px 10px",
                borderRadius: "4px",
                fontWeight: "bold",
                fontSize: "1rem",
              }}
            >
              MSalon
            </Navbar.Brand>
            <Button
              variant="outline-light"
              onClick={toggleSidebar}
              className="me-2"
              style={{
                fontSize: "1rem",
                padding: "2px 8px",
                marginLeft: "90px",
              }}
            >
              &#9776;
            </Button>
          </div>
        </Container>
      </Navbar>

      {/* Sidebar + Main layout */}
      <div style={styles.layout}>
        {/* Sidebar */}
        <div style={styles.sidebar}>
          <Nav className="flex-column mt-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;

              return (
                <span
                  key={item.path}
                  style={styles.navLink(isActive)}
                  onClick={() => navigate(item.path)}
                  onMouseEnter={(e) => {
                    if (!isActive)
                      e.currentTarget.style.backgroundColor = "#495057";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive)
                      e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  {item.icon}
                  {item.label}
                </span>
              );
            })}
          </Nav>
        </div>

        {/* Main content */}
        <div style={styles.main(sidebarOpen)}>{children}</div>
      </div>
    </>
  );
}

export default Navigation;

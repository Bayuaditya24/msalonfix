import React, { useState, useEffect } from "react";
import {
  Form,
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Table,
  FormControl,
  InputGroup,
  Nav,
  Pagination,
  Spinner,
} from "react-bootstrap";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { IoSearchOutline } from "react-icons/io5";
import Tab from "react-bootstrap/Tab";
import numberWithCommas from "../../utils/utils";

function ListCategory() {
  const [categories, setCategories] = useState([]);
  const [perawatan, setPerawatan] = useState([]);
  const [filteredPerawatan, setFilteredPerawatan] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(1); // Default to ID 1
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [showAllPerawatan, setShowAllPerawatan] = useState(false); // Track checkbox state
  const itemsPerPage = 10;

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      handleCategoryChange(selectedCategory);
    }
  }, [selectedCategory]);

  useEffect(() => {
    filterPerawatan();
  }, [perawatan, searchTerm]);

  const getCategories = async () => {
    try {
      const response = await axios.get("http://localhost:5000/category");
      setCategories(response.data);
      if (response.data.length > 0) {
        setSelectedCategory(response.data[0].id); // Set default category ID if available
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleCategoryChange = async (categoryId) => {
    setSelectedCategory(categoryId);
    setShowAllPerawatan(false); // Uncheck "All Perawatan" when changing category
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/perawatan/category/${categoryId}`
      );
      setPerawatan(response.data);
    } catch (error) {
      console.error("Error fetching perawatan:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filterPerawatan = () => {
    if (searchTerm === "") {
      setFilteredPerawatan(perawatan);
    } else {
      setFilteredPerawatan(
        perawatan.filter((item) =>
          item.namaPerawatan.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    setPage(1); // Reset to first page when filtering
  };

  const handleAllPerawatanChange = async (e) => {
    const isChecked = e.target.checked;
    setShowAllPerawatan(isChecked); // Update checkbox state

    setLoading(true);
    try {
      if (isChecked) {
        const response = await axios.get("http://localhost:5000/perawatan");
        setPerawatan(response.data);
        setSelectedCategory(null); // Reset category selection
      } else {
        // Re-fetch perawatan for the selected category if any
        if (selectedCategory) {
          const response = await axios.get(
            `http://localhost:5000/perawatan/category/${selectedCategory}`
          );
          setPerawatan(response.data);
        } else {
          setPerawatan([]);
        }
      }
    } catch (error) {
      console.error("Error fetching perawatan:", error);
    } finally {
      setLoading(false);
    }
  };

  const paginatedPerawatan = filteredPerawatan.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const totalPages = Math.ceil(filteredPerawatan.length / itemsPerPage);

  return (
    <>
      <Container fluid>
        <Card>
          <CardBody>
            <Tab.Container
              id="left-tabs-example"
              defaultActiveKey={selectedCategory}
            >
              <Row style={{ marginBottom: "80px" }}>
                <Col>
                  <Nav className="justify-content-center gap-5 fw-bold">
                    {categories.map((kategori) => (
                      <Nav.Item key={kategori.id}>
                        <Nav.Link
                          eventKey={kategori.id}
                          onClick={() => handleCategoryChange(kategori.id)}
                          style={{
                            color:
                              selectedCategory === kategori.id
                                ? "blue"
                                : "black",
                            fontWeight: "bold",
                            borderBottom:
                              selectedCategory === kategori.id
                                ? "2px solid blue"
                                : "none",
                          }}
                        >
                          {kategori.categoryPerawatan}
                        </Nav.Link>
                      </Nav.Item>
                    ))}
                  </Nav>
                </Col>
              </Row>
            </Tab.Container>

            <Row className="mb-3">
              <Col className="col-sm-3">
                <InputGroup>
                  <InputGroup.Text id="basic-addon1">
                    <IoSearchOutline />
                  </InputGroup.Text>
                  <FormControl
                    type="text"
                    placeholder="Search"
                    aria-describedby="basic-addon1"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                </InputGroup>
              </Col>
              <Col>
                <Form.Check
                  className="mt-2 d-flex gap-2"
                  type="checkbox"
                  label="All Perawatan"
                  checked={showAllPerawatan} // Controlled checkbox
                  onChange={handleAllPerawatanChange}
                />
              </Col>
            </Row>

            {loading ? (
              <div className="text-center">
                <Spinner animation="border" role="status" />
                <span className="ms-2">Loading...</span>
              </div>
            ) : (
              <>
                <Table striped responsive size="sm" className="mt-3 mb-5">
                  <thead>
                    <tr>
                      <th scope="col">No</th>
                      <th scope="col">Nama Perawatan</th>
                      <th scope="col">Harga</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedPerawatan.map((item, index) => (
                      <tr key={item.id}>
                        <td>{(page - 1) * itemsPerPage + index + 1}</td>
                        <td>{item.namaPerawatan}</td>
                        <td>Rp {numberWithCommas(item.harga)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

                <Pagination>
                  {[...Array(totalPages).keys()].map((number) => (
                    <Pagination.Item
                      key={number + 1}
                      active={number + 1 === page}
                      onClick={() => handlePageChange(number + 1)}
                    >
                      {number + 1}
                    </Pagination.Item>
                  ))}
                </Pagination>
              </>
            )}
          </CardBody>
        </Card>
      </Container>
    </>
  );
}

export default ListCategory;

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
  Modal,
  Button,
} from "react-bootstrap";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { IoSearchOutline } from "react-icons/io5";
import Tab from "react-bootstrap/Tab";
import numberWithCommas from "../../utils/utils";
import Select from "react-select";
import { FaPlus } from "react-icons/fa6";

function ListCategory() {
  const [categories, setCategories] = useState([]);
  const [perawatan, setPerawatan] = useState([]);
  const [filteredPerawatan, setFilteredPerawatan] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [showAllPerawatan, setShowAllPerawatan] = useState(false);
  const itemsPerPage = 10;
  const [showModal, setShowModal] = useState(false);
  const [newPerawatan, setNewPerawatan] = useState({
    namaPerawatan: "",
    kategori: "",
    harga: "",
  });

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:5000/perawatan", {
        namaPerawatan: newPerawatan.namaPerawatan,
        harga: parseFloat(newPerawatan.harga), // Ensure harga is a number
        kategori: newPerawatan.kategori, // This should be the category ID
      });

      // Optionally, you can refetch perawatan here to update the displayed list
      handleCategoryChange(selectedCategory); // Re-fetch data for the current category
      setShowModal(false); // Close the modal
      setNewPerawatan({ namaPerawatan: "", kategori: "", harga: "" }); // Reset form
    } catch (error) {
      console.error("Error adding new perawatan:", error);
      alert("Failed to add new perawatan. Please try again.");
    }
  };

  const categoryOptions = categories.map((kategori) => ({
    value: kategori.id,
    label: kategori.categoryPerawatan,
  }));

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
            <Row className="mt-3 mb-3">
              <Col>
                <Button variant="success" onClick={() => setShowModal(true)}>
                  <FaPlus className="mb-1" /> Tambah Perawatan
                </Button>
              </Col>
            </Row>

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
                <Modal show={showModal} onHide={() => setShowModal(false)}>
                  <Modal.Header closeButton>
                    <Modal.Title>Input Perawatan Baru</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form>
                      <Form.Group
                        controlId="formNamaPerawatan"
                        className="mb-3"
                      >
                        <Row>
                          <Col sm={4}>
                            <Form.Label>Nama Perawatan</Form.Label>
                          </Col>
                          <Col sm={8}>
                            <Form.Control
                              type="text"
                              placeholder="Masukkan Nama Perawatan"
                              value={newPerawatan.namaPerawatan}
required
                              onChange={(e) =>
                                setNewPerawatan({
                                  ...newPerawatan,
                                  namaPerawatan: e.target.value,
                                })
                              }
                            />
                          </Col>
                        </Row>
                      </Form.Group>
                      <Form.Group controlId="formKategori" className="mb-3">
                        <Row>
                          <Col sm={4}>
                            <Form.Label>Kategori</Form.Label>
                          </Col>
                          <Col sm={8}>
                            <Select
                              options={categoryOptions}
                              onChange={(selectedOption) =>
                                setNewPerawatan({
                                  ...newPerawatan,
                                  kategori: selectedOption.value, // Set the value from the selected option
                                })
                              }
                              placeholder="Pilih Kategori"
                            />
                          </Col>
                        </Row>
                      </Form.Group>
                      <Form.Group controlId="formHarga" className="mb-3">
                        <Row>
                          <Col sm={4}>
                            <Form.Label>Harga</Form.Label>
                          </Col>
                          <Col sm={8}>
                            <Form.Control
                              type="number"
                              placeholder="Masukkan Harga"
                              value={newPerawatan.harga}
required
                              onChange={(e) =>
                                setNewPerawatan({
                                  ...newPerawatan,
                                  harga: e.target.value,
                                })
                              }
                            />
                          </Col>
                        </Row>
                      </Form.Group>
                    </Form>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      variant="secondary"
                      onClick={() => setShowModal(false)}
                    >
                      Tutup
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                      Simpan
                    </Button>
                  </Modal.Footer>
                </Modal>

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

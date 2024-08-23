import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Table,
  Pagination,
  FormControl,
  Form,
  Spinner,
  InputGroup,
} from "react-bootstrap";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { IoSearchOutline } from "react-icons/io5";

function ListPelanggan() {
  const [pelanggan, setPelanggan] = useState([]);
  const [filteredPelanggan, setFilteredPelanggan] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false); // State for loading

  useEffect(() => {
    getPelanggan();
  }, []);

  useEffect(() => {
    filterPelanggan();
  }, [searchQuery, pelanggan]);

  const getPelanggan = async () => {
    setLoading(true); // Set loading to true before fetching data
    try {
      const response = await axios.get("http://localhost:5000/pelanggan");
      const sortedPelanggan = response.data.sort((a, b) => b.id - a.id); // Sorting by ID descending
      setPelanggan(sortedPelanggan);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Set loading to false after data is fetched or an error occurs
    }
  };

  const filterPelanggan = () => {
    if (searchQuery === "") {
      setFilteredPelanggan(pelanggan);
    } else {
      const lowercasedQuery = searchQuery.toLowerCase();
      const filtered = pelanggan.filter(
        (pelanggan) =>
          pelanggan.namaPelanggan.toLowerCase().includes(lowercasedQuery) ||
          pelanggan.nohp.toLowerCase().includes(lowercasedQuery) ||
          pelanggan.alamat.toLowerCase().includes(lowercasedQuery)
      );
      setFilteredPelanggan(filtered);
    }
  };

  const totalPages = Math.ceil(filteredPelanggan.length / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPelanggan.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  return (
    <>
      <Container fluid>
        <Card>
          <CardBody>
            <Row className="mb-3 ">
              <Col className="col-sm-3">
                <InputGroup>
                  <InputGroup.Text id="basic-addon1">
                    <IoSearchOutline />
                  </InputGroup.Text>
                  <FormControl
                    type="text"
                    placeholder="Cari pelanggan..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    aria-describedby="basic-addon1"
                  />
                </InputGroup>
              </Col>
            </Row>

            {loading ? ( // Show loading spinner while data is being fetched
              <div className="d-flex justify-content-center">
                <Spinner animation="border" />
              </div>
            ) : (
              <>
                <Table striped responsive size="sm" className="mt-3">
                  <thead>
                    <tr>
                      <th scope="col">No</th>
                      <th scope="col">Nama</th>
                      <th scope="col">No Hp</th>
                      <th scope="col">Alamat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.length > 0 ? (
                      currentItems.map((pelanggan, index) => (
                        <tr key={pelanggan.id}>
                          <td>{indexOfFirstItem + index + 1}</td>
                          <td>{pelanggan.namaPelanggan}</td>
                          <td>{pelanggan.nohp}</td>
                          <td>{pelanggan.alamat}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center">
                          No data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
                <Pagination>
                  <Pagination.Prev
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  />
                  {[...Array(totalPages)].map((_, index) => (
                    <Pagination.Item
                      key={index + 1}
                      active={index + 1 === currentPage}
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  />
                </Pagination>
              </>
            )}
          </CardBody>
        </Card>
      </Container>
    </>
  );
}

export default ListPelanggan;

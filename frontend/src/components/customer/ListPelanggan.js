import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Container,
  Row,
  Table,
  Pagination,
  InputGroup,
  FormControl,
  Spinner,
} from "react-bootstrap";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { IoSearchOutline } from "react-icons/io5";

function ListPelanggan() {
  const [pelanggan, setPelanggan] = useState([]);
  const [filteredPelanggan, setFilteredPelanggan] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Set items per page to 5
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getPelanggan();
  }, []);

  useEffect(() => {
    filterPelanggan();
  }, [searchQuery, pelanggan]);

  const getPelanggan = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/pelanggan");
      const sortedPelanggan = response.data.sort((a, b) => b.id - a.id);
      setPelanggan(sortedPelanggan);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
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
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const pagesToShow = 5; // Number of page buttons to display
  const pageNumbersToShow = [];

  // If total pages are greater than 5, show relevant pages
  if (pageNumbers.length > pagesToShow) {
    if (currentPage <= 3) {
      pageNumbersToShow.push(...pageNumbers.slice(0, pagesToShow)); // First 5 pages
    } else if (currentPage >= pageNumbers.length - 2) {
      pageNumbersToShow.push(
        ...pageNumbers.slice(pageNumbers.length - pagesToShow)
      ); // Last 5 pages
    } else {
      pageNumbersToShow.push(
        ...pageNumbers.slice(currentPage - 3, currentPage + 2)
      ); // Show around the current page
    }
  } else {
    // If total pages are 5 or less, show all
    pageNumbersToShow.push(...pageNumbers);
  }

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
    setCurrentPage(1); // Reset to page 1 when search query changes
  };

  return (
    <Container fluid>
      <Card>
        <CardBody>
          <Row className="mb-3">
            <InputGroup className="col-sm-3">
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
          </Row>

          {loading ? (
            <div className="d-flex justify-content-center">
              <Spinner animation="border" />
            </div>
          ) : (
            <>
              <Table striped bordered responsive size="sm" className="mt-3">
                <thead>
                  <tr>
                    <th className="text-center" scope="col">
                      No
                    </th>
                    <th scope="col">Nama</th>
                    <th scope="col">No Hp</th>
                    <th scope="col">Alamat</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length > 0 ? (
                    currentItems.map((pelanggan, index) => (
                      <tr key={pelanggan.id}>
                        <td className="text-center">
                          {indexOfFirstItem + index + 1}
                        </td>
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
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                />
                {pageNumbersToShow.map((number) => (
                  <Pagination.Item
                    key={number}
                    active={number === currentPage}
                    onClick={() => handlePageChange(number)}
                  >
                    {number}
                  </Pagination.Item>
                ))}
                <Pagination.Next
                  disabled={currentPage === pageNumbers.length}
                  onClick={() => handlePageChange(currentPage + 1)}
                />
              </Pagination>
            </>
          )}
        </CardBody>
      </Card>
    </Container>
  );
}

export default ListPelanggan;

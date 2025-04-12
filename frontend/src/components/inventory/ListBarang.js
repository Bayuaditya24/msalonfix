import { useState, useEffect } from "react";
import { Table, Button, Form, Row, Col, Pagination } from "react-bootstrap";
import ModalBarang from "./ModalBarang";
import numberWithCommas from "../../utils/utils";
import { BiEdit } from "react-icons/bi";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { FaRotateRight } from "react-icons/fa6";

const ListBarang = () => {
  const [showModal, setShowModal] = useState(false);
  const [barang, setBarang] = useState([]);
  const [filteredBarang, setFilteredBarang] = useState([]);
  const [editBarang, setEditBarang] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredBarang.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBarang.slice(indexOfFirstItem, indexOfLastItem);

  const visiblePageNumbers = Array.from(
    { length: totalPages },
    (_, i) => i + 1
  ).slice(Math.max(currentPage - 2, 0), Math.min(currentPage + 1, totalPages));

  useEffect(() => {
    fetchBarang();
  }, []);

  const fetchBarang = async () => {
    try {
      const response = await fetch("http://localhost:5000/barang");
      const data = await response.json();
      setBarang(data);
      setFilteredBarang(data); // inisialisasi
    } catch (error) {
      console.error("Error fetching barang:", error);
    }
  };

  const handleShow = () => {
    setEditBarang(null);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    fetchBarang();
  };

  const handleEditBarang = (barangData) => {
    setEditBarang(barangData);
    setShowModal(true);
  };

  const handleDeleteBarang = async (idBarang) => {
    const confirmDelete = window.confirm(
      "Apakah Anda yakin ingin menghapus barang ini?"
    );
    if (confirmDelete) {
      try {
        const response = await fetch(
          `http://localhost:5000/barang/${idBarang}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          fetchBarang();
        } else {
          alert("Terjadi kesalahan saat menghapus barang.");
        }
      } catch (error) {
        console.error("Error deleting barang:", error);
      }
    }
  };

  const handleSearchChange = (e) => {
    const keyword = e.target.value.toLowerCase();
    setSearchTerm(keyword);
    const filtered = barang.filter((item) =>
      item.namaBarang.toLowerCase().includes(keyword)
    );
    setFilteredBarang(filtered);
    setCurrentPage(1); // Reset ke halaman 1 saat search
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="card p-3 text-sm">
      <Row className="mb-3 align-items-center">
        <Col md={3}>
          <Form.Control
            type="text"
            placeholder="Cari nama barang..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </Col>
        <Col
          md={{ span: 3, offset: 6 }}
          className="d-flex justify-content-end gap-2"
        >
          <Button
            variant="primary"
            onClick={fetchBarang}
            style={{ fontSize: "13px", padding: "6px 12px" }}
          >
            <FaRotateRight className="mb-1" /> Refresh
          </Button>
          <Button
            variant="success"
            onClick={handleShow}
            style={{ fontSize: "13px", padding: "6px 12px" }}
          >
            <FaPlus className="mb-1" /> Tambah
          </Button>
        </Col>
      </Row>

      <Table striped size="sm">
        <thead style={{ borderBottom: "solid 1px", borderTop: "solid 1px" }}>
          <tr>
            <th className="text-center">No</th>
            <th>Nama Barang</th>
            <th>Stok</th>
            <th>Harga</th>
            <th className="text-center">Action</th>
          </tr>
        </thead>
        <tbody style={{ borderBottom: "gray" }}>
          {currentItems.map((b, index) => (
            <tr key={b.id_barang}>
              <td className="text-center" style={{ width: "60px" }}>
                {indexOfFirstItem + index + 1}
              </td>
              <td>{b.namaBarang}</td>
              <td>{b.stok}</td>
              <td>Rp. {numberWithCommas(b.harga)}</td>
              <td className="text-center">
                <Button
                  onClick={() => handleEditBarang(b)}
                  style={{
                    border: "none",
                    backgroundColor: "transparent",
                    padding: "2px",
                  }}
                >
                  <BiEdit style={{ color: "blue" }} />
                </Button>
                <Button
                  onClick={() => handleDeleteBarang(b.id_barang)}
                  className="ms-2"
                  style={{
                    border: "none",
                    backgroundColor: "transparent",
                    padding: "2px",
                  }}
                >
                  <FaRegTrashAlt style={{ color: "red" }} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Pagination */}
      <div className="d-flex justify-content-start mt-1">
        <Pagination>
          <Pagination.Prev
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          />
          {visiblePageNumbers.map((number) => (
            <Pagination.Item
              key={number}
              active={number === currentPage}
              onClick={() => handlePageChange(number)}
            >
              {number}
            </Pagination.Item>
          ))}
          <Pagination.Next
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => handlePageChange(currentPage + 1)}
          />
        </Pagination>
      </div>

      {/* Modal Tambah/Edit */}
      <ModalBarang
        show={showModal}
        handleClose={handleClose}
        editBarang={editBarang}
      />
    </div>
  );
};

export default ListBarang;

import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Pagination,
  Container,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import { FaRegTrashAlt, FaSearch } from "react-icons/fa";
import { BiEdit } from "react-icons/bi";
import { FaPlus } from "react-icons/fa6";
import ModalMember from "./ModalMember"; // Komponen modal untuk tambah/edit

const ListMember = () => {
  const [members, setMembers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMember, setEditMember] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const handleShow = () => {
    setEditMember(null);
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  const fetchMembers = async () => {
    try {
      const response = await fetch("http://localhost:5000/member");
      const data = await response.json();

      if (Array.isArray(data)) {
        setMembers(data);
      } else if (Array.isArray(data.data)) {
        setMembers(data.data);
      } else {
        console.error("Format data member tidak sesuai:", data);
        setMembers([]);
      }
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleEditMember = (memberData) => {
    setEditMember(memberData);
    setShowModal(true);
  };

  const handleDeleteMember = async (id_member) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus member ini?")) {
      try {
        const response = await fetch(
          `http://localhost:5000/member/${id_member}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          setMembers(members.filter((m) => m.id_member !== id_member));
        } else {
          alert("Terjadi kesalahan saat menghapus member.");
        }
      } catch (error) {
        console.error("Error deleting member:", error);
      }
    }
  };

  // Filter berdasarkan searchTerm (case insensitive)
  const filteredMembers = members.filter((m) =>
    m.namaMember.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination untuk filteredMembers
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentMembers = filteredMembers.slice(indexOfFirst, indexOfLast);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredMembers.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const visiblePageNumbers = pageNumbers.slice(
    Math.max(0, currentPage - 3),
    Math.min(pageNumbers.length, currentPage + 2)
  );

  // Reset halaman ke 1 jika searchTerm berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <Container fluid>
      <div className="card p-3 text-sm">
        <div className="d-flex justify-content-between mb-3 mt-3 align-items-center">
          {/* Search input */}
          <InputGroup style={{ maxWidth: "300px" }}>
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <FormControl
              placeholder="Cari member..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
          <Button
            variant="success"
            onClick={handleShow}
            style={{ fontSize: "13px", padding: "6px 12px" }}
          >
            <FaPlus className="mb-1" /> Tambah
          </Button>
        </div>

        <Table striped bordered size="sm" className="text-sm">
          <thead className="text-center">
            <tr>
              <th style={{ maxWidth: "10px" }}>No</th>
              <th className="text-start">Nama</th>
              <th className="text-start">Phone</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {currentMembers.length > 0 ? (
              currentMembers.map((m, index) => (
                <tr key={m.id_member}>
                  <td className="text-center">{index + 1 + indexOfFirst}</td>
                  <td>{m.namaMember}</td>
                  <td>{m.phoneMember}</td>
                  <td className="text-center">
                    <Button
                      onClick={() => handleEditMember(m)}
                      style={{
                        border: "none",
                        backgroundColor: "transparent",
                        padding: "2px",
                      }}
                    >
                      <BiEdit style={{ color: "blue" }} />
                    </Button>
                    <Button
                      onClick={() => handleDeleteMember(m.id_member)}
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
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center">
                  Data member tidak ditemukan
                </td>
              </tr>
            )}
          </tbody>
        </Table>

        {/* Pagination */}
        <Pagination>
          <Pagination.Prev
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          />
          {pageNumbers.map((number) => (
            <Pagination.Item
              key={number}
              active={number === currentPage}
              onClick={() => setCurrentPage(number)}
            >
              {number}
            </Pagination.Item>
          ))}
          <Pagination.Next
            disabled={currentPage === pageNumbers.length}
            onClick={() => setCurrentPage(currentPage + 1)}
          />
        </Pagination>

        <ModalMember
          show={showModal}
          handleClose={handleClose}
          editMember={editMember}
          refreshMembers={fetchMembers}
        />
      </div>
    </Container>
  );
};

export default ListMember;

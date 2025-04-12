import { useState, useEffect } from "react";
import { Table, Button, Pagination, Container } from "react-bootstrap";
import ModalBooking from "./ModalBooking";
import { FaRegTrashAlt } from "react-icons/fa";
import { BiEdit } from "react-icons/bi";
import { FaPlus } from "react-icons/fa6";

const ListBooking = () => {
  const [showModal, setShowModal] = useState(false);
  const [booking, setBooking] = useState([]);
  const [editBooking, setEditBooking] = useState(null);
  const [allPeriode, setAllPeriode] = useState(false);
  const [tanggalDari, setTanggalDari] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [tanggalSampai, setTanggalSampai] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Number of items to display per page

  const handleShow = () => {
    setEditBooking(null); // Reset editBooking saat membuka modal untuk menambah booking baru
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await fetch("http://localhost:5000/booking");
        const data = await response.json();

        let filteredData = data;

        // Hanya filter berdasarkan tanggal jika All Periode tidak dicentang
        if (!allPeriode) {
          filteredData = data.filter((b) => {
            const bookingDate = new Date(b.tanggal);
            const fromDate = tanggalDari ? new Date(tanggalDari) : null;
            const toDate = tanggalSampai ? new Date(tanggalSampai) : null;

            if (fromDate && bookingDate < fromDate) return false;
            if (toDate && bookingDate > toDate) return false;

            return true;
          });
        }

        setBooking(filteredData);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBooking();
  }, [tanggalDari, tanggalSampai, allPeriode]); // Re-fetch data ketika tanggal atau checkbox berubah

  const refreshBooking = () => {
    const fetchBooking = async () => {
      try {
        const response = await fetch("http://localhost:5000/booking");
        const data = await response.json();
        // Filter berdasarkan tanggal
        const filteredData = data.filter((b) => {
          const bookingDate = new Date(b.tanggal);
          const fromDate = tanggalDari ? new Date(tanggalDari) : null;
          const toDate = tanggalSampai ? new Date(tanggalSampai) : null;

          if (fromDate && bookingDate < fromDate) return false;
          if (toDate && bookingDate > toDate) return false;

          return true;
        });
        setBooking(filteredData);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };
    fetchBooking();
  };

  const handleEditBooking = (bookingData) => {
    setEditBooking(bookingData); // Set data booking untuk edit
    setShowModal(true); // Tampilkan modal untuk edit
  };

  const handleDeleteBooking = async (idBooking) => {
    const confirmDelete = window.confirm(
      "Apakah Anda yakin ingin menghapus booking ini?"
    );
    if (confirmDelete) {
      try {
        const response = await fetch(
          `http://localhost:5000/booking/${idBooking}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          setBooking(booking.filter((b) => b.id_booking !== idBooking));
        } else {
          alert("Terjadi kesalahan saat menghapus booking.");
        }
      } catch (error) {
        console.error("Error deleting booking:", error);
      }
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 0:
        return <span className="badge bg-warning">Belum</span>;
      case 1:
        return <span className="badge bg-success">Sudah Bayar</span>;
      case 3:
        return <span className="badge bg-danger">Batal</span>;
      default:
        return <span className="badge bg-secondary">Unknown</span>;
    }
  };

  // Pagination logic
  const indexOfLastBooking = currentPage * itemsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - itemsPerPage;
  const currentBookings = booking.slice(
    indexOfFirstBooking,
    indexOfLastBooking
  );

  // Calculate page numbers
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(booking.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  // Pagination controls (show only 5 pages at a time)
  const maxVisiblePages = 5;
  const visiblePageNumbers = pageNumbers.slice(
    Math.max(0, currentPage - 3), // show 2 previous pages
    Math.min(pageNumbers.length, currentPage + 2) // show 2 next pages
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <Container fluid>
      <div className="card p-3 text-sm">
        <div className="d-flex justify-content-between mb-4 mt-3 align-items-center">
          <div className="d-flex gap-3">
            <div className="d-flex flex-column">
              <input
                type="date"
                value={tanggalDari}
                onChange={(e) => setTanggalDari(e.target.value)}
                className="form-control custom-date-input"
                disabled={allPeriode}
              />
            </div>
            <div className="d-flex flex-column">
              <input
                type="date"
                value={tanggalSampai}
                onChange={(e) => setTanggalSampai(e.target.value)}
                className="form-control custom-date-input"
                disabled={allPeriode}
              />
            </div>
            <div className="form-check mt-1">
              <input
                className="form-check-input"
                type="checkbox"
                checked={allPeriode}
                onChange={(e) => setAllPeriode(e.target.checked)}
                id="allPeriode"
              />
              <label className="form-check-label" htmlFor="allPeriode">
                All Periode
              </label>
            </div>
          </div>

          <Button
            variant="success"
            onClick={handleShow}
            className="ml-3 mt-2"
            style={{ fontSize: "13px", padding: "6px 12px" }} // Ukuran font lebih kecil
          >
            <FaPlus className="mb-1" /> Tambah
          </Button>
        </div>

        <Table striped bordered size="sm">
          <thead className="text-center">
            <tr>
              <th>No</th>
              <th>Nama</th>
              <th>Phone</th>
              <th>Tanggal</th>
              <th>Jam</th>
              <th>Perawatan</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {currentBookings.map((b, index) => (
              <tr key={b.id_booking}>
                <td className="text-center">
                  {index + 1 + indexOfFirstBooking}
                </td>
                <td>{b.nama}</td>
                <td>{b.phone}</td>
                <td className="text-center">
                  {new Date(b.tanggal).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </td>
                <td className="text-center">{b.jam.slice(0, 5)}</td>
                <td>
                  {b.detail_bookings.map((detail, idx) => (
                    <div key={idx}>{detail.namaperawatan}</div>
                  ))}
                </td>
                <td className="text-center">{getStatusBadge(b.status || 0)}</td>
                <td className="text-center">
                  <Button
                    onClick={() => handleEditBooking(b)}
                    style={{
                      border: "none",
                      backgroundColor: "transparent",
                      padding: "2px",
                    }}
                  >
                    <BiEdit style={{ color: "blue" }} />
                  </Button>
                  <Button
                    onClick={() => handleDeleteBooking(b.id_booking)}
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
            disabled={currentPage === pageNumbers.length}
            onClick={() => handlePageChange(currentPage + 1)}
          />
        </Pagination>

        <ModalBooking
          show={showModal}
          handleClose={handleClose}
          editBooking={editBooking}
          refreshBooking={refreshBooking}
        />
      </div>
    </Container>
  );
};

export default ListBooking;

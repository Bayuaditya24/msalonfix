import React, { useEffect, useState } from "react";
import { Table, Button, Pagination, Form, Row, Col } from "react-bootstrap";
import ModalBarangKeluar from "./ModalBarangKeluar";
import { FaPlus, FaRotateRight } from "react-icons/fa6";
import AlertBox from "../AlertBox";
import { BiEdit } from "react-icons/bi";
import { FaRegTrashAlt } from "react-icons/fa";

const ListBarangKeluar = () => {
  const [barangKeluarList, setBarangKeluarList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [editData, setEditData] = useState(null);

  // Filter states
  const [filterNama, setFilterNama] = useState("");
  const [filterDariTanggal, setFilterDariTanggal] = useState("");
  const [filterSampaiTanggal, setFilterSampaiTanggal] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const showAlert = (message, type = "error") => {
    setAlert({ message, type });
    setTimeout(() => setAlert({ message: "", type: "" }), 3000);
  };

  const fetchBarangKeluar = async () => {
    try {
      const res = await fetch("http://localhost:5000/barangkeluar");
      const json = await res.json();

      if (Array.isArray(json)) {
        setBarangKeluarList(
          json.sort((a, b) => a.id_barangkeluar - b.id_barangkeluar)
        );
      } else if (Array.isArray(json.data)) {
        setBarangKeluarList(
          json.data.sort((a, b) => a.id_barangkeluar - b.id_barangkeluar)
        );
      } else {
        setBarangKeluarList([]);
      }
    } catch (err) {
      console.error("Gagal mengambil data barang keluar:", err);
      setBarangKeluarList([]);
    }
  };

  useEffect(() => {
    fetchBarangKeluar();
  }, []);

  const handleShow = (data = null) => {
    setEditData(data);
    setShowModal(true);
  };

  const handleClose = () => {
    setEditData(null);
    setShowModal(false);
    fetchBarangKeluar();
  };

  const handleSubmit = async (newData) => {
    try {
      const isEdit = !!(editData && editData.id_barangkeluar);
      const url = isEdit
        ? `http://localhost:5000/barangkeluar/${editData.id_barangkeluar}`
        : "http://localhost:5000/barangkeluar";

      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      });

      const result = await response.json();

      if (!response.ok) {
        showAlert(result.msg || "Gagal menyimpan barang keluar.");
        return;
      }

      showAlert(
        isEdit
          ? "Barang keluar berhasil diperbarui."
          : "Barang keluar berhasil disimpan.",
        "success"
      );

      fetchBarangKeluar();
      setShowModal(false);
      setEditData(null);
    } catch (error) {
      console.error("Gagal menyimpan:", error);
      showAlert("Terjadi kesalahan saat menyimpan.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus data ini?")) return;
    try {
      const res = await fetch(`http://localhost:5000/barangkeluar/${id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (res.ok) {
        showAlert("Data berhasil dihapus", "success");
        fetchBarangKeluar();
      } else {
        showAlert(result.msg || "Gagal menghapus data.");
      }
    } catch (err) {
      console.error("Gagal menghapus:", err);
      showAlert("Terjadi kesalahan saat menghapus.");
    }
  };

  // Reset filter dan fetch data
  const handleRefresh = () => {
    setFilterNama("");
    setFilterDariTanggal("");
    setFilterSampaiTanggal("");
    fetchBarangKeluar();
  };

  // Filtering berdasarkan nama barang dan tanggal
  const filteredList = barangKeluarList.filter((item) => {
    const items = item.item_barang_keluars || [];

    const namaMatch = items.some((d) =>
      d.barang?.namaBarang?.toLowerCase().includes(filterNama.toLowerCase())
    );

    const tanggal = new Date(item.tanggalKeluar);
    const dari = filterDariTanggal ? new Date(filterDariTanggal) : null;
    const sampai = filterSampaiTanggal ? new Date(filterSampaiTanggal) : null;

    const tanggalMatch =
      (!dari || tanggal >= dari) && (!sampai || tanggal <= sampai);

    return namaMatch && tanggalMatch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredList.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredList.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getVisiblePageNumbers = () => {
    const maxPagesToShow = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(start + maxPagesToShow - 1, totalPages);
    if (end - start < maxPagesToShow - 1) {
      start = Math.max(1, end - maxPagesToShow + 1);
    }
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <>
      <AlertBox
        message={alert.message}
        type={alert.type}
        onClose={() => setAlert({ message: "", type: "" })}
      />

      <div className="card p-3">
        {/* Filter Row */}
        <Row className="mb-3">
          <Col md={8}>
            <Row>
              <Col md={4}>
                <Form.Control
                  size="sm"
                  type="text"
                  placeholder="Cari Nama Barang..."
                  value={filterNama}
                  onChange={(e) => setFilterNama(e.target.value)}
                />
              </Col>
              <Col md={3}>
                <Form.Control
                  size="sm"
                  type="date"
                  value={filterDariTanggal}
                  onChange={(e) => setFilterDariTanggal(e.target.value)}
                />
              </Col>
              <Col md={3}>
                <Form.Control
                  size="sm"
                  type="date"
                  value={filterSampaiTanggal}
                  onChange={(e) => setFilterSampaiTanggal(e.target.value)}
                />
              </Col>
            </Row>
          </Col>

          <Col md={4} className="text-end">
            <Button
              size="sm"
              variant="primary"
              onClick={handleRefresh}
              className="me-2"
            >
              <FaRotateRight /> Refresh
            </Button>
            <Button size="sm" variant="success" onClick={handleShow}>
              <FaPlus className="mb-1" /> Tambah
            </Button>
          </Col>
        </Row>

        <Table striped size="sm" className="text-sm">
          <thead style={{ borderBottom: "solid 1px", borderTop: "solid 1px" }}>
            <tr>
              <th className="text-center">No</th>
              <th>Nama Barang</th>
              <th>Qty Keluar</th>
              <th>Keterangan</th>
              <th>Tanggal Keluar</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((item, index) => {
                const items = item.item_barang_keluars || [];
                const namaBarangList = items.map(
                  (d) => d.barang?.namaBarang || "-"
                );
                const qtyList = items.map((d) => d.quantity);
                const keteranganList = items.map((d) => d.keterangan || "-");

                return (
                  <tr key={item.id_barangkeluar}>
                    <td className="text-center align-top">
                      {indexOfFirstItem + index + 1}
                    </td>
                    <td>
                      {namaBarangList.map((nama, idx) => (
                        <div key={idx}>{nama}</div>
                      ))}
                    </td>
                    <td>
                      {qtyList.map((qty, idx) => (
                        <div key={idx}>{qty}</div>
                      ))}
                    </td>
                    <td>
                      {keteranganList.map((ket, idx) => (
                        <div key={idx}>{ket}</div>
                      ))}
                    </td>
                    <td className="align-top">
                      {new Date(item.tanggalKeluar).toLocaleDateString("id-ID")}
                    </td>
                    <td className="text-center">
                      <Button
                        onClick={() => handleShow(item)}
                        style={{
                          border: "none",
                          backgroundColor: "transparent",
                          padding: "2px",
                        }}
                      >
                        <BiEdit style={{ color: "blue" }} />
                      </Button>
                      <Button
                        onClick={() => handleDelete(item.id_barangkeluar)}
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
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="text-center">
                  Data belum tersedia
                </td>
              </tr>
            )}
          </tbody>
        </Table>

        {/* Pagination */}
        <div className="d-flex justify-content-start mt-1">
          <Pagination>
            <Pagination.Prev
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            />
            {getVisiblePageNumbers().map((number) => (
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

        <ModalBarangKeluar
          show={showModal}
          handleClose={handleClose}
          onSubmit={handleSubmit}
          editData={editData}
        />
      </div>
    </>
  );
};

export default ListBarangKeluar;

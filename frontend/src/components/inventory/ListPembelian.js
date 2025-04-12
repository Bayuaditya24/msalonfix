import { useState, useEffect } from "react";
import { Table, Button, Pagination } from "react-bootstrap";
import numberWithCommas from "../../utils/utils";
import { FaRegTrashAlt } from "react-icons/fa";
import { BiEdit } from "react-icons/bi";
import ModalPembelian from "./ModalPembelian";
import { FaPlus } from "react-icons/fa6";
import { FaRotateRight } from "react-icons/fa6";

const ListPembelian = () => {
  const [showModal, setShowModal] = useState(false);
  const [pembelian, setPembelian] = useState([]);
  const [editPembelian, setEditPembelian] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Atur sesuai kebutuhan

  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const fetchPembelian = async () => {
    try {
      const response = await fetch("http://localhost:5000/pembelian");
      const data = await response.json();
      setPembelian(data);
    } catch (error) {
      console.error("Error fetching purchases:", error);
    }
  };

  useEffect(() => {
    fetchPembelian();
  }, []);

  const handleShow = () => {
    setEditPembelian(null);
    setShowModal(true);
  };

  const handleClose = () => {
    setEditPembelian(null);
    setShowModal(false);
  };

  const calculateTotalHarga = (harga, jumlah) => harga * jumlah;

  const handleEditPembelian = async (pembelianData) => {
    try {
      const response = await fetch(
        `http://localhost:5000/pembelian/${pembelianData.id_pembelian}`
      );
      const data = await response.json();
      setEditPembelian(data);
      setShowModal(true);
    } catch (error) {
      console.error("Gagal mengambil data pembelian untuk edit:", error);
      alert("Gagal mengambil data pembelian. Silakan coba lagi.");
    }
  };

  const handleDeletePembelian = async (idPembelian) => {
    const confirmDelete = window.confirm(
      "Apakah Anda yakin ingin menghapus pembelian ini?"
    );
    if (confirmDelete) {
      try {
        const response = await fetch(
          `http://localhost:5000/pembelian/${idPembelian}`,
          { method: "DELETE" }
        );

        if (response.ok) {
          setPembelian(pembelian.filter((p) => p.id_pembelian !== idPembelian));
        } else {
          alert("Terjadi kesalahan saat menghapus pembelian.");
        }
      } catch (error) {
        console.error("Error deleting purchase:", error);
      }
    }
  };

  // 🔍 Filter berdasarkan nama barang dan tanggal
  const filteredPembelian = pembelian.filter((p) => {
    const namaBarangMatch = p.item_pembelians.some((item) =>
      item.namaBarang?.toLowerCase().includes(search.toLowerCase())
    );

    const tanggal = new Date(p.tanggalPembelian);
    const isAfterFromDate = fromDate ? tanggal >= new Date(fromDate) : true;
    const isBeforeToDate = toDate
      ? tanggal <= new Date(toDate + "T23:59:59")
      : true;

    return namaBarangMatch && isAfterFromDate && isBeforeToDate;
  });

  // 🔃 Group pembelian yang sudah difilter
  const groupedPembelian = filteredPembelian.reduce((acc, curr) => {
    if (!acc[curr.id_pembelian]) {
      acc[curr.id_pembelian] = {
        ...curr,
        item_pembelians: [],
      };
    }
    acc[curr.id_pembelian].item_pembelians = [
      ...acc[curr.id_pembelian].item_pembelians,
      ...curr.item_pembelians,
    ];
    return acc;
  }, {});

  // 💰 Hitung total keseluruhan dari hasil filter
  const grandTotal = Object.values(groupedPembelian).reduce((acc, p) => {
    return (
      acc +
      p.item_pembelians.reduce(
        (itemAcc, item) =>
          itemAcc +
          calculateTotalHarga(item.hargaPembelian, item.quantityPembelian),
        0
      )
    );
  }, 0);

  const formatTanggal = (tanggal) => {
    return new Date(tanggal).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // 📄 Pagination setup
  const pageNumbers = [];
  const totalItems = Object.values(groupedPembelian);
  const totalPages = Math.ceil(totalItems.length / itemsPerPage);

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const visiblePageNumbers = pageNumbers.filter((number) => {
    return (
      number === 1 ||
      number === totalPages ||
      (number >= currentPage - 1 && number <= currentPage + 1)
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = totalItems.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleRefresh = () => {
    setSearch("");
    setFromDate("");
    setToDate("");
    setCurrentPage(1);
    fetchPembelian();
  };

  return (
    <div className="card p-3 text-sm">
      {/* 🔍 Filter dan tombol tambah */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex gap-2">
          <input
            type="text"
            placeholder="Cari nama barang..."
            className="form-control form-control-sm"
            style={{ minWidth: 200 }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <input
            type="date"
            className="form-control form-control-sm"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
          <input
            type="date"
            className="form-control form-control-sm"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>

        {/* Tombol tambah di sebelah kanan */}
        <div className="d-flex gap-2">
          <Button
            variant="primary"
            onClick={handleRefresh}
            className="mt-2"
            style={{ fontSize: "13px", padding: "6px 12px" }}
          >
            <FaRotateRight className="mb-1" /> Refresh
          </Button>
          <Button
            variant="success"
            onClick={handleShow}
            className="mt-2"
            style={{ fontSize: "13px", padding: "6px 12px" }}
          >
            <FaPlus className="mb-1" /> Tambah
          </Button>
        </div>
      </div>

      {/* 📋 Tabel Data */}
      <Table striped size="sm" className="mt-3" style={{ borderBottom: "1px" }}>
        <thead
          style={{
            borderBottom: "1px solid black",
            borderTop: "1px solid black",
          }}
        >
          <tr>
            <th className="text-center">No</th>
            <th>Barang</th>
            <th>Harga</th>
            <th>Qty</th>
            <th>Total Harga</th>
            <th>Grand Total</th>
            <th>Tanggal Pembelian</th>
            <th className="text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((p, index) => {
            return (
              <tr key={p.id_pembelian}>
                <td className="text-center">{indexOfFirstItem + index + 1}</td>
                <td>
                  {p.item_pembelians.map((item, idx) => (
                    <div key={idx}>{item.namaBarang || "N/A"}</div>
                  ))}
                </td>

                <td>
                  {p.item_pembelians.map((item, idx) => (
                    <div key={idx}>
                      Rp.{" "}
                      {numberWithCommas(
                        item.hargaPembelian !== undefined &&
                          item.hargaPembelian !== null
                          ? item.hargaPembelian
                          : 0
                      )}
                    </div>
                  ))}
                </td>
                <td>
                  {p.item_pembelians.map((item, idx) => (
                    <div key={idx}>{item.quantityPembelian || 0}</div>
                  ))}
                </td>
                <td>
                  {p.item_pembelians.map((item, idx) => {
                    const itemTotalHarga = calculateTotalHarga(
                      item.hargaPembelian,
                      item.quantityPembelian
                    );
                    return (
                      <div key={idx}>
                        Rp. {numberWithCommas(itemTotalHarga)}
                      </div>
                    );
                  })}
                </td>
                <td>
                  <div>
                    Rp.{" "}
                    {numberWithCommas(
                      p.item_pembelians.reduce(
                        (acc, item) =>
                          acc +
                          calculateTotalHarga(
                            item.hargaPembelian,
                            item.quantityPembelian
                          ),
                        0
                      )
                    )}
                  </div>
                </td>
                <td>{formatTanggal(p.tanggalPembelian)}</td>
                <td className="text-center" style={{ width: "150px" }}>
                  <Button
                    onClick={() => handleEditPembelian(p)}
                    style={{
                      border: "none",
                      backgroundColor: "transparent",
                      padding: "2px",
                    }}
                  >
                    <BiEdit style={{ color: "blue" }} />
                  </Button>
                  <Button
                    onClick={() => handleDeletePembelian(p.id_pembelian)}
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
          })}
        </tbody>
      </Table>

      {/* 💰 Grand Total */}
      <div className="text-right mt-3 mb-4">
        <strong>Grand Total: Rp {grandTotal.toLocaleString("id-ID")}</strong>
      </div>

      {/* 📄 Pagination */}
      <Pagination>
        <Pagination.Prev
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        />
        {visiblePageNumbers.map((number, idx) => (
          <Pagination.Item
            key={idx}
            active={number === currentPage}
            onClick={() => handlePageChange(number)}
          >
            {number}
          </Pagination.Item>
        ))}
        <Pagination.Next
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        />
      </Pagination>

      <ModalPembelian
        show={showModal}
        handleClose={handleClose}
        editPembelian={editPembelian}
        onSaveSuccess={fetchPembelian}
      />
    </div>
  );
};

export default ListPembelian;

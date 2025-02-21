import React, { useState, useEffect } from "react";
import {
  Form,
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Table,
  Pagination,
  FormControl,
  Spinner,
  Button,
  InputGroup,
} from "react-bootstrap";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import numberWithCommas from "../../utils/utils";
import { IoSearchOutline } from "react-icons/io5";
import { RiFileExcel2Fill } from "react-icons/ri";
import * as XLSX from "xlsx";
import InputGroupText from "react-bootstrap/esm/InputGroupText";
import { SlPrinter } from "react-icons/sl";
import PenjualanTerbanyak from "./PenjualanTerbanyak"; // Import komponen baru
import { FaRegTrashCan } from "react-icons/fa6";
import Swal from "sweetalert2";

function ListPenjualan() {
  const [penjualan, setPenjualan] = useState([]);
  const [filteredPenjualan, setFilteredPenjualan] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [totalCash, setTotalCash] = useState(0);
  const [totalDebit, setTotalDebit] = useState(0);
  const [metodes, setMetodes] = useState([]);
  const pagesToShow = 5;
  const pageNumbersToShow = [];
  const [isPenjualanTerbanyak, setIsPenjualanTerbanyak] = useState(false);
  const [penjualanTerbanyak, setPenjualanTerbanyak] = useState([]);

  useEffect(() => {
    if (isPenjualanTerbanyak) {
      getPenjualanTerbanyak();
    }
  }, [isPenjualanTerbanyak]);

  const getPenjualanTerbanyak = async () => {
    try {
      const response = await axios.get("http://localhost:5000/penjualan");
      setPenjualanTerbanyak(response.data);
    } catch (error) {
      console.error("Error fetching penjualan terbanyak data:", error);
    }
  };

  // Fungsi untuk switch antara penjualan utama dan penjualan terbanyak
  const togglePenjualan = () => {
    setIsPenjualanTerbanyak(!isPenjualanTerbanyak);
  };

  useEffect(() => {
    getPenjualan();
    getMetodes();
  }, []);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setStartDate(today);
    setEndDate(today);
  }, []);

  useEffect(() => {
    filterPenjualan();
  }, [penjualan, startDate, endDate, showAll, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [startDate, endDate, showAll, searchTerm]);

  const getPenjualan = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/penjualan");
      setPenjualan(response.data);
    } catch (error) {
      console.error("Error fetching penjualan data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, namaPelanggan, tanggalTransaction) => {
    // Menampilkan konfirmasi SweetAlert sebelum menghapus
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: `Anda akan menghapus penjualan "${namaPelanggan}" tanggal "${tanggalTransaction}".`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Tidak, batal",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        console.log("Deleting Penjualan with ID:", id); // Cek apakah ID terdeteksi dengan benar
        try {
          const response = await fetch(
            `http://localhost:5000/penjualan/${id}`,
            {
              method: "DELETE",
            }
          );

          if (response.ok) {
            // Tampilkan notifikasi sukses menggunakan SweetAlert
            Swal.fire("Dihapus!", "Penjualan berhasil dihapus.", "success");
            // Perbarui daftar penjualan setelah penghapusan
            setFilteredPenjualan(
              filteredPenjualan.filter((item) => item.id !== id)
            );
          } else {
            // Tampilkan notifikasi gagal menggunakan SweetAlert
            Swal.fire("Gagal", "Gagal menghapus penjualan.", "error");
          }
        } catch (error) {
          console.error("Error:", error);
          Swal.fire("Error", "Terjadi kesalahan, coba lagi nanti.", "error");
        }
      } else {
        // Jika pengguna membatalkan
        Swal.fire("Dibatalkan", "Penghapusan dibatalkan.", "info");
      }
    });
  };

  const getMetodes = async () => {
    try {
      const response = await axios.get("http://localhost:5000/metode");
      setMetodes(response.data);
    } catch (error) {
      console.error("Error fetching metodes data:", error);
    }
  };

  const findMetodeById = (metodeDet) => {
    const metode = metodes.find((metode) => metode.id === metodeDet);
    return metode ? metode.metodeP : null;
  };

  const filterPenjualan = () => {
    let filtered = showAll
      ? penjualan
      : penjualan.filter((penjualandetail) => {
          const transactionDate = new Date(penjualandetail.tanggalTransaction);
          return (
            transactionDate >= new Date(startDate) &&
            transactionDate <= new Date(endDate)
          );
        });

    filtered = filtered.filter((penjualandetail) => {
      return (
        penjualandetail.namaPelanggan
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        penjualandetail.details.some((detail) =>
          detail.perawatanPelanggan
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        )
      );
    });

    filtered.sort(
      (a, b) => new Date(a.tanggalTransaction) - new Date(b.tanggalTransaction)
    );

    let cashTotal = 0;
    let debitTotal = 0;

    filtered.forEach((penjualandetail) => {
      penjualandetail.details.forEach((detail) => {
        const metodeId = findMetodeById(detail.metodeDet);
        if (metodeId === "Cash") {
          cashTotal += parseFloat(detail.totalHarga);
        } else if (metodeId === "Debit / QRIS") {
          debitTotal += parseFloat(detail.totalHarga);
        }
      });
    });

    setTotalCash(cashTotal);
    setTotalDebit(debitTotal);

    setFilteredPenjualan(filtered);
  };

  const formatDate = (dateString) => {
    const options = { day: "numeric", month: "long", year: "numeric" };
    return new Intl.DateTimeFormat("id-ID", options).format(
      new Date(dateString)
    );
  };

  const exportToExcel = () => {
    const wsData = filteredPenjualan.map((penjualandetail) => {
      const perawatanDetails = penjualandetail.details
        .map(
          (detail) =>
            `${detail.perawatanPelanggan} (${
              detail.quantityP
            }x Rp. ${numberWithCommas(detail.totalHarga)})`
        )
        .join(", ");

      return {
        Nama: penjualandetail.namaPelanggan,
        Perawatan_Details: perawatanDetails,
        Grand_Total: `Rp. ${numberWithCommas(
          penjualandetail.details.reduce(
            (sum, detail) => sum + parseFloat(detail.totalHarga),
            0
          )
        )}`,
        Tanggal_Transaksi: formatDate(penjualandetail.tanggalTransaction),
        Metode_Pembayaran: findMetodeById(penjualandetail.details[0].metodeDet),
        Note: penjualandetail.details
          .map((detail) => detail.karyawanNote)
          .filter((note) => note)
          .join(", "),
      };
    });

    const totalRow = [
      {
        Nama: "Total",
        Metode_Pembayaran: `Rp. ${numberWithCommas(totalCash + totalDebit)}`,
        Grand_Total: `Cash: Rp. ${numberWithCommas(
          totalCash
        )}, Debit / QRIS: Rp. ${numberWithCommas(totalDebit)}`,
      },
    ];

    const ws = XLSX.utils.json_to_sheet(wsData);
    const wsTotal = XLSX.utils.json_to_sheet(totalRow, {
      header: ["Nama", "Grand_Total", "Metode_Pembayaran"],
      skipHeader: true,
    });

    XLSX.utils.sheet_add_aoa(ws, [[]], { origin: -1 });
    XLSX.utils.sheet_add_json(ws, totalRow, {
      header: ["Nama", "Grand_Total", "Metode_Pembayaran"],
      skipHeader: true,
      origin: -1,
    });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Penjualan");
    XLSX.writeFile(wb, "Penjualan.xlsx");
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPenjualan.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const printDetail = (penjualandetail) => {
    const content = generatePrintContent(penjualandetail);
    handlePrint(content);
  };

  const formatTime = (date) => {
    // Format waktu menjadi HH:MM:SS
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

 const generatePrintContent = (penjualandetail) => {
    const now = new Date(); // Ambil waktu sekarang
    return `
      <html>
      <head>
        <title>Cetak Detail Penjualan</title>
        <style>
          @page { margin: 0; }
          body { font-family: Arial, sans-serif; font-size: 10px;  margin-left: 20px; }
          .container { width: 100%; margin: 0; }
          .header { text-align: center; margin-bottom: 15px;}
          .header img { max-width: 70px; height: auto; }
          .header p { margin: 2px 0; }
          .table { width: 80%; border-collapse: collapse; margin-bottom: 20px; font-size: 10px; }
          .table th, .table td { text-align: left; padding: 4px; font-size: 10px; border-bottom: 1px dashed black; }
          .table th { font-weight: bold; }
          .table tr:first-child td { border-top: 1px dashed black; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="/images/logosm.png">
            <p>Jl. Dharma Giri Bitera Gianyar</p>
          </div>
          <p>${formatDate(penjualandetail.tanggalTransaction)} ${formatTime(
      now
    )}</p> 
          <table class="table">
            <thead>
              <tr>
                <th>Perawatan</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${penjualandetail.details
                .map(
                  (detail) => `
                  <tr>
                    <td>${detail.perawatanPelanggan} (${detail.quantityP}x)</td>
                    <td>${numberWithCommas(detail.totalHarga)}</td>
                  </tr>
                `
                )
                .join("")}
            </tbody>
          </table>
          <p><strong>Subtotal:</strong> ${numberWithCommas(
            penjualandetail.details.reduce(
              (sum, detail) => sum + parseFloat(detail.totalHarga),
              0
            )
          )}</p>
        </div>
      </body>
      </html>
    `;
  };

  const handlePrint = (content) => {
    // Menampilkan elemen loading
    const loadingIndicator = document.createElement("div");
    loadingIndicator.innerText = "Loading..."; // Bisa juga menggunakan spinner
    loadingIndicator.style.position = "fixed";
    loadingIndicator.style.top = "0";
    loadingIndicator.style.left = "0";
    loadingIndicator.style.width = "100%";
    loadingIndicator.style.height = "100%";
    loadingIndicator.style.backgroundColor = "rgba(255, 255, 255, 0.7)"; // Latar belakang semi-transparan
    loadingIndicator.style.display = "flex";
    loadingIndicator.style.justifyContent = "center";
    loadingIndicator.style.alignItems = "center";
    loadingIndicator.style.fontSize = "24px";
    loadingIndicator.style.fontWeight = "bold";
    loadingIndicator.style.zIndex = "9999"; // Pastikan loading berada di atas elemen lainnya
    loadingIndicator.style.textAlign = "center"; // Menyelaraskan teks ke tengah
    document.body.appendChild(loadingIndicator);

    const iframe = document.createElement("iframe");
    document.body.appendChild(iframe);

    // Atur style iframe
    iframe.style.position = "absolute";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "none";

    // Tulis konten ke iframe
    iframe.contentWindow.document.write(content);
    iframe.contentWindow.document.close();

    // Menambahkan event listener untuk menunggu hingga iframe selesai dimuat
    iframe.onload = () => {
      // Sembunyikan indikator loading
      document.body.removeChild(loadingIndicator);

      // Fokus pada iframe dan cetak
      iframe.contentWindow.focus();
      setTimeout(() => {
        iframe.contentWindow.print();
        document.body.removeChild(iframe); // Hapus iframe setelah mencetak
      }, 100);
    };
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const pageNumbers = [];
  for (
    let i = 1;
    i <= Math.ceil(filteredPenjualan.length / itemsPerPage);
    i++
  ) {
    pageNumbers.push(i);
  }

  // Jika jumlah halaman lebih dari 5, kita tampilkan yang relevan (sebelumnya, sekarang, dan berikutnya)
  if (pageNumbers.length > pagesToShow) {
    if (currentPage <= 3) {
      pageNumbersToShow.push(...pageNumbers.slice(0, pagesToShow)); // Menampilkan halaman pertama sampai 5
    } else if (currentPage >= pageNumbers.length - 2) {
      pageNumbersToShow.push(
        ...pageNumbers.slice(pageNumbers.length - pagesToShow)
      ); // Menampilkan 5 halaman terakhir
    } else {
      pageNumbersToShow.push(
        ...pageNumbers.slice(currentPage - 3, currentPage + 2)
      ); // Menampilkan halaman sekitar currentPage
    }
  } else {
    // Jika total halaman kurang dari atau sama dengan 5, tampilkan semuanya
    pageNumbersToShow.push(...pageNumbers);
  }

  return (
    <>
      <Container fluid>
        <Card>
          <Container fluid className="mt-4 mb-4">
            <Row className="gap-5 col-sm">
              <Col className="gap-4 col-sm-3">
                <InputGroup>
                  <InputGroupText id="dari" className="col-sm-3">
                    Dari
                  </InputGroupText>
                  <input
                    className="form-control col-sm"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    aria-describedby="dari"
                  />
                </InputGroup>
              </Col>
              <Col className="gap-4 col-sm-3">
                <InputGroup>
                  <InputGroupText id="sampai" className="col-sm-3">
                    Sampai
                  </InputGroupText>
                  <input
                    className="form-control col-sm"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    aria-describedby="sampai"
                  />
                </InputGroup>
              </Col>
              <Col>
                <Form.Check
                  className="mt-2 d-flex gap-2"
                  type="checkbox"
                  label="All Periode"
                  checked={showAll}
                  onChange={(e) => setShowAll(e.target.checked)}
                />
              </Col>
              <Col>
                <Form.Check
                  className="mt-2 d-flex gap-2"
                  type="checkbox"
                  label="Terbanyak"
                  checked={isPenjualanTerbanyak}
                  onChange={(e) => setIsPenjualanTerbanyak(e.target.checked)} // Menggunakan onChange untuk toggle
                />
              </Col>
              <Col className="text-end col-sm">
                <Button
                  variant="success"
                  onClick={exportToExcel}
                  disabled={isPenjualanTerbanyak}
                >
                  <RiFileExcel2Fill className="mb-1" /> Export
                </Button>
              </Col>
            </Row>
          </Container>
          <Row className="mt-4 container">
            <Col className="col-sm-3">
              <InputGroup>
                <InputGroup.Text id="basic-addon1">
                  <IoSearchOutline />
                </InputGroup.Text>
                <FormControl
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-describedby="basic-addon1"
                />
              </InputGroup>
            </Col>
          </Row>

          <CardBody>
            {loading ? (
              <div className="mt-5 text-center">
                <Spinner animation="border" />{" "}
              </div>
            ) : filteredPenjualan.length === 0 ? (
              <Container className="mt-5">
                <p className="mt-5 text-center">Tidak Ada Transaksi</p>
              </Container>
            ) : (
              <>
                {isPenjualanTerbanyak ? (
                  // Jika isPenjualanTerbanyak true, tampilkan komponen PenjualanTerbanyak
                  <PenjualanTerbanyak
                    filteredPenjualan={filteredPenjualan}
                    penjualanTerbanyak={penjualanTerbanyak}
                  />
                ) : (
                  // Jika isPenjualanTerbanyak false, tampilkan tabel penjualan utama
                  <>
                    <Table
                      borderless
                      responsive="sm"
                      size="sm"
                      className="text-sm-center"
                    >
                      <thead
                        style={{
                          border: "1px solid ", // Border untuk seluruh thead
                          backgroundColor: "#f1f1f1", // (Opsional) memberi latar belakang abu-abu terang untuk header
                        }}
                      >
                        <tr>
                          <th scope="col">No</th>
                          <th scope="col" className="text-start">
                            Nama
                          </th>
                          <th scope="col" className="text-start">
                            Perawatan
                          </th>
                          <th scope="col" className="text-start">
                            Harga
                          </th>
                          <th scope="col">Quantity</th>
                          <th scope="col" className="text-start">
                            Total Harga
                          </th>
                          <th scope="col" className="text-start">
                            Grand Total
                          </th>
                          <th scope="col" className="text-start">
                            Pembayaran
                          </th>
                          <th scope="col" className="text-start">
                            Note
                          </th>
                          <th scope="col" className="text-start">
                            Tanggal Transaksi
                          </th>
                          <th scope="col">Action</th>
                        </tr>
                      </thead>
                      <tbody
                        style={{
                          border: "1px solid", // Border untuk seluruh thead
                          backgroundColor: "#f1f1f1", // (Opsional) memberi latar belakang abu-abu terang untuk header
                        }}
                      >
                        {currentItems.map((penjualandetail, index) =>
                          penjualandetail.details.map((detail, detailIndex) => (
                            <tr
                              key={`${penjualandetail.id}-${index}-${detailIndex}`}
                              style={{
                                borderBottom:
                                  detailIndex ===
                                  penjualandetail.details.length - 1
                                    ? "1px solid "
                                    : "none", // Border-bottom for customer
                              }}
                              className={index % 2 === 0 ? "table-light" : ""}
                            >
                              {detailIndex === 0 && (
                                <>
                                  <td rowSpan={penjualandetail.details.length}>
                                    {index + 1}
                                  </td>
                                  <td
                                    className="text-start"
                                    rowSpan={penjualandetail.details.length}
                                  >
                                    {penjualandetail.namaPelanggan}
                                  </td>
                                </>
                              )}
                              <td className="text-start">
                                {detail.perawatanPelanggan}
                              </td>
                              <td className="text-start">
                                Rp. {numberWithCommas(detail.hargaP)}
                              </td>
                              <td>{detail.quantityP}</td>
                              <td className="text-start">
                                Rp. {numberWithCommas(detail.totalHarga)}
                              </td>
                              {detailIndex === 0 && (
                                <>
                                  <td
                                    className="text-start"
                                    rowSpan={penjualandetail.details.length}
                                  >
                                    Rp. {numberWithCommas(detail.grandtotal)}
                                  </td>
                                  <td
                                    className="text-start"
                                    rowSpan={penjualandetail.details.length}
                                  >
                                    {findMetodeById(detail.metodeDet)}
                                  </td>
                                </>
                              )}
                              <td className="text-start">
                                {detail.karyawanNote}
                              </td>
                              {detailIndex === 0 && (
                                <td
                                  className="text-start"
                                  rowSpan={penjualandetail.details.length}
                                >
                                  {formatDate(
                                    penjualandetail.tanggalTransaction
                                  )}
                                </td>
                              )}
                              {detailIndex === 0 && (
                                <td
                                  rowSpan={penjualandetail.details.length}
                                  className="text-center"
                                >
                                  <Button
                                    variant="success"
                                    onClick={() => printDetail(penjualandetail)}
                                    size="sm" // Make the button smaller
                                    style={{ marginRight: "8px" }}
                                  >
                                    <SlPrinter className="fs-5" />{" "}
                                    {/* Reduce the icon size */}
                                  </Button>
                                  <Button
                                    variant="danger"
                                    onClick={() =>
                                      handleDelete(
                                        penjualandetail.id ||
                                          penjualandetail.details[0]?.id,
                                        penjualandetail.namaPelanggan,
                                        formatDate(
                                          penjualandetail.tanggalTransaction
                                        ) // Ensure the date is formatted
                                      )
                                    }
                                    size="sm" // Make the button smaller
                                  >
                                    <FaRegTrashCan className="fs-5" />{" "}
                                    {/* Reduce the icon size */}
                                  </Button>
                                </td>
                              )}
                            </tr>
                          ))
                        )}
                      </tbody>
                    </Table>
                    <Table borderless>
                      <tbody className="fw-bold">
                        <tr>
                          <td>Cash : Rp. {numberWithCommas(totalCash)}</td>
                        </tr>
                        <tr>
                          <td>
                            Debit / QRIS : Rp. {numberWithCommas(totalDebit)}
                          </td>
                        </tr>
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
              </>
            )}
          </CardBody>
        </Card>
      </Container>
    </>
  );
}

export default ListPenjualan;

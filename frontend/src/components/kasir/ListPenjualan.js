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
import * as XLSX from "xlsx"; // Import xlsx library
import InputGroupText from "react-bootstrap/esm/InputGroupText";

function ListPenjualan() {
  const [penjualan, setPenjualan] = useState([]);
  const [filteredPenjualan, setFilteredPenjualan] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [loading, setLoading] = useState(true); // State for loading
  const [totalCash, setTotalCash] = useState(0);
  const [totalDebit, setTotalDebit] = useState(0);
  const [metodes, setMetodes] = useState([]);

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
    setCurrentPage(1); // Reset page to 1 on date or filter change
  }, [startDate, endDate, showAll, searchTerm]);

  const getPenjualan = async () => {
    setLoading(true); // Set loading to true when starting to fetch data
    try {
      const response = await axios.get("http://localhost:5000/penjualan");
      setPenjualan(response.data);
    } catch (error) {
      console.error("Error fetching penjualan data:", error);
    } finally {
      setLoading(false); // Set loading to false once data is fetched
    }
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

    // Calculate total for each payment method based on ID
    let cashTotal = 0;
    let debitTotal = 0;

    filtered.forEach((penjualandetail) => {
      penjualandetail.details.forEach((detail) => {
        const metodeId = findMetodeById(detail.metodeDet);
        if (metodeId === "Cash") {
          // ID for Cash
          cashTotal += parseFloat(detail.totalHarga);
        } else if (metodeId === "Debit / QRIS") {
          // ID for Debit
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
          .join(", "), // Gabungkan semua catatan
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
              <Col className="text-end col-sm">
                <Button variant="success" onClick={exportToExcel}>
                  <RiFileExcel2Fill className="mb-1" /> Export to Excel
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
                <Table
                  bordered
                  responsive="sm"
                  size="sm"
                  className="text-center"
                >
                  <thead>
                    <tr>
                      <th scope="col">No</th>
                      <th scope="col">Nama</th>
                      <th scope="col">Perawatan</th>
                      <th scope="col">Harga</th>
                      <th scope="col">Quantity</th>
                      <th scope="col">Total Harga</th>
                      <th scope="col">Grand Total</th>
                      <th scope="col">Pembayaran</th>
                      <th scope="col">Note</th>
                      <th scope="col">Tanggal Transaksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((penjualandetail, index) =>
                      penjualandetail.details.map((detail, detailIndex) => (
                        <tr key={`${index}-${detailIndex}`}>
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
                              <td rowSpan={penjualandetail.details.length}>
                                Rp. {numberWithCommas(detail.grandtotal)}
                              </td>
                              <td rowSpan={penjualandetail.details.length}>
                                {findMetodeById(detail.metodeDet)}{" "}
                                {/* Menampilkan nama metode */}
                              </td>
                            </>
                          )}
                          <td className="text-start">{detail.karyawanNote}</td>
                          {detailIndex === 0 && (
                            <td rowSpan={penjualandetail.details.length}>
                              {formatDate(penjualandetail.tanggalTransaction)}
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
                      <td>Debit / QRIS : Rp. {numberWithCommas(totalDebit)}</td>
                    </tr>
                  </tbody>
                </Table>

                <Pagination>
                  <Pagination.Prev
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                  />
                  {pageNumbers.map((number) => (
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
    </>
  );
}

export default ListPenjualan;

import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Row,
  Col,
  Card,
  CardBody,
  InputGroup,
} from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import numberWithCommas from "../../utils/utils";
import { Form } from "react-bootstrap";
import { BsCart4 } from "react-icons/bs";
import { FaTrashCan, FaPlus, FaMinus } from "react-icons/fa6";
import Select from "react-select";
import "./table.css";

function Transaksi({
  namaPelanggan,

  tanggalTransaction,
}) {
  const navigate = useNavigate();
  const [grandTotal, setGrandTotal] = useState(0);
  const [metod, setMetod] = useState([]);
  const [metodeDet, setMetodeDet] = useState(null);
  const [newPrice, setNewPrice] = useState("");
  const [transaktionP, setTransaktionP] = useState([
    {
      id: Date.now(),
      perawatanPelanggan: "",
      hargaP: 0,
      quantityP: 1,
      totalHarga: 0,
      karyawanNote: null,
    },
  ]);
  const [prawatan, setPrawatan] = useState([]);

  // Pastikan Anda sudah mendefinisikan fungsi handleNoteChange di luar komponen
  const handleNoteChange = (id, newNote) => {
    setTransaktionP((prevTransaktionP) =>
      prevTransaktionP.map((item) =>
        item.id === id
          ? {
              ...item,
              karyawanNote: newNote, // Update karyawanNote
            }
          : item
      )
    );
  };

  useEffect(() => {
    const fetchPrawatan = async () => {
      const res = await fetch("http://localhost:5000/perawatan"); // Replace with your API endpoint
      const data = await res.json();
      setPrawatan(
        data.map((item) => ({
          value: item.id,
          label: item.namaPerawatan,
          harga: item.harga, // Assuming price field is "harga"
        }))
      );
    };
    fetchPrawatan();
  }, []);

  // Handle quantity increase
  const increaseQuantity = (id) => {
    setTransaktionP((prevTransaktionP) =>
      prevTransaktionP.map((item) =>
        item.id === id
          ? {
              ...item,
              quantityP: item.quantityP + 1,
              totalHarga: (item.quantityP + 1) * item.hargaP,
            }
          : item
      )
    );
  };

  // Handle quantity decrease
  const decreaseQuantity = (id) => {
    setTransaktionP((prevTransaktionP) =>
      prevTransaktionP.map((item) =>
        item.id === id && item.quantityP > 1
          ? {
              ...item,
              quantityP: item.quantityP - 1,
              totalHarga: (item.quantityP - 1) * item.hargaP,
            }
          : item
      )
    );
  };

  // Calculate grand total
  useEffect(() => {
    let total = 0;
    transaktionP.forEach((item) => {
      const harga = parseFloat(item.totalHarga);
      if (!isNaN(harga)) {
        total += harga;
      }
    });
    setGrandTotal(total);
  }, [transaktionP]);

  // Get payment methods from backend
  useEffect(() => {
    const getMetode = async () => {
      const resmetod = await fetch("http://localhost:5000/metode");
      const resmtd = await resmetod.json();
      setMetod(
        resmtd.map((p) => ({
          value: p.id,
          label: p.metodeP,
        }))
      );
    };
    getMetode();
  }, []);

  function handleMetod(selectedOption) {
    setMetodeDet(selectedOption);
  }

  // Handle adding a new item
  const addItem = () => {
    const newItem = {
      id: Date.now(),
      perawatanPelanggan: null,
      hargaP: 0,
      quantityP: 1,
      totalHarga: 0,
    };
    setTransaktionP([...transaktionP, newItem]);
  };

  // Handle submitting the transaction
  const handleTrans = async (e) => {
    e.preventDefault();

    if (!metodeDet) {
      Swal.fire({
        title: "Error",
        text: "Metode pembayaran harus dipilih!",
        icon: "error",
      });
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/penjualan", {
        namaPelanggan,
        tanggalTransaction,
      });

      const penjualanId = res.data.id;

      await Promise.all(
        transaktionP.map((item) =>
          axios.post("http://localhost:5000/detail", {
            perawatanPelanggan: item.perawatanPelanggan,
            hargaP: item.hargaP,
            quantityP: item.quantityP,
            totalHarga: item.totalHarga,
            grandtotal: grandTotal,
            metodeDet: metodeDet.value,
            karyawanNote: item.karyawanNote || "",
            idpenjualan: penjualanId,
          })
        )
      );

      Swal.fire({
        title: "Penjualan Berhasil Ditambahkan",
        icon: "success",
      });
      navigate("/daftarpenjualan");
    } catch (error) {
      console.log(error);
    }
  };

  // Fungsi untuk menghapus item berdasarkan id
  const handleRemove = (id) => {
    setTransaktionP(
      (prevTransaktionP) => prevTransaktionP.filter((item) => item.id !== id) // Menghapus item berdasarkan ID
    );
  };

  return (
    <Row>
      <Col>
        <Form onSubmit={(e) => handleTrans(e)}>
          <Col className="col-sm mb-2">
            <InputGroup>
              <Select
                className="col-3"
                options={metod}
                value={metodeDet}
                onChange={handleMetod}
                placeholder="Metode Pembayaran"
              />
            </InputGroup>
          </Col>

          <Card className="mt-3 mb-5">
            <CardBody>
              <Table bordered className="text-center" size="sm">
                <thead>
                  <tr>
                    <th
                      className="bg-success py-2 border btn-success"
                      onClick={addItem}
                      style={{ cursor: "pointer", width: "50px" }}
                    >
                      <FaPlus style={{ color: "white" }} />
                    </th>
                    <th>Perawatan</th>
                    <th>Harga</th>
                    <th>Quantity</th>
                    <th>Total Harga</th>
                    <th>Note</th>
                  </tr>
                </thead>
                <tbody>
                  {transaktionP.map((detail, index) => (
                    <tr key={detail.id}>
                      <td
                        className="bg-danger border pt-2 btn-danger"
                        onClick={() => handleRemove(detail.id)}
                        style={{ cursor: "pointer" }}
                      >
                        <FaTrashCan
                          className="fs-5"
                          style={{ color: "white" }}
                        />
                      </td>
                      <td style={{ width: "250px" }}>
                        <Select
                          options={prawatan}
                          onChange={(selectedOption) =>
                            setTransaktionP((prevTransaktionP) =>
                              prevTransaktionP.map((item) =>
                                item.id === detail.id
                                  ? {
                                      ...item,
                                      perawatanPelanggan: selectedOption.label,
                                      hargaP: selectedOption.harga,
                                      totalHarga:
                                        selectedOption.harga * detail.quantityP,
                                    }
                                  : item
                              )
                            )
                          }
                          value={{
                            label: detail.perawatanPelanggan,
                            value: detail.hargaP,
                          }}
                        />
                      </td>

                      <td style={{ width: "180px" }}>
                        <input
                          className="form-control"
                          type="number"
                          value={detail.hargaP}
                          onChange={(e) => {
                            const newHarga = parseFloat(e.target.value) || 0;
                            setTransaktionP((prevTransaktionP) =>
                              prevTransaktionP.map((item) =>
                                item.id === detail.id
                                  ? {
                                      ...item,
                                      hargaP: newHarga,
                                      totalHarga: newHarga * item.quantityP, // Update totalHarga
                                    }
                                  : item
                              )
                            );
                          }}
                        />
                      </td>

                      <td className="d-flex justify-content-center align-items-center">
                        <Button
                          variant="light"
                          onClick={() => decreaseQuantity(detail.id)}
                          className="fs-8" // Menambah ukuran font agar lebih kecil
                        >
                          <FaMinus />
                        </Button>
                        <input
                          className="form-control text-center fs-8 mx-2 " // Mengatur input lebih kecil dan center
                          type="number"
                          value={detail.quantityP}
                          readOnly
                          style={{ width: "60px" }} // Mengatur lebar input lebih kecil
                        />
                        <Button
                          variant="light"
                          onClick={() => increaseQuantity(detail.id)}
                          className="fs-8" // Menambah ukuran font agar lebih kecil
                        >
                          <FaPlus />
                        </Button>
                      </td>

                      <td style={{ width: "150px" }}>
                        <input
                          className="form-control"
                          readOnly
                          value={`Rp. ${numberWithCommas(detail.totalHarga)}`}
                        />
                      </td>

                      <td>
                        <input
                          className="form-control"
                          type="text"
                          value={detail.karyawanNote || ""}
                          onChange={(e) =>
                            handleNoteChange(detail.id, e.target.value)
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="fw-bold mt-3">
                  <tr>
                    <td colSpan={4}></td>
                    <td>
                      <input
                        className="form-control fw-bold"
                        readOnly
                        value={`Rp. ${numberWithCommas(grandTotal)}`}
                      />
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </Table>
            </CardBody>
          </Card>
          <Row className="text-end mt-3">
            <Col>
              <Button variant="success" type="submit">
                <BsCart4 className="mb-1" /> Checkout
              </Button>
            </Col>
          </Row>
        </Form>
      </Col>
    </Row>
  );
}

export default Transaksi;

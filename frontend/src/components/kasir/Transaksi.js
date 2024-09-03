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
import { FaTrashCan } from "react-icons/fa6";
import Select from "react-select";
import "./table.css";
function Transaksi({
  transaktion,
  namaPelanggan,
  transaktionP,
  tanggalTransaction,
  handleRemove,
  handleNoteChange,
  karyawanNote,
  handlePriceChange,
}) {
  const navigate = useNavigate();
  const [grandTotal, setGrandTotal] = useState(0); // State untuk menyimpan grand total
  const [metod, setMetod] = useState([]);
  const [metodeDet, setMetodeDet] = useState(null); // Mengubah tipe state menjadi object
  const [newPrice, setNewPrice] = useState("");

  // Menghitung grand total saat ada perubahan pada transaksiP
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

  // Get metode dari database
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

  // Handle submit transaksi
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

  return (
    <Row>
      <Col>
        <Form onSubmit={(e) => handleTrans(e)}>
          {transaktion.map((item, i) => (
            <Card key={i} style={{ display: "none" }}>
              <CardBody>
                <Row>
                  <Col className="form-text">
                    <strong>Nama Pelanggan:</strong> {item.namaPelanggan}
                  </Col>
                  <Col className="form-text">
                    <strong>Tanggal:</strong> {item.tanggalTransaction}
                  </Col>
                </Row>
              </CardBody>
            </Card>
          ))}

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

          <Card className="mt-3">
            <CardBody>
              <Table borderless responsive className="text-center" size="sm">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Perawatan</th>
                    <th>Harga</th>
                    <th>Quantity</th>
                    <th>Total Harga</th>
                    <th>Note</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {transaktionP.map((detail, index) => (
                    <tr key={detail.id}>
                      <td>{index + 1}</td>
                      <td>{detail.perawatanPelanggan}</td>
                      {detail.idcategory === 2 || detail.idcategory === 4 || detail.idcategory === 1 || detail.idcategory === 3 ? (
                        <td className="currency-input col-2">
                          <input
                            className="form-control"
                            type="number"
                            value={detail.hargaP}
                            onChange={(e) =>
                              handlePriceChange(
                                detail.id,
                                parseFloat(e.target.value)
                              )
                            }
                          />
                        </td>
                      ) : (
                        <td className="text-start">
                          Rp. {numberWithCommas(detail.hargaP)}
                        </td>
                      )}
                      <td>{detail.quantityP}</td>
                      <td>Rp. {numberWithCommas(detail.totalHarga)}</td>
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
                      <td
                        variant="button"
                        className="text-danger"
                        onClick={() => handleRemove(detail.id)}
                      >
                        <FaTrashCan className="fs-4 mb-1" type="button" />
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="fw-bold mt-3">
                  <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>Rp. {numberWithCommas(grandTotal)}</td>
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

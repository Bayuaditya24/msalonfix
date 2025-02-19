import {
  Card,
  CardBody,
  Button,
  Form,
  FormGroup,
  FormLabel,
  Row,
  Col,
  InputGroup,
  ButtonGroup,
} from "react-bootstrap";
import React, { useState, useEffect } from "react";
import "./Tabs.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Transaksi from "./Transaksi";
import { FaMinus, FaPlus } from "react-icons/fa";
import axios from "axios";
import Select from "react-select";

const Pembayaran = ({ logobeaty }) => {
  const [namaPelanggan, setNamaPelanggan] = useState("");
  const [transaktion, setTransaktion] = useState([]);
  const [toggle, setToggle] = React.useState();
  const [prawatan, setPrawatan] = useState([]);
  const [perawatanPelanggan, setPerawatan] = useState(null);
  const [hargaP, setHargaP] = useState([]);
  const [quantityP, setQuantityP] = useState(1);
  const [totalHarga, setTotalHarga] = useState([]);
  const [transaktionP, setTransaktionP] = useState([]);
  const [tanggalTransaction, setTanggalTransaction] = useState("");
  const [nohp, setNohp] = useState("");
  const [alamat, setAlamat] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false); // New state for submission status
  const [karyawanNote, setKaryawanNote] = useState("");
  const [newPrice, setNewPrice] = useState("");

  function handlePriceChange(id, newPrice) {
    setTransaktionP((prevTransaktionP) =>
      prevTransaktionP.map((item) =>
        item.id === id
          ? { ...item, hargaP: newPrice, totalHarga: newPrice * item.quantityP }
          : item
      )
    );
  }

  // Get tanggal
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setTanggalTransaction(today);
  }, []);

  // Simpan pelanggan
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newTransaktion = { namaPelanggan, tanggalTransaction, nohp, alamat };

    try {
      await axios.post("http://localhost:5000/pelanggan", {
        namaPelanggan,
        nohp,
        alamat,
      });

      console.log(newTransaktion);
      setTransaktion([...transaktion, newTransaktion]);
      setIsSubmitted(true); // Set submitted status to true
    } catch (error) {
      console.log(error);
    }

    console.log(newTransaktion);
  };

  function updateToggle(id) {
    setToggle(id);
  }

  return (
    <>
      <Row>
        <Col>
          <Card>
            <h6 className="container mr-6 mt-2">Pelanggan</h6>
            <Form onSubmit={handleSubmit}>
              <Card.Body>
                <Form.Group className="row mb-2" controlId="formNama">
                  <Form.Label column sm="3">
                    Nama
                  </Form.Label>
                  <Col sm="8">
                    <input
                      className="form-control"
                      type="text"
                      value={namaPelanggan}
                      onChange={(e) => setNamaPelanggan(e.target.value)}
                      disabled={isSubmitted} // Disable if submitted
                      required
                    />
                  </Col>
                </Form.Group>

                <FormGroup className="row mb-2">
                  <FormLabel column sm="3">
                    Tanggal
                  </FormLabel>
                  <Col sm="8">
                    <input
                      type="date"
                      className="form-control"
                      value={tanggalTransaction}
                      onChange={(e) => setTanggalTransaction(e.target.value)}
                      disabled={isSubmitted} // Disable if submitted
                    />
                  </Col>
                </FormGroup>

                <Form.Group className="row mb-2" controlId="formHandphone">
                  <Form.Label column sm="3">
                    Phone
                  </Form.Label>
                  <Col sm="8">
                    <input
                      className="input form-control"
                      type="text"
                      value={nohp}
                      onChange={(e) => setNohp(e.target.value)}
                      disabled={isSubmitted} // Disable if submitted
                      required
                    />
                  </Col>
                </Form.Group>

                <Form.Group className="row mb-2" controlId="formAlamat">
                  <Form.Label column sm="3">
                    Alamat
                  </Form.Label>
                  <Col sm="8">
                    <textarea
                      className="input form-control"
                      type="text"
                      value={alamat}
                      onChange={(e) => setAlamat(e.target.value)}
                      disabled={isSubmitted} // Disable if submitted
                      required
                    />
                  </Col>
                </Form.Group>

                <Button
                  className="mt-2"
                  type="submit"
                  onClick={() => updateToggle(1)}
                  disabled={isSubmitted} // Disable if submitted
                >
                  Submit
                </Button>
              </Card.Body>
            </Form>
          </Card>
        </Col>

        <Col>
          <Row>
            <Col className="mb-3">
              <Card className="text-center">
                <CardBody>
                  <img
                    src={logobeaty}
                    style={{ width: "260px", height: "66px" }}
                  ></img>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

      <Col className="mb-5">
        <div className={toggle === 1 ? "show-content" : "content"}>
          <Card className="mt-3">
            <CardBody>
              <Transaksi
                transaktion={transaktion}
                namaPelanggan={namaPelanggan}
                transaktionP={transaktionP}
                tanggalTransaction={tanggalTransaction}
                karyawanNote={karyawanNote}
                handlePriceChange={handlePriceChange}
                newPrice={newPrice}
              />
            </CardBody>
          </Card>
        </div>
      </Col>
    </>
  );
};

export default Pembayaran;

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

  const handleNoteChange = (id, value) => {
    setTransaktionP((prevTransaktionP) =>
      prevTransaktionP.map((item) =>
        item.id === id ? { ...item, karyawanNote: value } : item
      )
    );
  };

  // Get tanggal
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setTanggalTransaction(today);
  }, []);

  // Increase counter
  const increase = () => {
    quantityP < hargaP ? setQuantityP(quantityP + 1) : setQuantityP("");
    setTotalHarga(Number(totalHarga) + Number(hargaP));
  };

  // Decrease counter
  const decrease = () => {
    quantityP > 1 ? setQuantityP(quantityP - 1) : setQuantityP(1);
    totalHarga > hargaP
      ? setTotalHarga(totalHarga - hargaP)
      : setTotalHarga(hargaP);
  };

  // Fungsi select perawatan
  function handleSelected(selectedOption) {
    setHargaP(selectedOption ? selectedOption.value : 0);
    setPerawatan(selectedOption);
    setTotalHarga(selectedOption ? selectedOption.value : 0);
  }

  // Fungsi push perawatan
  function handleSelect(e) {
    e.preventDefault();
    const detail = {
      id: Date.now(),
      perawatanPelanggan: perawatanPelanggan ? perawatanPelanggan.label : "",
      hargaP,
      quantityP,
      totalHarga,
      idcategory: perawatanPelanggan ? perawatanPelanggan.idcategory : null, // Tambahkan idcategory
    };
    setTransaktionP([...transaktionP, detail]);

    setQuantityP(1);
    setPerawatan(null);

    console.log(transaktionP);
    console.log(detail);
  }

  // Fungsi hapus perawatan
  function handleRemove(id) {
    setTransaktionP(transaktionP.filter((item) => item.id !== id));
  }

  // Get perawatan dari database
  useEffect(() => {
    const getPrawatan = async () => {
      try {
        const resprawatan = await fetch("http://localhost:5000/perawatan");
        const resprt = await resprawatan.json();

        setPrawatan(
          resprt.map((p) => ({
            value: p.harga,
            label:
              p.idcategory === 2
                ? `${p.namaPerawatan}`
                : p.idcategory === 4
                ? `${p.namaPerawatan} `
                : p.idcategory === 3
                ? `${p.namaPerawatan} `
                : p.idcategory === 1
                ? `${p.namaPerawatan}`
                : p.namaPerawatan,
            idcategory: p.idcategory, // Tambahkan idcategory ke opsi
          }))
        );
      } catch (error) {
        console.error("Error fetching perawatan data:", error);
      }
    };
    getPrawatan();
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
                <Form.Group className="row mb-4" controlId="formNama">
                  <Form.Label column sm="3">
                    Nama
                  </Form.Label>
                  <Col sm="9">
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
                <FormGroup className="row mb-4">
                  <FormLabel column sm="3">
                    Tanggal
                  </FormLabel>
                  <Col className="col-5">
                    <input
                      type="date"
                      className="form-control"
                      value={tanggalTransaction}
                      onChange={(e) => setTanggalTransaction(e.target.value)}
                      disabled={isSubmitted} // Disable if submitted
                    ></input>
                  </Col>
                </FormGroup>
                <Form.Group className="row mb-4" controlId="formHandphone">
                  <Form.Label column sm="3">
                    Phone
                  </Form.Label>
                  <Col sm="9">
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
                <Form.Group className="row mb-4" controlId="formAlamat">
                  <Form.Label column sm="3">
                    Alamat
                  </Form.Label>
                  <Col sm="9">
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
                  className="mt-3"
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
          <Card className={toggle === 1 ? "show-content" : "content"}>
            <h6 className="container mr-6 mt-2">Perawatan</h6>
            <CardBody>
              <Col className="col-sm mb-2">
                <InputGroup>
                  <Select
                    className="col-8"
                    options={prawatan}
                    onChange={handleSelected}
                    value={perawatanPelanggan}
                    placeholder="Pilih Perawatan"
                  />
                </InputGroup>
              </Col>

              <ButtonGroup className="col-3 text-center mt-4 mb-3">
                <Button variant="light" onClick={decrease}>
                  <FaMinus />
                </Button>
                <Button
                  className="col-4"
                  variant="white"
                  onChange={(e) => setQuantityP(e.target.value)}
                  value={quantityP}
                  name="perawatanQuantity"
                >
                  {quantityP}
                </Button>
                <Button variant="light" onClick={increase}>
                  <FaPlus />
                </Button>
              </ButtonGroup>

              <Col className="text-start">
                <Button
                  variant="success"
                  className="mt-5 col"
                  type="submit"
                  onClick={handleSelect}
                >
                  <FaPlus className="mb-1 " /> Tambah
                </Button>
              </Col>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Col>
        <div className={toggle === 1 ? "show-content" : "content"}>
          <Card className="mt-3">
            <CardBody>
              <Transaksi
                transaktion={transaktion}
                namaPelanggan={namaPelanggan}
                transaktionP={transaktionP}
                tanggalTransaction={tanggalTransaction}
                handleRemove={handleRemove}
                handleNoteChange={handleNoteChange}
                karyawanNote={karyawanNote}
                handlePriceChange={handlePriceChange}
                newPrice={newPrice}
                handleSelect={handleSelect}
              />
            </CardBody>
          </Card>
        </div>
      </Col>
    </>
  );
};

export default Pembayaran;

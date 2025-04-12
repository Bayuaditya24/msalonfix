import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const ModalBarang = ({ show, handleClose, editBarang }) => {
  const [namaBarang, setNamaBarang] = useState("");
  const [stok, setStok] = useState(0);
  const [harga, setHarga] = useState(0);

  const resetForm = () => {
    setNamaBarang("");
    setStok(0);
    setHarga(0);
  };

  useEffect(() => {
    if (editBarang) {
      setNamaBarang(editBarang.namaBarang);
      setStok(editBarang.stok);
      setHarga(editBarang.harga);
    } else {
      setNamaBarang("");
      setStok(0);
      setHarga(0);
    }
  }, [editBarang]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newBarang = { namaBarang, stok, harga };

    try {
      if (editBarang) {
        // Update barang
        await fetch(`http://localhost:5000/barang/${editBarang.id_barang}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newBarang),
        });
      } else {
        // Add new barang
        await fetch("http://localhost:5000/barang", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newBarang),
        });
      }
      resetForm();
      handleClose(); // Close the modal after submit
    } catch (error) {
      console.error("Error saving barang:", error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {editBarang ? "Edit Barang" : "Tambah Barang"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="namaBarang">
            <Form.Label>Nama Barang</Form.Label>
            <Form.Control
              type="text"
              value={namaBarang}
              onChange={(e) => setNamaBarang(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="stok" className="mt-3">
            <Form.Label>Stok</Form.Label>
            <Form.Control
              type="number"
              value={stok}
              onChange={(e) => setStok(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="harga" className="mt-3">
            <Form.Label>Harga</Form.Label>
            <Form.Control
              type="number"
              value={harga}
              onChange={(e) => setHarga(e.target.value)}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="mt-3">
            {editBarang ? "Update" : "Tambah"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalBarang;

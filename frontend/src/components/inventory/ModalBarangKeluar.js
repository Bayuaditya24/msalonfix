import React, { useState, useEffect } from "react";
import { Modal, Button, Table, Form } from "react-bootstrap";
import Select from "react-select";
import {
  FaPlus,
  FaTrashCan,
  FaMinus,
  FaPlus as PlusIcon,
} from "react-icons/fa6";

const ModalBarangKeluar = ({ show, handleClose, onSubmit, editData }) => {
  const [tanggalKeluar, setTanggalKeluar] = useState("");
  const [items, setItems] = useState([]);
  const [barangList, setBarangList] = useState([]);

  const fetchBarang = async () => {
    try {
      const response = await fetch("http://localhost:5000/barang");
      const data = await response.json();
      const options = data.map((b) => ({
        value: b.id_barang,
        label: b.namaBarang,
      }));
      setBarangList(options);
    } catch (error) {
      console.error("Gagal mengambil data barang:", error);
    }
  };

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        id_barang: null,
        quantity: 1,
        keterangan: "",
      },
    ]);
  };

  const handleRemove = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleBarangChange = (id, selectedOption) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, id_barang: selectedOption?.value || null }
          : item
      )
    );
  };

  const increaseQuantity = (id) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const handleKeteranganChange = (id, value) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, keterangan: value } : item
      )
    );
  };

  const handleSubmit = () => {
    const isValid =
      tanggalKeluar &&
      items.length > 0 &&
      items.every((item) => item.id_barang && item.quantity > 0);

    if (!isValid) {
      alert("Pastikan semua barang, quantity, dan tanggal telah diisi.");
      return;
    }

    onSubmit({ tanggalKeluar, items });
    handleClose();
  };

  useEffect(() => {
    if (show) {
      fetchBarang();

      if (editData) {
        // Mode Edit
        const rawDate = editData.tanggalKeluar;
        const dateObj = new Date(rawDate);
        if (!isNaN(dateObj.getTime())) {
          setTanggalKeluar(dateObj.toISOString().split("T")[0]);
        } else {
          console.warn("Tanggal keluar tidak valid:", rawDate);
          setTanggalKeluar(""); // fallback jika tidak valid
        }

        const mappedItems = (editData.item_barang_keluars || []).map(
          (item) => ({
            id: Date.now() + Math.random(),
            id_barang: item.id_barang,
            quantity: item.quantity,
            keterangan: item.keterangan || "",
          })
        );
        setItems(mappedItems);
      } else {
        // Mode Tambah
        const now = new Date();
        if (!isNaN(now.getTime())) {
          setTanggalKeluar(now.toISOString().split("T")[0]);
        } else {
          setTanggalKeluar("");
        }
        setItems([]);
      }
    }
  }, [show, editData]);

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Barang Keluar</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group>
          <Form.Label>Tanggal Keluar</Form.Label>
          <Form.Control
            type="date"
            value={tanggalKeluar}
            onChange={(e) => setTanggalKeluar(e.target.value)}
            style={{ width: "250px" }}
          />
        </Form.Group>

        <Table bordered className="text-center mt-3" size="sm">
          <thead>
            <tr>
              <th
                className="bg-success py-2 border btn-success"
                style={{ cursor: "pointer", width: "50px" }}
                onClick={addItem}
              >
                <FaPlus style={{ color: "white" }} />
              </th>
              <th>Barang</th>
              <th>Quantity</th>
              <th>Keterangan</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((detail) => (
              <tr key={detail.id}>
                <td
                  className="bg-danger border pt-2 btn-danger"
                  onClick={() => handleRemove(detail.id)}
                  style={{ cursor: "pointer" }}
                >
                  <FaTrashCan className="fs-5" style={{ color: "white" }} />
                </td>
                <td>
                  <Select
                    options={barangList}
                    isClearable
                    onChange={(selected) =>
                      handleBarangChange(detail.id, selected)
                    }
                    value={
                      barangList.find(
                        (b) => String(b.value) === String(detail.id_barang)
                      ) || null
                    }
                    placeholder="Pilih Barang"
                  />
                </td>
                <td className="d-flex justify-content-center align-items-center">
                  <Button
                    variant="light"
                    onClick={() => decreaseQuantity(detail.id)}
                  >
                    <FaMinus />
                  </Button>
                  <input
                    className="form-control text-center mx-2"
                    type="number"
                    value={detail.quantity}
                    readOnly
                    style={{ width: "60px" }}
                  />
                  <Button
                    variant="light"
                    onClick={() => increaseQuantity(detail.id)}
                  >
                    <PlusIcon />
                  </Button>
                </td>
                <td>
                  <input
                    type="text"
                    className="form-control"
                    value={detail.keterangan}
                    onChange={(e) =>
                      handleKeteranganChange(detail.id, e.target.value)
                    }
                  />
                </td>
                <td></td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Batal
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Simpan
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalBarangKeluar;

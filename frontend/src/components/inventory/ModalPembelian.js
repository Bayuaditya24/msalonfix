import React, { useState, useEffect } from "react";
import { Modal, Button, Table, Form } from "react-bootstrap";
import CreatableSelect from "react-select/creatable";
import { FaPlus, FaMinus } from "react-icons/fa";
import { FaTrashCan } from "react-icons/fa6";
import axios from "axios";

const ModalPembelian = ({
  show,
  handleClose,
  editPembelian,
  onSaveSuccess,
}) => {
  const [barangList, setBarangList] = useState([]);
  const [transaktionP, setTransaktionP] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const [tanggalPembelian, setTanggalPembelian] = useState(
    new Date().toISOString().slice(0, 10)
  );

  const resetForm = () => {
    setTransaktionP([]);
    setGrandTotal(0);
    setTanggalPembelian(new Date().toISOString().slice(0, 10));
  };

  // Ambil daftar barang
  useEffect(() => {
    const fetchBarang = async () => {
      try {
        const response = await axios.get("http://localhost:5000/barang");
        setBarangList(
          response.data.map((barang) => ({
            label: barang.namaBarang,
            value: barang.id_barang,
            harga: barang.harga || 0,
          }))
        );
      } catch (error) {
        console.error("Error fetching barang:", error);
      }
    };

    if (show) {
      fetchBarang();
    }
  }, [show]);

  // Set data pembelian untuk editing
  useEffect(() => {
    if (show && editPembelian && editPembelian.item_pembelians) {
      resetForm();
      setTransaktionP(
        editPembelian.item_pembelians.map((item) => ({
          id: item.id_itemPembelian || Date.now(), // Unik per baris
          namaBarang: item.namaBarang || "",
          hargaP: item.hargaPembelian || 0,
          quantityP: item.quantityPembelian || 1,
          totalHarga: item.totalHarga || 0,
          id_barang: item.id_barang,
        }))
      );

      setTanggalPembelian(
        editPembelian.tanggalPembelian || new Date().toISOString().slice(0, 10)
      );
    }
  }, [show, editPembelian]);

  useEffect(() => {
    if (show && !editPembelian) {
      resetForm();
    }
  }, [show]);

  // Update harga, namaBarang, dan totalHarga saat barang dipilih
  const handleBarangChange = (id, selectedOption) => {
    setTransaktionP((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              namaBarang: selectedOption.label,
              hargaP: selectedOption.harga,
              id_barang: selectedOption.value,
              totalHarga: selectedOption.harga * item.quantityP,
            }
          : item
      )
    );
  };

  // Fungsi untuk menambah barang baru jika tidak ada dalam daftar
  const handleCreateBarang = async (id, namaBarangBaru) => {
    try {
      const response = await axios.post("http://localhost:5000/barang", {
        namaBarang: namaBarangBaru,
        stok: 0,
        harga: 0,
      });

      const newBarang = {
        label: response.data.data.namaBarang, // <- ambil dari data.data
        value: response.data.data.id_barang,
        harga: 0,
      };

      setBarangList((prevList) => {
        const updatedList = [...prevList, newBarang];

        setTransaktionP((prevTransaksis) =>
          prevTransaksis.map((item) =>
            item.id === id
              ? {
                  ...item,
                  id_barang: newBarang.value,
                  namaBarang: newBarang.label,
                  hargaP: newBarang.harga,
                  totalHarga: newBarang.harga * item.quantityP,
                }
              : item
          )
        );

        return updatedList;
      });
    } catch (error) {
      console.error("Error creating barang:", error);
    }
  };

  // Update quantity dan total harga
  const handleQuantityChange = (id, newQuantity) => {
    setTransaktionP((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantityP: newQuantity,
              totalHarga: item.hargaP * newQuantity,
            }
          : item
      )
    );
  };

  const handlePriceChange = (id, newPrice) => {
    setTransaktionP((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              hargaP: newPrice,
              totalHarga: newPrice * item.quantityP,
            }
          : item
      )
    );
  };

  // Menambah item baru
  const addItem = () => {
    const newItem = {
      id: Date.now(),
      namaBarang: "",
      hargaP: 0,
      quantityP: 1,
      totalHarga: 0,
      id_barang: null,
    };
    setTransaktionP([...transaktionP, newItem]);
  };

  // Hapus item dari list
  const handleRemove = (id) => {
    setTransaktionP(transaktionP.filter((item) => item.id !== id));
  };

  const increaseQuantity = (id) => {
    const item = transaktionP.find((i) => i.id === id);
    handleQuantityChange(id, item.quantityP + 1);
  };

  const decreaseQuantity = (id) => {
    const item = transaktionP.find((i) => i.id === id);
    handleQuantityChange(id, Math.max(1, item.quantityP - 1));
  };

  // Menghitung total pembelian
  useEffect(() => {
    const total = transaktionP.reduce((sum, item) => sum + item.totalHarga, 0);
    setGrandTotal(total);
  }, [transaktionP]);

  // Menyimpan data pembelian ke server
  const handleSave = async () => {
    const pembelianData = {
      tanggalPembelian,
      grandTotal,
      items: transaktionP.map((item) => ({
        id_barang: item.id_barang,
        namaBarang: item.namaBarang,
        hargaPembelian: item.hargaP,
        quantityPembelian: item.quantityP,
        totalHarga: item.totalHarga,
      })),
    };

    try {
      if (editPembelian && editPembelian.id_pembelian) {
        // Mode Edit
        const response = await axios.put(
          `http://localhost:5000/pembelian/${editPembelian.id_pembelian}`,
          pembelianData
        );
        if (response.status === 200) {
          alert("Pembelian berhasil diperbarui!");
          resetForm();
          handleClose();
          onSaveSuccess?.();
        }
      } else {
        // Mode Tambah Baru
        const response = await axios.post(
          "http://localhost:5000/pembelian",
          pembelianData
        );
        if (response.status === 201) {
          alert("Pembelian berhasil disimpan!");
          resetForm();
          handleClose();
          onSaveSuccess?.();
        }
      }
    } catch (error) {
      console.error("Error saving pembelian:", error);
      alert("Gagal menyimpan data pembelian.");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="xl">
      <Modal.Header closeButton>
        <Modal.Title style={{ fontSize: "18px" }}>
          {editPembelian ? "Edit Pembelian" : "Pembelian Barang"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>Tanggal Pembelian</Form.Label>
          <Form.Control
            type="date"
            value={tanggalPembelian}
            onChange={(e) => setTanggalPembelian(e.target.value)}
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
              <th>Harga</th>
              <th>Quantity</th>
              <th>Total Harga</th>
            </tr>
          </thead>
          <tbody>
            {transaktionP.map((detail) => (
              <tr key={detail.id}>
                <td
                  className="bg-danger border pt-2 btn-danger"
                  onClick={() => handleRemove(detail.id)}
                  style={{ cursor: "pointer" }}
                >
                  <FaTrashCan className="fs-5" style={{ color: "white" }} />
                </td>
                <td>
                  <CreatableSelect
                    options={barangList || []} // Pastikan barangList terdefinisi dengan baik
                    isClearable
                    onChange={(selectedOption, actionMeta) => {
                      if (
                        selectedOption &&
                        actionMeta.action === "create-option"
                      ) {
                        handleCreateBarang(detail.id, selectedOption.label);
                      } else {
                        handleBarangChange(detail.id, selectedOption);
                      }
                    }}
                    value={
                      barangList.find(
                        (b) => String(b.value) === String(detail.id_barang)
                      ) || null
                    }
                    placeholder="Pilih atau Tambah Barang"
                  />
                </td>
                <td>
                  <input
                    className="form-control col-3"
                    type="number"
                    value={detail.hargaP}
                    onChange={(e) =>
                      handlePriceChange(
                        detail.id,
                        parseFloat(e.target.value) || 0
                      )
                    }
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
                    value={detail.quantityP}
                    readOnly
                    style={{ width: "60px" }}
                  />
                  <Button
                    variant="light"
                    onClick={() => increaseQuantity(detail.id)}
                  >
                    <FaPlus />
                  </Button>
                </td>
                <td>
                  <input
                    className="form-control"
                    readOnly
                    value={`Rp. ${detail.totalHarga.toLocaleString()}`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={4}></td>
              <td>
                <input
                  className="form-control fw-bold"
                  readOnly
                  value={`Rp. ${grandTotal.toLocaleString()}`}
                />
              </td>
            </tr>
          </tfoot>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Simpan Pembelian
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalPembelian;

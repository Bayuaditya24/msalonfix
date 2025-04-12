import { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import Select from "react-select";
import Swal from "sweetalert2";

const ModalBooking = ({ show, handleClose, editBooking, refreshBooking }) => {
  const [perawatanOptions, setPerawatanOptions] = useState([]);
  const [selectedPerawatan, setSelectedPerawatan] = useState([]);
  const [nama, setNama] = useState("");
  const [phone, setPhone] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [jam, setJam] = useState("");
  const [batal, setBatal] = useState(false); // State untuk checkbox batal
  const [isStatus1, setIsStatus1] = useState(false); // Menyimpan status apakah booking dibatalkan

  // Mengambil data perawatan dari API
  useEffect(() => {
    const fetchPerawatan = async () => {
      try {
        const response = await fetch("http://localhost:5000/perawatan");
        const data = await response.json();
        const options = data.map((item) => ({
          value: item.id,
          label: item.namaPerawatan,
        }));
        setPerawatanOptions(options);
      } catch (error) {
        console.error("Error fetching perawatan:", error);
      }
    };

    fetchPerawatan();
  }, []);

  // Mengisi form jika editBooking ada
  useEffect(() => {
    if (editBooking) {
      setNama(editBooking.nama);
      setPhone(editBooking.phone);
      setTanggal(editBooking.tanggal);
      setJam(editBooking.jam);
      setSelectedPerawatan(
        editBooking.detail_bookings.map((item) => ({
          value: item.idperawatan,
          label: item.namaperawatan,
        }))
      );
      setBatal(editBooking.status === 3); // Jika status 3, centang checkbox batal
      setIsStatus1(editBooking.status === 1); // Menyimpan status untuk pengecekan lebih lanjut
    } else {
      // Reset form jika tidak ada editBooking
      setNama("");
      setPhone("");
      setTanggal("");
      setJam("");
      setSelectedPerawatan([]);
      setBatal(false); // Reset checkbox batal
      setIsStatus1(false); // Reset status menjadi tidak dibatalkan
    }
  }, [editBooking]); // Re-run effect when editBooking changes

  const handleSaveBooking = async () => {
    if (selectedPerawatan.length === 0) {
      Swal.fire({
        title: "Perawatan harus diisi!",
        text: "Silakan pilih perawatan yang Anda inginkan.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    const bookingData = {
      nama,
      phone,
      tanggal,
      jam,
      perawatan: selectedPerawatan.map((item) => ({
        value: item.value,
        label: item.label,
      })),
      status: batal ? 3 : 0, // Jika batal dicentang, status 3, jika tidak, status 0 (Belum bayar)
    };

    try {
      let response;
      if (editBooking) {
        // Update data booking jika editBooking ada
        response = await fetch(
          `http://localhost:5000/booking/${editBooking.id_booking}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(bookingData),
          }
        );
      } else {
        // Tambah booking baru jika editBooking kosong
        response = await fetch("http://localhost:5000/booking", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bookingData),
        });
      }

      if (response.ok) {
        const result = await response.json();
        Swal.fire({
          title: "Booking Berhasil!",
          text: "Booking anda telah berhasil disimpan.",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          // Reset form setelah berhasil submit
          setNama("");
          setPhone("");
          setTanggal("");
          setJam("");
          setSelectedPerawatan([]);
          setBatal(false); // Reset checkbox batal
          handleClose(); // Menutup modal setelah berhasil
          refreshBooking(); // Memanggil fungsi refreshBooking untuk mendapatkan data terbaru
        });
      } else {
        const errorResult = await response.json();
        console.error("Error saving booking:", errorResult);
        Swal.fire({
          title: "Gagal Menyimpan Booking",
          text: "Terjadi kesalahan saat menyimpan data booking.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error saving booking:", error);
      Swal.fire({
        title: "Gagal Menyimpan Booking",
        text: "Terjadi kesalahan teknis. Silakan coba lagi.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      size="lg"
      scrollable
      style={{ marginTop: "-5%" }}
    >
      <Modal.Header closeButton>
        <span>
          <strong>{editBooking ? "Edit Booking" : "Tambah Booking"}</strong>
        </span>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: "80vh", overflowY: "auto" }}>
        <Form>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={2}>
              Nama
            </Form.Label>
            <Col sm={9}>
              <Form.Control
                type="text"
                placeholder="Masukkan nama"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                required
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={2}>
              Phone
            </Form.Label>
            <Col sm={9}>
              <Form.Control
                type="text"
                placeholder="Masukkan nomor telepon"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={2}>
              Tanggal
            </Form.Label>
            <Col sm={9}>
              <Form.Control
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                required
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={2}>
              Jam
            </Form.Label>
            <Col sm={9}>
              <Form.Control
                type="time"
                value={jam}
                onChange={(e) => setJam(e.target.value)}
                required
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={2}>
              Perawatan
            </Form.Label>
            <Col sm={9}>
              <Select
                options={perawatanOptions}
                isMulti
                value={selectedPerawatan}
                onChange={setSelectedPerawatan}
                placeholder="Pilih perawatan..."
                menuPortalTarget={document.body}
                styles={{
                  menuPortal: (base) => ({
                    ...base,
                    zIndex: 9999,
                  }),
                }}
              />
            </Col>
          </Form.Group>

          {editBooking && !isStatus1 && (
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm={2}></Form.Label>
              <Col sm={9} className="mt-2">
                <Form.Check
                  type="checkbox"
                  label="Batal"
                  checked={batal}
                  onChange={(e) => setBatal(e.target.checked)}
                />
              </Col>
            </Form.Group>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSaveBooking}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalBooking;

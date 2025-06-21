import { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";

const ModalMember = ({ show, handleClose, editMember, refreshMembers }) => {
  const [namaMember, setNamaMember] = useState("");
  const [phoneMember, setPhoneMember] = useState("");

  // Reset form saat modal ditutup
  const resetForm = () => {
    setNamaMember("");
    setPhoneMember("");
  };

  useEffect(() => {
    if (editMember) {
      setNamaMember(editMember.namaMember);
      setPhoneMember(editMember.phoneMember);
    } else {
      resetForm();
    }
  }, [editMember]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = editMember ? "PUT" : "POST";
    const url = editMember
      ? `http://localhost:5000/member/${editMember.id_member}`
      : "http://localhost:5000/member";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ namaMember, phoneMember }),
      });

      if (!response.ok) throw new Error("Gagal menyimpan data");

      const action = editMember ? "diperbarui" : "ditambahkan";

      Swal.fire({
        icon: "success",
        title: `Berhasil!`,
        text: `Member berhasil ${action}.`,
        timer: 2000,
        showConfirmButton: false,
      });

      handleClose(); // Tutup modal
      resetForm(); // Reset form input
      refreshMembers(); // Refresh daftar member
    } catch (error) {
      console.error("Error saving member:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Terjadi kesalahan saat menyimpan data member.",
      });
    }
  };

  // Reset form ketika modal ditutup
  const onHide = () => {
    resetForm();
    handleClose();
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editMember ? "Edit Member" : "Tambah Member"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="namaMember" className="mb-3">
            <Form.Label>Nama</Form.Label>
            <Form.Control
              type="text"
              value={namaMember}
              onChange={(e) => setNamaMember(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="phoneMember" className="mb-3">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type="text"
              value={phoneMember}
              onChange={(e) => setPhoneMember(e.target.value)}
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Batal
          </Button>
          <Button variant="primary" type="submit">
            Simpan
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ModalMember;

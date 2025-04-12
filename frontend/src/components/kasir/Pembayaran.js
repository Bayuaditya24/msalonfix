import {
  Card,
  CardBody,
  Button,
  Form,
  FormGroup,
  FormLabel,
  Row,
  Col,
} from "react-bootstrap";
import React, { useState, useEffect } from "react";
import Select from "react-select"; // Import react-select
import "./Tabs.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Transaksi from "./Transaksi";

const Pembayaran = ({ logobeaty }) => {
  const [namaPelanggan, setNamaPelanggan] = useState("");
  const [transaktion, setTransaktion] = useState([]);
  const [transaktionP, setTransaktionP] = useState([]);
  const [tanggalTransaction, setTanggalTransaction] = useState(""); // Tanggal Transaction
  const [nohp, setNohp] = useState("");
  const [alamat, setAlamat] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false); // New state for submission status
  const [karyawanNote, setKaryawanNote] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false); // Checkbox state
  const [bookingOptions, setBookingOptions] = useState([]); // For react-select options
  const [selectedBooking, setSelectedBooking] = useState(null); // State for selected booking
  const [bookingDetails, setBookingDetails] = useState(null); // Store the selected booking details

  // Get tanggal default
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setTanggalTransaction(today); // Set default date to today
  }, []);

  // Fetch bookings with status 0
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch("http://localhost:5000/booking");
        const data = await response.json();

        // Filter bookings with status 0
        const filteredBookings = data.filter((b) => b.status === 0);
        setBookingOptions(
          filteredBookings.map((b) => ({
            value: b.id_booking,
            label: `${b.nama} - ${new Date(b.tanggal).toLocaleDateString(
              "id-ID"
            )}`,
            phone: b.phone, // Assumes 'phone' is in the booking object
            date: b.tanggal, // Store original booking date for later use
          }))
        );
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, []);

  const handleSubmit = () => {
    setIsSubmitted(true);
    // Fetch the selected booking details after submit
    const selectedBookingDetail = bookingOptions.find(
      (booking) => booking.value === selectedBooking.value
    );
    setBookingDetails(selectedBookingDetail);
    // Update the values based on the booking data
    setNamaPelanggan(selectedBookingDetail.label.split(" - ")[0]); // Set name from booking
    setNohp(selectedBookingDetail.phone); // Set phone from booking
    setTanggalTransaction(selectedBookingDetail.date); // Set the date from selected booking
    setAlamat("-"); // Set default value for alamat
  };

  // Reset form to initial state
  const handleReset = () => {
    setNamaPelanggan("");
    setNohp("");
    setAlamat("");
    setTanggalTransaction(new Date().toISOString().split("T")[0]); // Reset date to today
    setIsSubmitted(false);
    setSelectedBooking(null);
    setBookingDetails(null);
    setTransaktionP([]);
  };

  function handlePriceChange(id, newPrice) {
    setTransaktionP((prevTransaktionP) =>
      prevTransaktionP.map((item) =>
        item.id === id
          ? { ...item, hargaP: newPrice, totalHarga: newPrice * item.quantityP }
          : item
      )
    );
  }

  return (
    <>
      <Row>
        <Col>
          <Card>
            <h6 className="container mr-6 mt-2">Pelanggan</h6>
            <Form>
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
                      // Disabled when form is submitted
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
                      required
                    />
                  </Col>
                </Form.Group>
              </Card.Body>
            </Form>
          </Card>
        </Col>

        <Col>
          <Row>
            <Col className="mb-2">
              <Card className="text-center">
                <CardBody>
                  <img
                    src={logobeaty}
                    style={{ width: "260px", height: "66px" }}
                    alt="Logo"
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Col className="mb-3">
            <Card className="text-center">
              <CardBody>
                <Row>
                  {/* Cari Booking (checkbox) on the left */}
                  <Col
                    className="d-flex align-items-center"
                    style={{ justifyContent: "flex-start" }}
                  >
                    <FormGroup>
                      <FormLabel className="text-sm">
                        <input
                          type="checkbox"
                          checked={isCheckboxChecked}
                          onChange={() =>
                            setIsCheckboxChecked(!isCheckboxChecked)
                          }
                        />
                        &nbsp; Cari Booking
                      </FormLabel>
                    </FormGroup>
                  </Col>
                </Row>

                {/* Select dropdown below the checkbox */}
                {isCheckboxChecked && (
                  <Row className="mt-1">
                    <Col>
                      <FormGroup>
                        <Select
                          options={bookingOptions}
                          value={selectedBooking}
                          onChange={setSelectedBooking}
                          isClearable
                          className="col-7"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                )}

                {/* Buttons aligned to the bottom-right */}
                {isCheckboxChecked && (
                  <Row className="mt-3">
                    <Col className="d-flex justify-content-end">
                      <Button
                        variant="danger"
                        onClick={handleReset}
                        style={{ marginRight: "10px" }}
                        size="sm" // Membuat tombol menjadi lebih kecil
                      >
                        Reset
                      </Button>
                      <Button
                        onClick={handleSubmit}
                        disabled={!selectedBooking}
                        size="sm" // Membuat tombol menjadi lebih kecil
                      >
                        Submit
                      </Button>
                    </Col>
                  </Row>
                )}
              </CardBody>
            </Card>
          </Col>
        </Col>
      </Row>

      <Col className="mb-5">
        <Card className="mt-2">
          <CardBody>
            <Transaksi
              transaktion={transaktion}
              namaPelanggan={namaPelanggan}
              transaktionP={transaktionP}
              tanggalTransaction={tanggalTransaction}
              karyawanNote={karyawanNote}
              handlePriceChange={handlePriceChange}
              newPrice={newPrice}
              nohp={nohp}
              alamat={alamat}
              selectedBooking={bookingDetails} // Pass selected booking details here
              handleReset={handleReset}
            />
          </CardBody>
        </Card>
      </Col>
    </>
  );
};

export default Pembayaran;

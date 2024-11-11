import React, { useState } from "react";
import { Table, Pagination, Button } from "react-bootstrap";
import numberWithCommas from "../../utils/utils";
import * as XLSX from "xlsx";

function PenjualanTerbanyak({
  filteredPenjualan,
  exportPenjualanTerbanyakToExcel,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Jumlah item per halaman

  // Fungsi untuk menghitung penjualan terbanyak
  const getPenjualanTerbanyak = () => {
    let salesData = [];

    filteredPenjualan.forEach((penjualandetail) => {
      penjualandetail.details.forEach((detail) => {
        // Mencari apakah perawatan sudah ada dalam salesData
        const existingItem = salesData.find(
          (item) => item.perawatan === detail.perawatanPelanggan
        );

        if (existingItem) {
          // Jika sudah ada, update jumlah dan subtotal
          existingItem.jumlah += parseInt(detail.quantityP);
          existingItem.subtotal +=
            parseFloat(detail.hargaP) * parseInt(detail.quantityP);
        } else {
          // Jika belum ada, tambahkan item baru
          salesData.push({
            perawatan: detail.perawatanPelanggan,
            jumlah: parseInt(detail.quantityP),
            harga: parseFloat(detail.hargaP),
            subtotal: parseFloat(detail.hargaP) * parseInt(detail.quantityP),
          });
        }
      });
    });

    // Mengurutkan berdasarkan jumlah terbanyak (bukan subtotal)
    salesData.sort((a, b) => b.jumlah - a.jumlah);
    return salesData;
  };

  // Mendapatkan data yang perlu ditampilkan pada halaman saat ini
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = getPenjualanTerbanyak().slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Fungsi untuk menangani perubahan halaman
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Menghitung total halaman
  const totalPages = Math.ceil(getPenjualanTerbanyak().length / itemsPerPage);

  // Fungsi untuk mengekspor data penjualan terbanyak ke Excel
  const exportToExcel = () => {
    const dataToExport = getPenjualanTerbanyak().map((item) => ({
      Perawatan: item.perawatan,
      Jumlah_Terjual: item.jumlah,
      Harga: `Rp. ${numberWithCommas(item.harga)}`,
      Total: `Rp. ${numberWithCommas(item.subtotal)}`,
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Penjualan Terbanyak");
    XLSX.writeFile(wb, "Penjualan_Terbanyak.xlsx");
  };

  return (
    <div>
      {/* Tombol untuk ekspor data ke Excel */}
      <Button variant="success" onClick={exportToExcel}>
        Export to Excel
      </Button>

      {/* Tabel Penjualan Terbanyak */}
      <Table bordered responsive="sm" size="sm" className="text-center mt-3">
        <thead>
          <tr>
            <th>No</th> {/* Menambahkan kolom No */}
            <th>Perawatan</th>
            <th>Jumlah Terjual</th>
            <th>Harga</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item, index) => (
            <tr key={index}>
              {/* Menampilkan nomor urut berdasarkan halaman */}
              <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
              <td>{item.perawatan}</td>
              <td>{item.jumlah}</td>
              <td>{`Rp. ${numberWithCommas(item.harga)}`}</td>
              <td>{`Rp. ${numberWithCommas(item.subtotal)}`}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Pagination */}
      <Pagination>
        <Pagination.Prev
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        />
        {[...Array(totalPages)].map((_, index) => (
          <Pagination.Item
            key={index + 1}
            active={index + 1 === currentPage}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        />
      </Pagination>
    </div>
  );
}

export default PenjualanTerbanyak;

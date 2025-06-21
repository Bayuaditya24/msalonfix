import ListPenjualan from "../components/kasir/ListPenjualan";
import MainLayout from "../components/MainLayout";
import BreadcrumbHeader from "../components/BreadcrumbHeader";

const DaftarPenjualan = () => {
  return (
    <>
      <MainLayout>
        <BreadcrumbHeader title="Penjualan" />
        <ListPenjualan />
      </MainLayout>
    </>
  );
};

export default DaftarPenjualan;

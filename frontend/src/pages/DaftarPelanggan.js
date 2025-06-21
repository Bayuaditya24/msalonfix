import ListPelanggan from "../components/customer/ListPelanggan";
import BreadcrumbHeader from "../components/BreadcrumbHeader";
import MainLayout from "../components/MainLayout";

const DaftarPelanggan = () => {
  return (
    <>
      <MainLayout>
        <BreadcrumbHeader title="Daftar Pelanggan" />
        <ListPelanggan />
      </MainLayout>
    </>
  );
};

export default DaftarPelanggan;

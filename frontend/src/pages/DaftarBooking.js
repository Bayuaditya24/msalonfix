import ListBooking from "../components/booking/ListBooking";
import BreadcrumbHeader from "../components/BreadcrumbHeader";
import MainLayout from "../components/MainLayout";

const DaftarBooking = () => {
  return (
    <>
      <MainLayout>
        <BreadcrumbHeader title="Daftar Booking" />
        <ListBooking />
      </MainLayout>
    </>
  );
};

export default DaftarBooking;

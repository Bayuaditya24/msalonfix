import Gudang from "../components/inventory/Gudang";
import MainLayout from "../components/MainLayout";
import BreadcrumbHeader from "../components/BreadcrumbHeader";

const Inventory = () => {
  return (
    <>
      <MainLayout>
        <BreadcrumbHeader title="Inventory" />
        <Gudang />
      </MainLayout>
    </>
  );
};

export default Inventory;

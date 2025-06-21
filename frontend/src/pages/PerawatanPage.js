import { Container } from "react-bootstrap";

import ListCategory from "../components/perawatan/ListCategory";
import BreadcrumbHeader from "../components/BreadcrumbHeader";
import MainLayout from "../components/MainLayout";

const PerawatanPage = () => {
  return (
    <>
      <MainLayout>
        <BreadcrumbHeader title="Perawatan" />

        <Container fluid>
          <ListCategory />
        </Container>
      </MainLayout>
    </>
  );
};
export default PerawatanPage;

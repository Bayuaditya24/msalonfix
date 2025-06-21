import { Container, Col, Row, Card } from "react-bootstrap";
import Pembayaran from "../components/kasir/Pembayaran";
import logobeaty from "../image/logobeaty.png";
import MainLayout from "../components/MainLayout";
import BreadcrumbHeader from "../components/BreadcrumbHeader";

const Chasier = () => {
  return (
    <>
      <MainLayout>
        <BreadcrumbHeader title="Pembayaran" />

        <Container fluid>
          <Pembayaran logobeaty={logobeaty} />
        </Container>
      </MainLayout>
    </>
  );
};
export default Chasier;

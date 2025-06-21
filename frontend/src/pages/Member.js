import MainLayout from "../components/MainLayout";
import BreadcrumbHeader from "../components/BreadcrumbHeader";
import ListMember from "../components/member/ListMember";

const Members = () => {
  return (
    <>
      <MainLayout>
        <BreadcrumbHeader title="Member" />
        <ListMember />
      </MainLayout>
    </>
  );
};

export default Members;

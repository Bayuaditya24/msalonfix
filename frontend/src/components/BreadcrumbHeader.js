import { IoHome } from "react-icons/io5";
import { Link } from "react-router-dom";

const BreadcrumbHeader = ({ title }) => {
  return (
    <div
      style={{
        background: "white",
        color: "grey",
        padding: "10px 20px",
        marginBottom: "10px",
        borderBottom: "1px solid #dee2e6",
      }}
    >
      <small className="m-1">
        <Link style={{ textDecoration: "none", color: "grey" }} to={"/"}>
          <IoHome className="mb-1" /> Home /
        </Link>
      </small>
      <small className="m-1">{title}</small>
    </div>
  );
};

export default BreadcrumbHeader;

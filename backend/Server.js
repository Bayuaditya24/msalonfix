import express from "express";
import cors from "cors";
import PelangganRoute from "./routes/PelangganRoute.js";
import PerawatanRoute from "./routes/PerawatanRoute.js";
import PenjualanRoute from "./routes/PenjualanRoute.js";
import DetailRoute from "./routes/DetailRoute.js";
import CategoryRoute from "./routes/CategoryRoute.js";
import MetodeRoute from "./routes/MetodeRoute.js";

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
app.use(PelangganRoute);
app.use(PerawatanRoute);
app.use(PenjualanRoute);
app.use(DetailRoute);
app.use(CategoryRoute);
app.use(MetodeRoute);

app.get("/", (req, res) => {
  return res.json("From BackEnd Side");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Admin from "./components/pages/admin.jsx";
import Products from "./components/pages/products.jsx";
import Data from "./components/pages/data.jsx";
import Checkout from "./components/pages/checkout.jsx";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/admin1234" element={<Admin/>} />
        <Route path="/" element={<Products/>} />
        <Route path="/datos" element={<Data />} />
        <Route path="/pago" element={<Checkout />} />

      </Routes>
    </Router>
  );
  
};

export default App;

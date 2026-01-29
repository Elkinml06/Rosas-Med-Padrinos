import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdminApp from "./components/pages/admin.jsx";
import Products from "./components/pages/products.jsx";
import Data from "./components/pages/data.jsx";
import Checkout from "./components/pages/checkout.jsx";
import ScrollToTop from "./components/common/ScrollToTop.jsx"; 

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="/" element={<Products/>} />
        <Route path="/datos" element={<Data />} />
        <Route path="/pago" element={<Checkout />} />

      </Routes>
    </Router>
  );
  
};

export default App;

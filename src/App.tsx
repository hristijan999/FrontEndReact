
import { UserProvider } from "./context/UserProvider";
import "bootswatch/dist/lux/bootstrap.min.css";
import "./index.css";


import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Eshop from './pages/eshop';
import ViewImage from "./pages/viewImage";
import { CartProvider } from "./context/CartContext";
import Login from "./pages/logIn";
import RegisterPage from "./pages/RegisterPage.tsx";
import Checkout from "./pages/Checkout";
import Admin from "./pages/Admin/Admin.tsx";
import AdminEdit from "./pages/Admin/AdminEdit.tsx";

import Home from "./pages/Home.tsx";
function App() {


  return (
      <UserProvider>
      <CartProvider>
       <BrowserRouter>
          <Routes>

              <Route path="/Home" element={<Home />} />
              <Route path="/eshop" element={<Eshop />} />
              <Route path="/viewImage/" element={<ViewImage />} />
              <Route path="/Checkout/" element={<Checkout />} />
              <Route path="/logIn/" element={<Login />} />
              <Route path="/register/" element={<RegisterPage />} />
              <Route path="/Admin/" element={<Admin />} />
              <Route path="/AdminEdit/" element={<AdminEdit />} />

          </Routes>
       </BrowserRouter>
      </CartProvider>
      </UserProvider>
  )
}

export default App

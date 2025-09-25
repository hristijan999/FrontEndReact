
import { UserProvider } from "./context/UserContext";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Eshop from './pages/eshop';
import ViewImage from "./pages/viewImage";
import { CartProvider } from "./context/CartContext";
import Login from "./pages/logIn";
import RegisterPage from "./pages/RegisterPage.tsx";
import Checkout from "./pages/Checkout";
import Admin from "./pages/Admin/Admin.tsx";
function App() {


  return (
      <UserProvider>
      <CartProvider>
       <BrowserRouter>
          <Routes>
              <Route path="/eshop" element={<Eshop />} />
              <Route path="/viewImage/" element={<ViewImage />} />
              <Route path="/Checkout/" element={<Checkout />} />
              <Route path="/logIn/" element={<Login />} />
              <Route path="/register/" element={<RegisterPage />} />
              <Route path="/Admin/" element={<Admin />} />
          </Routes>
       </BrowserRouter>
      </CartProvider>
      </UserProvider>
  )
}

export default App

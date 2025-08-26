
import './App.css';
import Navbar from './components/Navbar/Navbar';
import { BrowserRouter,Route,Routes } from 'react-router-dom';
import ShopCategory from './Pages/ShopCategory';
import Cart from './Pages/Cart';
import Product from './Pages/Product';
import Shop from './Pages/Shop';
import men_banner from './components/Assets/banner_mens.png'
import women_banner from './components/Assets/banner_women.png'
import kids_banner from './components/Assets/banner_kids.png'
import LoginSignup from './Pages/LoginSignup';


function App() {
  return (
    <div>
      <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Shop/>}></Route>
        <Route path='/mens' element={<ShopCategory banner={men_banner} category="men"/>}></Route>
        <Route path='/womens' element={<ShopCategory banner={women_banner} category="women"/>}></Route>
        <Route path='/kids' element={<ShopCategory banner={kids_banner} category="kid" />}></Route>
        <Route path='/product/:productid' element={<Product />}></Route>
        
        <Route path='/cart' element={<Cart/>}></Route>
        <Route path='/loginsignup' element={<LoginSignup/>}></Route>
        
      </Routes>
      </BrowserRouter>
      
    </div>
  );
}

export default App;

import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import MapPage from './pages/Map';


function App() {
  return (
    <div className='justify-center h-screen w-full"' >

      <Navbar/>

      <Routes>
        <Route path="/map" element={<MapPage />} />
        <Route path="/" element={<Home />} />
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </div>
  );
}

export default App;

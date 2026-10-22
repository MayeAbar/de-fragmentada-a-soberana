import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '@/components/Layout';
import Hero from '@/components/Hero';
import LatestEntry from '@/components/LatestEntry';
import Diario from '@/components/Diario';
import Manifiesto from '@/components/Manifiesto';
import ElLibro from '@/components/ElLibro';
import ElSistema from '@/components/ElSistema';
import ElPrograma from '@/components/ElPrograma';
import Buzon from '@/components/Buzon';
import AdminPanel from '@/components/AdminPanel';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route
            path="/"
            element={
              <>
                <Hero />
                <LatestEntry />
                <Diario />
              </>
            }
          />
          <Route path="/manifiesto" element={<Manifiesto />} />
          <Route path="/el-sistema" element={<ElSistema />} />
          <Route path="/el-programa" element={<ElPrograma />} />
          <Route path="/libro" element={<ElLibro />} />
          <Route path="/buzon" element={<Buzon />} />
          <Route path="/ediciones" element={<AdminPanel />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

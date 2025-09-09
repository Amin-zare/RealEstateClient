import './App.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import PortalPage from './components/PortalPage';
import ByggAbPage from './components/ByggAbPage';
import text from './constants/text.json';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <div className="App home-center">
              <h1>{text.choosePortal}</h1>
              <div className="button-row">
                <Link to="/portalen" className="portal-btn" aria-label={text.fastighetPortalBtn}>{text.fastighetPortalBtn}</Link>
                <Link to="/byggab" className="portal-btn" aria-label={text.byggAbBtn}>{text.byggAbBtn}</Link>
              </div>
            </div>
          }
        />
        <Route
          path="/portalen"
          element={
            <div>
              <PortalPage />
            </div>
          }
        />
        <Route
          path="/byggab"
          element={<ByggAbPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
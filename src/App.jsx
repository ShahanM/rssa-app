import 'bootstrap/dist/css/bootstrap.min.css';
import { Suspense } from 'react';
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/home';
import PreferenceDispersion from './pages/prefDispersion';
import Rssa from './pages/rssaMain';

function App() {
  return (
    <div className="App">
      <Router basename='/'>
      <header className="App-header">
        <Link to="/">
          <div className="headerNavLabel">
            <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" fill="currentColor" className="bi bi-house-fill" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293l6-6zm5-.793V6l-2-2V2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5z"/>
              <path fillRule="evenodd" d="M7.293 1.5a1 1 0 0 1 1.414 0l6.647 6.646a.5.5 0 0 1-.708.708L8 2.207 1.354 8.854a.5.5 0 1 1-.708-.708L7.293 1.5z"/>
            </svg>
          </div>
        </Link>
      </header>
					<Suspense fallback={<h1>Loading</h1>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dispersion" element={<PreferenceDispersion />} />
          <Route path="/rssa" element={<Rssa />} />
        </Routes>
        </Suspense>
        </Router>
    </div>
  );
}

export default App;

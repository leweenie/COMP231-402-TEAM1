import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Stack from 'react-bootstrap/Stack';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import NavBar from './components/NavBar';
import Footer from './components/Footer';

import Body from './components/Body';
import JobBoard from './components/JobBoard';

import UserProfile from './components/UserProfile';

const Layout = ({ children }) => (
  <Stack className="home-layout" direction="vertical" gap={0}>
    <div id="Header" className="p-2"><Header /></div>
    <div id="NavBar" className="p-2"><NavBar /></div>
    <div id="Body" className="p-2">{children}</div>
    <div id="Footer" className="p-2"><Footer /></div>
  </Stack>
);

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><Body /></Layout>} />
        <Route path="/job-board" element={<Layout><JobBoard /></Layout>} />
        <Route path="/profile" element={<Layout><UserProfile /></Layout>} />

      </Routes>
    </Router>
  );
}

export default App;

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Stack from 'react-bootstrap/Stack';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';

import Header from './components/Header';
import NavBar from './components/NavBar';
import Footer from './components/Footer';

import Body from './components/Body';
import JobBoard from './components/JobBoard';
import CreateJobForm from './components/CreateJobForm';
import Dashboard from './components/Dashboard';

import UserProfile from './components/UserProfile';

const Layout = ({ children }) => (
  <Stack className="home-layout" direction="vertical" gap={0}>
    <div id="Header" className="p-2"><Header /></div>
    <div id="NavBar" className="p-2"><NavBar  /></div>
    <div id="Body" className="p-2">{children}</div>
    <div id="Footer" className="p-2"><Footer /></div>
  </Stack>
);

const App = () => {

  const [userId, setUserId] = useState(null)
  const [userName, setUserName] = useState('User A')

  useEffect(() => {
    if (!userName){
      document.getElementById('navDetailRef').classList.add('hide')
      document.getElementById('navRef').innerText = `No User Selected`
    } else {
      document.getElementById('navDetailRef').classList.remove('hide')
      document.getElementById('navRef').innerText = `Viewing as: ${userName}`
      userName == 'User A' ? setUserId('67e042b2c10084905143d0e7') : setUserId('67e056755de81c089382446e')
    }
  }, [userName])

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><Body setUserName={setUserName} /></Layout>} />
        <Route path="/dashboard" element={<Layout><Dashboard userId={userId} /></Layout>} />
        <Route path="/job-board" element={<Layout><JobBoard /></Layout>} />
        <Route path="/profile" element={<Layout><UserProfile userId={userId} /></Layout>} />
        <Route path="/create-job-post" element={<Layout><CreateJobForm /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;

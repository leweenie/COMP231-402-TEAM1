import './App.css'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import Stack from 'react-bootstrap/Stack';

import Header from './components/Header';
import NavBar from './components/NavBar';
import Body from './components/Body';
import Footer from './components/Footer';


const App = () => {
  return (
    <Stack className='home-layout' direction="vertical" gap={0}>
      <div id="Header" className="p-2"><Header/></div>  
      <div id="NavBar" className="p-2"><NavBar/></div>
      <div id="Body" className="p-2"><Body/></div> 
      <div id="Footer" className="p-2"><Footer/></div>
      {/* <Header/>
      <NavBar/>
      <Body/>
      <Footer/> */}
    </Stack>
  );
}
export default App
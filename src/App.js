import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Telemetria from './component/Telemetria/Telemetria';
import Login from './page/Login/Login';
import Update from './component/Update/Update';
import OptionsDays from './page/OptionsDays/OptionsDays';


// import DashDVB from './page/DashDVB/DashDVB';
// import Llamada from './component/Pruebas/Llamada';
// import DashOTT from './page/DashOTT/DashOTT';


function App() {

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/telemetria' element={<Telemetria/>}/>
          {/* <Route path='/DashOTT' element={<DashOTT/>}/>
          <Route path='/DashDVB' element={<DashDVB/>}/>
          <Route path='/llamada' element={<Llamada/>}/> */}
          <Route path='/' element={<Login/>}/>
          <Route path='/update' element={<Update/>}/>
          <Route path='/options' element={<OptionsDays/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;

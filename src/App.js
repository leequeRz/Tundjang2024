import React, { useState } from "react";
import './App.css';
import MainDash from './components/MainDash/MainDash';
import Form from './components/Form/Form'; // Import Form component
import Sidebar from './components/Sidebar';

function App() {
  const [selectedSidebarItem, setSelectedSidebarItem] = useState('Dashboard');

  return (
    <div className="App">
      <div className="AppGlass">
        <Sidebar setSelectedSidebarItem={setSelectedSidebarItem} />
        <div className="MainContent">
          {selectedSidebarItem === 'Dashboard' ? <MainDash /> : <Form />}
        </div>
      </div>
    </div>
  );
}

export default App;

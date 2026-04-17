import './App.css'
import Tabs from "./tabs/Tabs.tsx"
import {useState} from "react";

function App() {
  const [activeTab, setActiveTab] = useState("Products")
  return (
    <>
      <div className="app">
        <div className="glass user-input main-panel">
          <div className="title-card">
            <h2>Invoice Details</h2>
          </div>

          <Tabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

        </div>

        <div className="glass preview main-panel">
          <div className="title-card">
            <h2>Preview</h2>
          </div>
        </div>
      </div>
    </>
  )
}

export default App

import React from "react";
import CollaborativeEditor from "./CollaborativeEditor";
import './App.css';  // Importing the CSS file

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h2>Collaborative Document Editing</h2>
      </header>
      <CollaborativeEditor />
    </div>
  );
}

export default App;

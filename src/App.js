// App.js

import React from 'react';
import FileShare from './FileShare'; // Update the path based on your project structure

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>WebSocket File Sharing App</h1>
      </header>
      <main>
        <FileShare />
      </main>
    </div>
  );
}

export default App;

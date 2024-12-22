import React, { useEffect, useState } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

const CollaborativeEditor = () => {
  const [documentText, setDocumentText] = useState("");
  const [yDoc, setYDoc] = useState(null);
  const [userCount, setUserCount] = useState(0); // Track number of users
  const [connected, setConnected] = useState(false); // Track connection status

  useEffect(() => {
    const doc = new Y.Doc();
    
    // Connect to the WebSocket server
    const provider = new WebsocketProvider('wss://yjs-websocket.glitch.me', 'my-roomname', doc);

    const yText = doc.getText("text");

    // Observe changes in the document
    yText.observe(() => {
      setDocumentText(yText.toString());
    });

    // Listen for changes to awareness (user count updates)
    provider.awareness.on('change', () => {
      // Get the current number of users from the awareness map
      setUserCount(provider.awareness.getStates().size);
    });

    provider.on('status', ({ status }) => {
      if (status === 'connected') {
        console.log('WebSocket connected!');
        setConnected(true);
      } else {
        console.error('WebSocket connection failed with status:', status);
        setConnected(false);
      }
    });

    // Initial user count setup
    setUserCount(provider.awareness.getStates().size);

    setYDoc(doc);

    return () => {
      provider.disconnect();
      doc.destroy();
    };
  }, []);

  const handleChange = (event) => {
    if (yDoc) {
      const yText = yDoc.getText("text");
      const newText = event.target.value;
      
      yText.delete(0, yText.length); 
      yText.insert(0, newText);

      setDocumentText(newText); 
    }
  };

  return (
    <div className="collaborative-editor">
      <textarea
        value={documentText}
        onChange={handleChange}
        placeholder="Start typing here..."
        rows={20}
        cols={100}
      />
      <div className="status-bar">
        <span className="user-count">{userCount} user(s) editing</span>
        <span className={`connection-status ${connected ? 'connected' : 'disconnected'}`}>
          Status: {connected ? "Connected" : "Disconnected"}
        </span>
      </div>
    </div>
  );
};

export default CollaborativeEditor;

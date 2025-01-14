// src/App.js
import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import io from 'socket.io-client';

// Setup socket.io connection to signaling server
const socket = io('http://localhost:5000');

function App() {
  const [stream, setStream] = useState(null);
  const [peers, setPeers] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const userVideo = useRef(null);
  const peerConnections = useRef({});

  // Get user media (video/audio)
  useEffect(() => {
    const getUserMedia = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setStream(mediaStream);
        if (userVideo.current) {
          userVideo.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error('Error accessing media devices.', err);
      }
    };

    getUserMedia();

    socket.on('signal', handleSignal);

    return () => {
      socket.off('signal', handleSignal);
    };
  }, []);

  // Handle incoming signaling messages
  const handleSignal = (data) => {
    const { source, signal } = data;

    if (signal.type === 'offer') {
      createAnswer(source, signal);
    } else if (signal.type === 'answer') {
      peerConnections.current[source].setRemoteDescription(new RTCSessionDescription(signal));
    } else if (signal.type === 'candidate') {
      peerConnections.current[source].addIceCandidate(new RTCIceCandidate(signal.candidate));
    }
  };

  // Create a new peer connection
  const createPeerConnection = (socketId) => {
    const peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });

    // On ice candidate
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('signal', {
          target: socketId,
          signal: {
            type: 'candidate',
            candidate: event.candidate,
          },
        });
      }
    };

    // On remote stream
    peerConnection.ontrack = (event) => {
      const existingPeer = peers.find((peer) => peer.id === socketId);
      if (!existingPeer) {
        setPeers((prevPeers) => [
          ...prevPeers,
          { id: socketId, stream: event.streams[0] },
        ]);
      }
    };

    return peerConnection;
  };

  // Call another peer
  const callPeer = (socketId) => {
    const peerConnection = createPeerConnection(socketId);

    // Add local stream to peer connection
    stream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, stream);
    });

    // Create offer
    peerConnection
      .createOffer()
      .then((offer) => peerConnection.setLocalDescription(offer))
      .then(() => {
        socket.emit('signal', {
          target: socketId,
          signal: {
            type: 'offer',
            sdp: peerConnection.localDescription,
          },
        });
      });

    peerConnections.current[socketId] = peerConnection;
  };

  // Create an answer when receiving an offer
  const createAnswer = (socketId, offer) => {
    const peerConnection = createPeerConnection(socketId);

    peerConnection
      .setRemoteDescription(new RTCSessionDescription(offer))
      .then(() => peerConnection.createAnswer())
      .then((answer) => peerConnection.setLocalDescription(answer))
      .then(() => {
        socket.emit('signal', {
          target: socketId,
          signal: {
            type: 'answer',
            sdp: peerConnection.localDescription,
          },
        });
      });

    peerConnections.current[socketId] = peerConnection;
  };

  // Mute audio
  const toggleMute = () => {
    if (stream) {
      const audioTrack = stream.getTracks().find((track) => track.kind === 'audio');
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!isMuted);
      }
    }
  };

  // Turn off/on camera
  const toggleCamera = () => {
    if (stream) {
      const videoTrack = stream.getTracks().find((track) => track.kind === 'video');
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsCameraOff(!isCameraOff);
      }
    }
  };

  return (
    <div className="App">
      <div className="video-container">
        <video ref={userVideo} autoPlay muted playsInline />
        {peers.map((peer) => (
          <video
            key={peer.id}
            ref={(ref) => {
              if (ref) {
                ref.srcObject = peer.stream;
              }
            }}
            autoPlay
            playsInline
          />
        ))}
      </div>

      <div className="controls">
        <button onClick={toggleMute}>{isMuted ? 'Unmute' : 'Mute'}</button>
        <button onClick={toggleCamera}>{isCameraOff ? 'Turn Camera On' : 'Turn Camera Off'}</button>
      </div>
    </div>
  );
}

export default App;

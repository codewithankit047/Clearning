import React, { useState, useEffect } from 'react';
import { database, storage } from './firebase';

const FileShare = () => {
  const [file, setFile] = useState(null);
  const [roomId, setRoomId] = useState('');
  const [joinRoomId, setJoinRoomId] = useState('');
  const [downloadProgress, setDownloadProgress] = useState(0);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleGenerateRoom = async () => {
    if (!file) return;

    // Generate a unique room ID (you can use a library like shortid)
    const newRoomId = 'generated-room-id';

    // Store the file in Firebase Storage
    const storageRef = storage.ref(newRoomId);
    await storageRef.put(file);

    // Save metadata to Firebase Realtime Database
    database.ref(`rooms/${newRoomId}`).set({
      fileName: file.name,
      fileSize: file.size,
      // Add more metadata if needed
    });

    // Update state with the generated room ID
    setRoomId(newRoomId);
  };

  const handleJoinRoom = async () => {
    if (!joinRoomId) return;

    // Check if the room exists in the database
    const roomSnapshot = await database.ref(`rooms/${joinRoomId}`).once('value');
    const roomData = roomSnapshot.val();

    if (roomData) {
      // Update state with the joined room ID
      setRoomId(joinRoomId);
    } else {
      alert('Room does not exist. Please enter a valid Room ID.');
    }
  };

  const handleFileDownload = () => {
    if (!roomId) return;

    // Get the download URL from Firebase Storage
    const storageRef = storage.ref(roomId);
    storageRef.getDownloadURL().then((url) => {
      // Simulate download progress
      let progress = 0;
      const interval = setInterval(() => {
        setDownloadProgress(progress);
        progress += 5;

        if (progress > 100) {
          clearInterval(interval);
          // Allow the user to download the file
          const a = document.createElement('a');
          a.href = url;
          a.download = 'downloaded_file.txt'; // Set a proper file name
          a.click();
        }
      }, 200);
    });
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleGenerateRoom}>Generate Room</button>
      <p>Generated Room ID: {roomId}</p>

      <div>
        <input
          type="text"
          placeholder="Enter Room ID to Join"
          value={joinRoomId}
          onChange={(e) => setJoinRoomId(e.target.value)}
        />
        <button onClick={handleJoinRoom}>Join Room</button>
      </div>

      {roomId && (
        <div>
          <button onClick={handleFileDownload}>Download File</button>
          {downloadProgress > 0 && (
            <p>Downloading: {downloadProgress}% completed</p>
          )}
        </div>
      )}
    </div>
  );
};

export default FileShare;

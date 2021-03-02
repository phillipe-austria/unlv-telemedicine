import React, { 
  useContext,
  useEffect, 
  useState } 
from 'react';
import { 
  Button, 
  Card, 
  Image
} from 'semantic-ui-react';
import boyAvator from './images/boy-avatar.png';
import { SocketContext } from 'contexts/SocketContext';
import {
  Link
} from 'react-router-dom';


function CallRoom() {
  const [patientsWaiting, setPatientsWaiting] = useState([]);
  const [callReady, setCallReady] = useState(false);
  const { 
    allPeers,
    disconnectSocket,
    initSocket,
    mySocketId,
    socketAlive,
    socketRef,
  } = useContext(SocketContext);

  useEffect(() => {
    if (!socketAlive) {
      initSocket();
    }

    // Cleanup 
    return () => {
      console.log('clean up call room');
      //if(!socketAlive && !keepSocket) {
      //  disconnectSocket();
      //}
    }
  }, []);

  // update patients upon peer change on socket server
  useEffect(() => {
    if (allPeers.length) {
      // TODO: need to remove all doctors eventually
      const patientsOnly = allPeers
                             .filter(peer => peer.sid !== mySocketId);
      setPatientsWaiting(patientsOnly);
    }
  }, [allPeers]);

  function callPeer(otherSocketId) {
    //const peer = new Peer({
    //  initiator: true,
    //  trickle: false,
    //  stream: streamRef.current.srcObject
    //});

    //peer.on("signal", data => {
    //  socket.current.emit("callUser", { userToCall: id, signalData: data, from: yourID })
    //})

    //peer.on("stream", stream => {
    //  if (partnerVideo.current) {
    //    partnerVideo.current.srcObject = stream;
    //  }
    //});

   socketRef.current.emit("callUser", { userToCall: otherSocketId, 
                                        from: mySocketId });
  }

  // TODO: useEffect to fetch patients from database 

  return (
    <>
      <h1>Call Room</h1>
      <h2>Socket Id: {mySocketId}</h2>

      <Card.Group stackable>
        {patientsWaiting.map(patient => (
          <Card key={patient.sid}>
            <Card.Content>
              <Image
                floated='right'
                size='mini'
                src={ boyAvator }
              />
              <Card.Header>{patient.sid}</Card.Header>
            </Card.Content>
            <Card.Content extra>
              <div>
                <Link to='/chatroom'>
                  <Button basic color='green'>Call</Button>
                </Link>
                <Link to='#'>
                  <Button basic color='blue'>Profile</Button>
                </Link>
              </div>
            </Card.Content>
          </Card>
        ))}
      </Card.Group>
    </>
  );
}

export default CallRoom;

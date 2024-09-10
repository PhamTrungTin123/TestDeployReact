import React, {useState, useEffect} from "react";
import {
    MDBInput,
    MDBRow,
    MDBCol,
    MDBCheckbox,
    MDBBtn,
    MDBIcon, MDBModal, MDBModalDialog, MDBModalHeader, MDBModalContent, MDBModalTitle, MDBModalBody, MDBModalFooter
} from 'mdb-react-ui-kit';

export default function CreateRoom({handleCreateRoom, handleJoinRoom, handleJoinPeople}) {
    const [roomName, setRoomName] = useState('');
    const [mess, setMess] = useState('');
    const [selectedUserType, setSelectedUserType] = useState(null);
    const [userList, setUserList] = useState([...roomName]);
// const [chatMess, setChatMess] = useState([ ...userName]);
    const [socket, setSocket] = useState(null);

    function handleChange1(event) {
        setRoomName(event.target.value); // Cập nhật giá trị từ thẻ input vào state
    }

    function handleChange2(event) {
        setMess(event.target.value); // Cập nhật giá trị từ thẻ input vào state
    }

    function keyClickEnter(e) {
        if (e.key === 'Enter') {
            handleClickCreate();
            handleClickJoin();
        }
    }

    function handleClickCreate() {
        if (roomName !== "") {
            handleCreateRoom(roomName); // Truyền giá trị message vào hàm handleSendMessage
            setRoomName('');
        }

    }

    function handleClickJoin() {
        if (roomName !== "") {
            handleJoinRoom(roomName); // Truyền giá trị message vào hàm handleSendMessage
            setRoomName('');
        }
    }



    const css = {
        justifyContent: 'center',
    };


    return (
        <MDBRow style={css} className='gy-2 gx-3 align-items-center'>
            <MDBCol size='auto'>
                <MDBInput id='form13Example1' label='Username or RoomCode'
                          value={roomName} // Gán giá trị từ state vào giá trị của thẻ input
                          onChange={handleChange1} // Gắn sự kiện onChange để cập nhật state khi nhập liệu vào thẻ input
                          onKeyPress={keyClickEnter}/>
            </MDBCol>
            <MDBCol size='auto'>
                {/* <MDBCheckbox id='form13Example2' label='Room' /> */}
                <MDBBtn onClick={handleClickCreate}><MDBIcon size='lg' fas icon="circle-plus"/></MDBBtn>
            </MDBCol>
            <MDBCol size='auto'>
                <MDBBtn onClick={handleClickJoin}><MDBIcon size='lg' fas icon="arrow-circle-right"/></MDBBtn>
            </MDBCol>
        </MDBRow>
    );
}
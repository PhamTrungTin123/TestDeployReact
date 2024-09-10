import React, { useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import {
    MDBContainer,
    MDBCol,
    MDBRow,
    MDBBtn,
    MDBIcon,
    MDBInput,
    MDBCheckbox,
    MDBCard,
    MDBCardBody,
    MDBBadge,
    MDBCardFooter,
    MDBModal, MDBModalDialog, MDBModalContent, MDBModalHeader, MDBModalTitle, MDBModalBody, MDBModalFooter
} from 'mdb-react-ui-kit';



export default function ProfileBox({handleLogout, handleJoinPeople}) {
    const [roomName, setRoomName] = useState('');
    const [mess, setMess] = useState('');
    const [staticModal, setStaticModal] = useState(false);

    const toggleShow = () => setStaticModal(!staticModal);
    function handleChange1(event) {
        setRoomName(event.target.value); // Cập nhật giá trị từ thẻ input vào state
    }

    function handleChange2(event) {
        setMess(event.target.value); // Cập nhật giá trị từ thẻ input vào state
    }

    function joinPeople() {
        if (roomName !== "") {
            handleJoinPeople(roomName, mess); // Truyền giá trị message vào hàm handleSendMessage
            setRoomName('');
            setMess('');
            toggleShow();
        }
    }

    return (
        <><MDBCardBody style={{ paddingBottom: '5px' }}>
            <div className='d-flex justify-content-between align-items-center'>
                <div className='d-flex align-items-center'>
                    <img
                        src='https://mdbootstrap.com/img/new/avatars/8.jpg'
                        alt=''
                        style={{ width: '45px', height: '45px' }}
                        className='rounded-circle' />
                    <div className='ms-3'>
                        <p className='fw-bold mb-1'>{sessionStorage.getItem('username')}</p>
                        <p className='text-muted mb-0'>{sessionStorage.getItem('username')}@gmail.com</p>
                    </div>
                </div>
                <MDBBadge pill color='' light style={{display: 'flex'}}>
                    {/* Online */}
                    <div onClick={toggleShow}>
                        <MDBIcon far icon="edit" style={{color: '#3b71ca', fontSize: '25px', margin: '5px'}}/>
                    </div>
                    <MDBModal staticBackdrop tabIndex='-1' show={staticModal} setShow={setStaticModal}>
                        <MDBModalDialog>
                            <MDBModalContent>
                                <MDBModalHeader>
                                    <MDBModalTitle style={{color: 'black'}}>Soạn tin nhắn</MDBModalTitle>
                                    <MDBBtn className='btn-close' color='none' onClick={toggleShow}></MDBBtn>
                                </MDBModalHeader>
                                <MDBModalBody>
                                    <MDBInput id='form13Example1' label='Username'
                                              value={roomName} // Gán giá trị từ state vào giá trị của thẻ input
                                              onChange={handleChange1} // Gắn sự kiện onChange để cập nhật state khi nhập liệu vào thẻ input
                                              style={{marginBottom: '10px'}}/>
                                    <MDBInput id='form13Example1' label='Soạn tin nhắn'
                                              value={mess} // Gán giá trị từ state vào giá trị của thẻ input
                                              onChange={handleChange2} // Gắn sự kiện onChange để cập nhật state khi nhập liệu vào thẻ input
                                              />
                                </MDBModalBody>
                                <MDBModalFooter>
                                    <MDBBtn color='secondary' onClick={toggleShow}>
                                        Close
                                    </MDBBtn>
                                    <MDBBtn onClick={joinPeople}>Join</MDBBtn>
                                </MDBModalFooter>
                            </MDBModalContent>
                        </MDBModalDialog>
                    </MDBModal>
                    <div onClick={handleLogout} className='me-1'>
                        <MDBIcon fas icon='arrow-right-from-bracket' style={{color: '#3b71ca', fontSize: '25px', margin: '6.5px 0 0 20px'}}/>
                    </div>
                </MDBBadge>
            </div>
        </MDBCardBody></>
    );
};


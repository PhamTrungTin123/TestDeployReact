import React, { useState } from 'react';
import Viewer from 'react-viewer';
import FsLightbox from "fslightbox-react";
import Modal from 'react-modal';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import {
    MDBBtn,
    MDBModal,
    MDBModalDialog,
    MDBModalContent,
    MDBModalHeader,
    MDBModalTitle,
    MDBModalBody,
    MDBModalFooter,
    MDBListGroup,
    MDBListGroupItem,
    MDBBadge,
    MDBCol,

    MDBLightbox,
    MDBRow


} from 'mdb-react-ui-kit';

export default function ModalMember({ chatImg, members, topRightModal, setTopRightModal, toggleShow, owner }) {
    //   const [topRightModal, setTopRightModal] = useState(false);

    //   const toggleShow = () => setTopRightModal(!topRightModal);
    const [visible, setVisible] = React.useState(false);
    const [imgSelected, setImgSelected] = useState(null);

    const [toggler, setToggler] = useState(false);

    const [open1, setOpen1] = useState(false);


    return (
        <>
            {/* <MDBBtn onClick={toggleShow}>Top right</MDBBtn> */}

            <MDBModal
                animationDirection='right'
                show={topRightModal}
                tabIndex='-1'
                setShow={setTopRightModal}
            >
                <MDBModalDialog position='top-right' side>
                    <MDBModalContent>
                        {(members.length > 0) ? (
                            <><MDBModalHeader className='bg-info text-white'>
                                <MDBModalTitle>Thành viên trong nhóm</MDBModalTitle>
                                <MDBBtn
                                    color='none'
                                    className='btn-close btn-close-white'
                                    onClick={toggleShow}
                                ></MDBBtn>
                            </MDBModalHeader><MDBModalBody>
                                    <MDBListGroup style={{ minWidth: '22rem' }} light>
                                        <MDBListGroupItem className='d-flex justify-content-between align-items-center'>
                                            <div className='d-flex align-items-center'>
                                                <img
                                                    src='./img/people.png'
                                                    alt=''
                                                    style={{ width: '45px', height: '45px' }}
                                                    className='rounded-circle' />
                                                <div className='ms-3'>
                                                    <p className='fw-bold mb-1'>{owner}</p>
                                                    <p className='text-muted mb-0'>Nhóm trưởng</p>
                                                </div>
                                            </div>
                                            <MDBBadge pill light color='success'>
                                                Online
                                            </MDBBadge>
                                        </MDBListGroupItem>
                                        {members.map((user, index) => (

                                            <MDBListGroupItem className='d-flex justify-content-between align-items-center'>
                                                <div className='d-flex align-items-center'>
                                                    <img
                                                        src='./img/people.png'
                                                        alt=''
                                                        style={{ width: '45px', height: '45px' }}
                                                        className='rounded-circle' />
                                                    <div className='ms-3'>
                                                        <p className='fw-bold mb-1'>{user.name}</p>
                                                        <p className='text-muted mb-0'>Thành viên</p>
                                                    </div>
                                                </div>
                                                <MDBBadge pill light color='warning'>
                                                    Offline
                                                </MDBBadge>
                                            </MDBListGroupItem>

                                        ))}


                                    </MDBListGroup>
                                </MDBModalBody></>
                        ) : (
                            <div color='btn-secondary' onClick={() => setOpen1(true)}>

                            </div >
                        )}

                        <MDBModalHeader className='bg-info text-white'>
                            <MDBModalTitle>Kho ảnh</MDBModalTitle>
                            <div style={{color:'white'}} color='secondary' className='btn btn-outline-secondary te' onClick={() => setOpen1(true)}>
                                Xem ảnh
                            </div >
                        </MDBModalHeader>


                        <div class="lightbox">
                            <div class="row">
                                {chatImg.map((img, index) => (
                                    <><div class="col-lg-3">
                                        <img
                                            src={img}
                                            data-mdb-img="https://mdbcdn.b-cdn.net/img/Photos/Slides/1.webp"
                                            alt="Ảnh không xác định"
                                            class="w-100"
                                        // onClick={() => { setVisible(true); setImgSelected({ img }); }}
                                        ></img>
                                    </div>

                                    </>
                                ))}


                                <Lightbox
                                    open={open1}
                                    close={() => setOpen1(false)}
                                    // slides={[
                                    //     { src: "/image1.jpg" },
                                    //     { src: "/image2.jpg" },
                                    //     { src: "/image3.jpg" },
                                    // ]}
                                    slides={chatImg.map((img, index) => ({ src: img }))}
                                />
                            </div>
                        </div>
                        <MDBModalBody>
                        </MDBModalBody>
                        <MDBModalFooter>
                            <MDBBtn outline color='info' onClick={toggleShow}>
                                Đóng
                            </MDBBtn>
                        </MDBModalFooter>
                    </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>
        </>
    );
}
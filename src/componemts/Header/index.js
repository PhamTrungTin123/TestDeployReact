import React, { useState, useEffect } from 'react';
import {
  MDBNavbar,
  MDBContainer,
  MDBNavbarBrand,
  MDBNavbarToggler,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBCollapse,
  MDBBtn,
  MDBIcon,
  MDBNavbarNav,
  MDBInputGroup
} from 'mdb-react-ui-kit';
import { useHistory } from 'react-router-dom';
import ModalMember from "../ModalMember";
export default function Header({ chatMess, selectedUserType, isUserOnline, checkUser, owner, members, checkMember, selectedUser,
  getLinkImg }) {
  const history = useHistory();
  const [socket, setSocket] = useState(null);

  const [onlineMembers, setOnlineMembers] = useState([]);

  const [topRightModal, setTopRightModal] = useState(false);
  const [chatImg, setChatImg] = useState([]);

  const toggleShow = () => setTopRightModal(!topRightModal);
  const [showNavNoTogglerSecond, setShowNavNoTogglerSecond] = useState(false);


  const online = 'Đang hoạt động';
  const offline = 'Chưa hoạt động';
  function checkOnline() {
    if (isUserOnline) {
      return online;
    } return offline;
  }

  const isImage = (str) => {
    return str.includes("images");
  };

  useEffect(() => {

    const updatedMessImg = [];

    if (chatMess) {

      for (const mess of chatMess) {
        if (isImage(decodeURIComponent(mess.mes))) {
          updatedMessImg.push(decodeURIComponent(mess.mes))
        } else {
          // updatedMessImg.push(null);
        }
      };
    }
    console.log(updatedMessImg)
    setChatImg(updatedMessImg);
  }, [chatMess]);



  return (
    <>
      <MDBNavbar style={{ borderRadius: '2rem 2rem 0 0' }} expand='lg' light bgColor='light'>
        <MDBContainer fluid>
          <MDBNavbarBrand href='#'>
            <img
              src='./img/logo.png'
              alt=''
              loading='lazy'
              height={40}
            />
          </MDBNavbarBrand>
          <MDBNavbarToggler
            type='button'
            data-target='#navbarTogglerDemo02'
            aria-controls='navbarTogglerDemo02'
            aria-expanded='false'
            aria-label='Toggle navigation'
            onClick={() => setShowNavNoTogglerSecond(!showNavNoTogglerSecond)}
          >
            <MDBIcon icon='bars' fas />
          </MDBNavbarToggler>
          <MDBCollapse navbar show={showNavNoTogglerSecond}>
            <MDBNavbarNav className='mr-auto mb-2 mb-lg-0'>
              <MDBNavbarItem>
                <MDBNavbarLink className='fw-bold' active aria-current='page'>

                  {selectedUser}
                </MDBNavbarLink>
              </MDBNavbarItem>
              {/* <MDBNavbarItem>
                <MDBNavbarLink>{sessionStorage.getItem('username')}</MDBNavbarLink>
              </MDBNavbarItem> */}
              <MDBNavbarItem>
                <MDBNavbarLink disabled href='#' tabIndex={-1} aria-disabled='true'>
                  {(members.length > 0) ? (<span class="badge badge-success">{members.length} thành viên</span>) :
                    (<span class="badge badge-success">{localStorage.getItem('isOnline')}</span>)}
                </MDBNavbarLink>
              </MDBNavbarItem>

            </MDBNavbarNav>
            <MDBInputGroup tag="form" className='d-flex w-auto' onClick={getLinkImg(chatMess)}>
              <a className="ms-3" onClick={ toggleShow  } >
                <MDBIcon className='fa-lg' fas icon="circle-info" />
              </a>
              <ModalMember members={members} owner={owner} toggleShow={toggleShow} setTopRightModal={setTopRightModal}
               topRightModal={topRightModal} chatImg = {chatImg} ></ModalMember>
            </MDBInputGroup>
          </MDBCollapse>
        </MDBContainer>
      </MDBNavbar>
    </>
  );
}
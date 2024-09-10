// import React, {useRef, useState, useEffect} from "react";
// import {useLocation} from 'react-router-dom';
// import {createBrowserHistory} from 'history';
// import {useHistory} from 'react-router-dom';
//
// import {
//     MDBContainer,
//     MDBRow,
//     MDBCol,
//     MDBCardBody,
//     MDBCard,
//     MDBCardFooter,
// }
//     from "mdb-react-ui-kit";
// import UserList from "../componemts/UserList";
// import ChatBox from "../componemts/ChatBox";
// import Header from "../componemts/Header";
// import InputMess from "../componemts/InputMess";
// import CreateRoom from "../componemts/CreateRoom";
// import ProfileBox from "../componemts/ProfileBox";
//
//
// export default function Home() {
//     const [socket, setSocket] = useState(null);
//     const [selectedUser, setSelectedUser] = useState(null);
//     const [selectedUserType, setSelectedUserType] = useState(null);
//     const [typeSend, setTypeSend] = useState(null);
//     const [userList, setUserList] = useState([]);
//     const [chatMess, setChatMess] = useState([]);
//     const [error, setError] = useState([]);
//
//     const [chatImg, setChatImg] = useState([]);
//
//     const [members, setMembers] = useState([]);
//     const [owner, setOwner] = useState(null);
//
//     const [isOnline, setIsOnline] = useState(null);
//
//     // const [isUserOnline, setIsUserOnline] = useState(null);
//
//     var isUserOnline = null;
//     const isImage = (str) => {
//         return str.includes("images");
//     };
//
//     const getLinkImg = ([]) => {
//         // const updatedMessImg = [];
//
//         // if ([]) {
//
//         //     for (const mess of []) {
//         //         if (isImage(decodeURIComponent(mess.mes))) {
//         //             updatedMessImg.push(decodeURIComponent(mess.mes))
//         //         } else {
//         //             // updatedMessImg.push(null);
//         //         }
//         //     };
//         // }
//         // // console.log(updatedMessImg);
//         // setChatImg(updatedMessImg);
//     }
//
//     const checkMember = () => {
//         const updatedMembers = members.map((member) => ({
//             ...member,
//             isOnline: false,
//         }));
//
//         members.forEach((member, index) => {
//             const checkUserRequest = {
//                 action: "onchat",
//                 data: {
//                     event: "CHECK_USER",
//                     data: {
//                         user: member.name,
//                     },
//                 },
//             };
//
//             socket.send(JSON.stringify(checkUserRequest));
//
//             // Xử lý phản hồi từ máy chủ
//             socket.onmessage = (event) => {
//                 const response = JSON.parse(event.data);
//                 if (response.event === "CHECK_USER" && response.status === "success") {
//                     const userStatus = response.data.status;
//
//                     // Cập nhật userStatus trong mảng updatedMembers
//                     // updatedMembers[index].isOnline = userStatus;
//                     updatedMembers[index].isOnline = false;
//                     // Kiểm tra nếu đã cập nhật xong tất cả thành viên
//
//                     setMembers(updatedMembers);
//                 }
//             };
//         });
//         console.log(updatedMembers)
//         console.log(members)
//     };
//
//
//     function handleSendMessage(message) {
//         const encodedMessage = encodeURIComponent(message);
//         const chatData = {
//             action: 'onchat',
//             data: {
//                 event: 'SEND_CHAT',
//                 data: {
//                     type: typeSend, // Loại tin nhắn (data.chatData.type)
//                     to: selectedUser, // get room chat mess (data.chatData.name)
//                     mes: encodedMessage, // Nội dung tin nhắn từ người dùng nhập vào
//                 }
//             },
//         };
//         socket.send(JSON.stringify(chatData));
//         console.log(typeSend);
//         console.log("Đã gửi tin nhắn lên cho server");
//         if (selectedUserType == 1) {
//             const requestRoomChatMessage = {
//                 action: "onchat",
//                 data: {
//                     event: "GET_ROOM_CHAT_MES",
//                     data: {
//                         name: selectedUser,
//                         page: 1,
//                     },
//                 },
//             };
//             socket.send(JSON.stringify(requestRoomChatMessage));
//         } else {
//             const requestRoomChatMessage = {
//                 action: "onchat",
//                 data: {
//                     event: "GET_PEOPLE_CHAT_MES",
//                     data: {
//                         name: selectedUser,
//                         page: 1,
//                     },
//                 },
//             };
//             socket.send(JSON.stringify(requestRoomChatMessage));
//         }
//     }
//
//
//     function handleUserClick(userName, type) {
//         setSelectedUser(userName);
//         setSelectedUserType(type);
//         console.log(type)
//         console.log(userName);
//         if (type == 1) {
//             setTypeSend("room");
//             console.log("đã biết type = 1 và user là " + userName)
//             const requestRoomChatMess = {
//                 action: "onchat",
//                 data: {
//                     event: "GET_ROOM_CHAT_MES",
//                     data: {
//                         name: userName,
//                         page: 1
//                     },
//                 },
//             };
//             socket.send(JSON.stringify(requestRoomChatMess));
//             console.log("Đã gửi yêu cầu get room chat mes");
//             // checkMember();
//         } else {
//             setTypeSend("people");
//             console.log("đã biết type = 1 và user là " + userName)
//             // const requestRelogin = {
//             //     action: "onchat",
//             //     data: {
//             //         event: "RE_LOGIN",
//             //         data: {
//             //             user: sessionStorage.getItem('user'),
//             //             code: sessionStorage.getItem('relogin_code')
//             //         },
//             //     },
//             // };
//             // socket.send(JSON.stringify(requestRelogin));
//             const requestRoomChatMess = {
//                 action: "onchat",
//                 data: {
//                     event: "GET_PEOPLE_CHAT_MES",
//                     data: {
//                         name: userName,
//                         page: 1
//                     },
//                 },
//             };
//             socket.send(JSON.stringify(requestRoomChatMess));
//             console.log("Đã gửi yêu cầu get people chat mes");
//             setMembers([]);
//             checkUser(userName);
//
//         }
//
//     }
//
//     function handleLogout() {
//         const requestLogout = {
//             action: "onchat",
//             data: {
//                 event: "LOGOUT",
//             },
//         };
//         socket.send(JSON.stringify(requestLogout));
//         sessionStorage.removeItem('username');
//         sessionStorage.removeItem('password');
//         sessionStorage.removeItem('relogin_code');
//
//         window.location.href = '/login'
//
//
//     }
//
//     function handleCreateRoom(roomName) {
//         const requestcreateRoom = {
//             action: "onchat",
//             data: {
//                 event: "CREATE_ROOM",
//                 data: {
//                     name: roomName,
//                 },
//             },
//         };
//         socket.send(JSON.stringify(requestcreateRoom));
//         setSelectedUser(roomName);
//         console.log("Đã gửi yêu cầu ");
//         const userList = {
//             action: 'onchat',
//             data: {
//                 event: 'GET_USER_LIST',
//             },
//         };
//         socket.send(JSON.stringify(userList));
//         //   setRoomName('');
//         // socket.onmessage = (event) => {
//         //     const response = JSON.parse(event.data);
//         //     if (response.status === 'success' && response.event === 'CREATE_ROOM') {
//         //         const newRoom = response.data.roomName;
//         //         setUserList([...userList, newRoom]);
//         //     } else {
//         //         console.log(response.mes)
//         //     }
//
//         //     if (response.status === 'success' && response.event === 'RE_LOGIN') {
//         //         console.log("Đã relogin thành công")
//         //         sessionStorage.setItem('relogin_code', response.data.RE_LOGIN_CODE);
//         //     } else {
//         //         console.log(response.mes)
//         //     }
//
//
//         // }
//
//     }
//
//     function handleJoinPeople(userName, mess) {
//         const joinPeople = {
//             action: 'onchat',
//             data: {
//                 event: 'SEND_CHAT',
//                 data: {
//                     type: 'people', // Loại tin nhắn (data.chatData.type)
//                     to: userName, // get room chat mess (data.chatData.name)
//                     mes: mess, // Nội dung tin nhắn từ người dùng nhập vào
//                 }
//             },
//         };
//         socket.send(JSON.stringify(joinPeople));
//         console.log("Đã gửi tin nhắn lên cho server");
//     }
//
//     function handleJoinRoom(roomName) {
//         const requestJoinRoom = {
//             action: "onchat",
//             data: {
//                 event: "JOIN_ROOM",
//                 data: {
//                     name: roomName,
//                 },
//             },
//         };
//         socket.send(JSON.stringify(requestJoinRoom));
//         setSelectedUser(roomName);
//         console.log("Đã gửi yêu cầu ");
//         const userList = {
//             action: 'onchat',
//             data: {
//                 event: 'GET_USER_LIST',
//             },
//         };
//         socket.send(JSON.stringify(userList));
//
//
//     }
//
//     const playMessageSound = () => {
//         if (messageSoundRef.current) {
//             messageSoundRef.current.play();
//         }
//     };
//
//     const getListUser = () => {
//         const userList = {
//             action: 'onchat',
//             data: {
//                 event: 'GET_USER_LIST',
//             },
//         };
//         socket.send(JSON.stringify(userList));
//     };
//
//     const checkUser = (user) => {
//         const checkUser = {
//             action: "onchat",
//             data: {
//                 event: "CHECK_USER",
//                 data: {
//                     user: user
//                 },
//             },
//         };
//         socket.send(JSON.stringify(checkUser));
//     };
//
//
//
//
// useEffect(() => {
//     // Khởi tạo kết nối với server qua websocket
//     const socket = new WebSocket("ws://140.238.54.136:8080/chat/chat");
//     socket.addEventListener("open", () => {
//         console.log("WebSocket connection established.");
//         // Gửi message RE_LOGIN để đăng nhập lại với thông tin user và code
//         socket.send(JSON.stringify({
//                 action: "onchat",
//                 data: {
//                     event: "RE_LOGIN",
//                     data: {
//                         user: sessionStorage.getItem('username'),
//                         code: atob(sessionStorage.getItem('relogin_code')) // giai ma
//                     }
//                 }
//             }
//         ))
//         ;
//         socket.send(JSON.stringify({
//                 action: 'onchat',
//                 data: {
//                     event: 'GET_USER_LIST',
//                 },
//             }
//         ))
//         ;
//         socket.onmessage = (event) => {
//             const response = JSON.parse(event.data);
//             if (response.status === 'success' && response.event === 'RE_LOGIN') {
//                 sessionStorage.setItem('relogin_code', btoa(response.data.RE_LOGIN_CODE))
//             }
//             if (response.status === 'success' && response.event === 'GET_ROOM_CHAT_MES') {
//                 const chatMess = response.data.chatData;
//                 setChatMess(chatMess);
//                 console.log(chatMess);
//
//                 const members = response.data.userList;
//                 setMembers(members);
//                 console.log(members);
//
//                 const own = response.data.own;
//                 setOwner(own);
//                 console.log(owner);
//
//                 checkMember();
//             }
//             if (response.status === 'success' && response.event === 'GET_PEOPLE_CHAT_MES') {
//                 const chatMess = response.data;
//                 setChatMess(chatMess);
//                 console.log(chatMess)
//             }
//             if (response.status === 'success' && response.event === 'SEND_CHAT') {
//                 const receivedMessage = response.data;
//                 setChatMess((prevChatMess) => [...prevChatMess, receivedMessage]);
//                 playMessageSound();
//             }
//             if (response.status === 'success' && response.event === 'CREATE_ROOM') {
//                 const chatMess = response.data.chatData;
//                 setChatMess(chatMess);
//             }
//             if (response.status === 'error' && response.event === 'CREATE_ROOM') {
//                 alert(response.mes)
//             }
//             if (response.status === 'success' && response.event === 'JOIN_ROOM') {
//                 const receivedJoinRoomName = response.data;
//             }
//             if (response.status === 'error' && response.event === 'JOIN_ROOM') {
//                 alert(response.mes)
//             }
//             if (response.status === 'success' && response.event === 'GET_USER_LIST') {
//                 const users = response.data;
//                 setUserList(users);
//             }
//             if (response.status === 'success' && response.event === 'CHECK_USER') {
//                 const status = response.data.status;
//                 isUserOnline = status;
//                 // setIsUserOnline(status);
//                 console.log(status);
//                 console.log(isUserOnline);
//                 if (status === 'true') {
//                     localStorage.setItem('isOnline', 'Đang hoạt động');
//                 } else {
//                     localStorage.setItem('isOnline', '');
//                 }
//
//             }
//         }
//
//         setSocket(socket);
//     });
//     // Đóng kết nối khi component unmount
//     return () => {
//         socket.close();
//     };
//
// }, []);
//
//
// const css = {
//     marginBottom: '10px',
//     borderRadius: '2rem',
// };
// const messageSoundRef = useRef(null);
//
// return (
//     <>
//         <MDBContainer fluid className="py-2" style={{backgroundColor: "#eee"}}>
//             <MDBRow>
//                 <MDBCol md="6" lg="5" xl="4" className="mb-4 mb-md-0">
//                     <MDBCard style={css}>
//                         <ProfileBox handleLogout={handleLogout} handleJoinPeople={handleJoinPeople}/>
//
//                         <MDBCardFooter background='light' border='0' className='p-2 d-flex justify-content-around'
//                                        style={css}>
//                             <CreateRoom handleCreateRoom={handleCreateRoom} handleJoinRoom={handleJoinRoom}/>
//
//                         </MDBCardFooter>
//                     </MDBCard>
//                     <UserList selectedUser={selectedUser} userList={userList} handleUserClick={handleUserClick}/>
//
//
//                 </MDBCol>
//                 <MDBCol md="6" lg="7" xl="8">
//                     <Header chatMess={chatMess} selectedUserType={selectedUserType} isUserOnline={isUserOnline}
//                             selectedUser={selectedUser} checkMember={checkMember} checkUser={checkUser}
//                             members={members}
//                             owner={owner} handleLogout={handleLogout} chatImg={chatImg} getLinkImg={getLinkImg}/>
//                     {/* <MDBContainer fluid className="py-2" style={{ backgroundColor: "#eee" }}></MDBContainer> */}
//                     <ChatBox isUserOnline={isUserOnline} chatMess={chatMess}/>
//                     <InputMess handleSendMessage={handleSendMessage}/>
//
//                 </MDBCol>
//             </MDBRow>
//
//
//             {/* <MDBRow>
//                     <MDBCol md="6" lg="5" xl="4" className="mb-4 mb-md-0">
//                         <UserList selectedUser={selectedUser} userList={userList} handleUserClick={handleUserClick} />
//                     </MDBCol>
//                     <MDBCol md="6" lg="7" xl="8">
//                         <ChatBox chatMess={chatMess} />
//                         <InputMess handleSendMessage={handleSendMessage} />
//                     </MDBCol>
//                 </MDBRow> */}
//         </MDBContainer>
//         <audio ref={messageSoundRef} src="./audio/thongbao.mp3"/>
//     </>
// );
// }
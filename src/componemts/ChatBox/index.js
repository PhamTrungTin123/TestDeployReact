// import React, { useRef, useState, useEffect } from "react";
// import axios from "axios";
// import Viewer from 'react-viewer';
// import {
//     MDBContainer,
//     MDBRow,
//     MDBCol,
//     MDBCard,
//     MDBCardBody,
//     MDBIcon,
//     MDBBtn,
//     MDBTypography,
//     MDBTextArea,
//     MDBCardHeader,
//     MDBCardImage,
//     MDBCardText,
//     MDBCardTitle,
// } from "mdb-react-ui-kit";
// import './style.css'
//
// export default function ChatBox(props , isUserOnline) {
//
//     // const [selectedUser, setSelectedUser] = useState(null);
//     const [visible, setVisible] = React.useState(false);
//     const [imgSelected, setImgSelected] = useState(null);
//     const { chatMess } = props;
//     const [socket, setSocket] = useState(null);
//
//     const chatBoxRef = useRef(null);
//
//     const [linkPreviews, setLinkPreviews] = useState([]);
//
//     // useEffect(() => {
//     //     const fetchLinkPreviews = async () => {
//     //         const updatedLinkPreviews = [];
//     //
//     //         for (const mess of chatMess) {
//     //             if (isLink(decodeURIComponent(mess.mes))) {
//     //                 try {
//     //                     // Lấy thông tin từ link
//     //
//     //                     const apiKey = 'fca1f0fbda8ee17102bc3ae0f2e5d6f7'; // Thay YOUR_API_KEY bằng API key của bạn
//     //                     // const url = `https://api.linkpreview.net/?key=${apiKey}&q=${encodeURIComponent(mess.mes)}`;
//     //                     const url = `https://api.linkpreview.net/?key=${apiKey}&q=${encodeURIComponent(decodeURIComponent(mess.mes))}`;
//     //
//     //
//     //                     const response = await axios.get(url);
//     //
//     //                     updatedLinkPreviews.push(response.data);
//     //                     console.log(response.data);
//     //                 } catch (error) {
//     //                     console.error('Error fetching link preview:', error);
//     //                     updatedLinkPreviews.push(null);
//     //                 }
//     //             } else {
//     //                 updatedLinkPreviews.push(null);
//     //             }
//     //         }
//     //
//     //         // Cập nhật state linkPreviews
//     //         setLinkPreviews(updatedLinkPreviews);
//     //         console.log(linkPreviews)
//     //     };
//     //
//     //     fetchLinkPreviews();
//     //
//     //     if (chatBoxRef.current) {
//     //         chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
//     //     }
//     //
//     //
//     //
//     // }, [chatMess]);
//     // // Sắp xếp tin nhắn theo thời gian tăng dần
//     // if (!chatMess || !Array.isArray(chatMess)) {
//     //     return null;
//     // }
//     //
//     // const sortedChatContent = chatMess.sort((a, b) => {
//     //     const timeA = new Date(a.createAt).getTime();
//     //     const timeB = new Date(b.createAt).getTime();
//     //     return timeA - timeB;
//     // });
//     //
//     // const isLink = (str) => {
//     //     const urlRegex = /^(https?:\/\/)?([\w.-]+\.[a-z]{2,})(\/[\w.-]*)*\/?$/;
//     //     return urlRegex.test(str);
//     // };
//     // const isImage = (str) => {
//     //     return str.includes("images");
//     // };
//     //
//     //
//     //
//     // const timeMess = (str) => {
//     //     if (str) {
//     //         return str.substring(10);
//     //     }
//     //     return ""
//     // };
//     // const isImageLink = (str) => {
//     //     return isImage(str) || isLink(str);
//     // };
//
//     return (
//         <><MDBTypography style={{ height: "590px", overflow: "scroll", scrollBehavior: "smooth", borderLeft: 'white solid 5px', }} ref={chatBoxRef} listUnStyled>
//             {sortedChatContent.map((mess, index) => (
//                 <div key={index}>
//                     {mess.name == sessionStorage.getItem('username') ? (
//                         <li style={{}} class="d-flex mb-4 ml-300 justify-content-end">
//                             <MDBCard className="w-100 card-mess">
//                                 <MDBCardHeader className="d-flex p-1 card-name" style={{ flexDirection: 'row-reverse', justifyContent: 'flex-start' }}>
//                                     <p class="fw-bold mb-0">{mess.name}</p>
//                                     <p class="text-muted small mb-0 my-time" >
//                                         <MDBIcon far icon="clock" /> {timeMess(mess.createAt)}
//                                     </p>
//                                 </MDBCardHeader>
//                                 <MDBCardBody className={isImage(decodeURIComponent(mess.mes)) ? "img my-mess flex" : " my-mess flex"}>
//                                     <p style={{}}></p>
//                                     <p note noteColor='success' className={isImageLink(decodeURIComponent(mess.mes)) ? "mb-0 shadow-5-strong bg-info bg-opacity-25 img" : "mb-0 bg-info shadow-5-strong bg-opacity-25 mess"}>
//                                         {isLink(decodeURIComponent(mess.mes)) ? (
//                                             linkPreviews[index] ? (
//                                                 <>
//                                                     <p>
//                                                         <a target="_blank" className="mb-0" href={decodeURIComponent(mess.mes)}>
//                                                             {decodeURIComponent(mess.mes)}
//                                                         </a>
//                                                     </p>
//                                                     <a target="_blank" href={decodeURIComponent(mess.mes)}>
//                                                         <MDBCard>
//                                                             <MDBCardImage style={{ width: "25%", margin: 'auto', padding: '5px' }} src={linkPreviews[index].image} alt="Link preview" position='top' />
//                                                             <MDBCardBody>
//                                                                 <MDBCardTitle style={{ color: "black"  }}>{linkPreviews[index].title}</MDBCardTitle>
//                                                                 <MDBCardText style={{ color: "black" }}>
//                                                                     {linkPreviews[index].description}
//                                                                 </MDBCardText>
//                                                                 {/* <MDBBtn href={linkPreviews[index].url} target="_blank">Open</MDBBtn> */}
//                                                             </MDBCardBody>
//                                                         </MDBCard>
//                                                     </a>
//                                                 </>
//                                             ) : (
//                                                 <a href={decodeURIComponent(mess.mes)}>
//                                                     {decodeURIComponent(mess.mes)}
//                                                 </a>
//
//                                             )
//
//                                         ) : (
//                                             <>
//                                                 {isImage(decodeURIComponent(mess.mes)) ? (
//                                                     // Xử lý khi là hình ảnh
//                                                     // Render nội dung hình ảnh
//                                                     <>
//
//                                                         <MDBCard onClick={() => { setVisible(true); setImgSelected(decodeURIComponent(mess.mes)) }}>
//                                                             <MDBCardImage style={{ maxWidth: "100%", margin: 'auto', padding: '5px' }} src={decodeURIComponent(mess.mes)} alt="Link preview" position='top' />
//
//                                                         </MDBCard>
//                                                         <Viewer
//                                                             visible={visible}
//                                                             onClose={() => { setVisible(false); }}
//                                                             images={[{ src: imgSelected, alt: '' }]}
//                                                         />
//
//
//                                                     </>
//                                                 ) : (
//                                                     // Xử lý khi không phải hình ảnh
//                                                     // Render nội dung tin nhắn
//                                                     decodeURIComponent(mess.mes)
//                                                 )}
//                                             </>
//                                         )}
//                                     </p>
//
//
//
//                                 </MDBCardBody>
//
//                             </MDBCard>
//                             <img
//                                 src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp"
//                                 alt="avatar"
//                                 className="rounded-circle d-flex align-self-start ms-3 shadow-1-strong"
//                                 width="60" />
//                         </li>
//                     ) : (
//                         <li className="d-flex mb-4">
//                             <img
//                                 src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp"
//                                 alt="avatar"
//                                 className="rounded-circle d-flex align-self-start me-3 shadow-1-strong"
//                                 width="60" />
//                             <span style={{marginLeft: '-35px', marginTop: '45px',paddingRight: '10px' }}>{isUserOnline ? <MDBIcon style={{color: 'blue'}} fas icon="circle" /> : <MDBIcon style={{color: 'black'}} fas icon="circle"  />} </span>
//                             <MDBCard className="card-mess">
//                                 <MDBCardHeader className="d-flex justify-content-start p-1 card-name">
//                                     <p className="fw-bold mb-0">{mess.name}</p>
//
//                                     <p className="text-muted small mb-0 timeMess">
//                                         <MDBIcon far icon="clock" /> {timeMess(mess.createAt)}
//                                     </p>
//                                 </MDBCardHeader>
//                                 <MDBCardBody className={isImage(decodeURIComponent(mess.mes)) ? "img" : "mess shadow-5 shadow-5-strong"} >
//                                     <p className="mb-0 w-100">
//
//                                         {isLink(decodeURIComponent(mess.mes)) ? (
//                                             linkPreviews[index] ? (
//                                                 <>
//                                                     <p>
//                                                         <a target="_blank" className="mb-0" href={decodeURIComponent(mess.mes)}>
//                                                             {decodeURIComponent(mess.mes)}
//                                                         </a>
//                                                     </p>
//                                                     <a target="_blank" href={decodeURIComponent(mess.mes)}>
//                                                         <MDBCard style={{ width: "500px" }}>
//                                                             <MDBCardImage style={{ width: "50%", margin: 'auto', padding: '5px' }} src={linkPreviews[index].image} alt="Link preview" position='top' />
//                                                             <MDBCardBody>
//                                                                 <MDBCardTitle style={{ color: "black" }}>{linkPreviews[index].title}</MDBCardTitle>
//                                                                 <MDBCardText style={{ color: "black" }}>
//                                                                     {linkPreviews[index].description}
//                                                                 </MDBCardText>
//                                                                 {/* <MDBBtn href={linkPreviews[index].url} target="_blank">Open</MDBBtn> */}
//                                                             </MDBCardBody>
//                                                         </MDBCard>
//                                                     </a>
//                                                 </>
//                                             ) : (
//                                                 decodeURIComponent(mess.mes)
//                                             )
//                                         ) : (
//                                             <>
//                                                 {isImage(decodeURIComponent(mess.mes)) ? (
//                                                     // Xử lý khi là hình ảnh
//                                                     // Render nội dung hình ảnh
//                                                     <>
//
//                                                         <MDBCard style={{ width: "100%", margin: 'auto', padding: '5px' }} onClick={() => { setVisible(true); setImgSelected(decodeURIComponent(mess.mes)) }}>
//                                                             <MDBCardImage style={{ width: "100%", margin: 'auto', padding: '5px' }} src={decodeURIComponent(mess.mes)} alt="Link preview" position='top' />
//
//                                                         </MDBCard>
//                                                         <Viewer
//                                                             visible={visible}
//                                                             onClose={() => { setVisible(false); }}
//                                                             images={[{ src: imgSelected, alt: '' }]}
//                                                         />
//                                                     </>
//                                                 ) : (
//                                                     // Xử lý khi không phải hình ảnh
//                                                     // Render nội dung tin nhắn
//                                                     decodeURIComponent(mess.mes)
//                                                 )}
//                                             </>
//                                         )}
//                                     </p>
//                                 </MDBCardBody>
//                             </MDBCard>
//                         </li>
//                     )}
//
//
//
//                 </div>
//             ))}
//         </MDBTypography></>
//     );
// }

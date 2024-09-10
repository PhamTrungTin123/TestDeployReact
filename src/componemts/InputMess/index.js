// import React, { useRef, useState, useEffect } from "react";
// import {
//   MDBContainer,
//   MDBRow,
//   MDBCol,
//   MDBCard,
//   MDBCardBody,
//   MDBIcon,
//   MDBBtn,
//   MDBTypography,
//   MDBTextArea,
//   MDBCardHeader,
// } from "mdb-react-ui-kit";
// import Picker from '@emoji-mart/react';
// import data from '@emoji-mart/data';
// import firebase from "firebase/compat/app";
// import './inputCss.css';
//
//
// import {getStorage, ref, uploadBytes, getDownloadURL} from "firebase/storage";
//
// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries
//
// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyBURVcDCcEqys-DMwDdpHgEGsQgOsrEf2A",
//   authDomain: "appchat-1e09d.firebaseapp.com",
//   projectId: "appchat-1e09d",
//   storageBucket: "appchat-1e09d.appspot.com",
//   messagingSenderId: "83110680956",
//   appId: "1:83110680956:web:267606108db6245a34acf9",
//   measurementId: "G-RESB6229XP",
//   storageBucket: "gs://appchat-1e09d.appspot.com",
// };
//
// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
//
// firebase.initializeApp(firebaseConfig);
//
// // const storage = firebase.storage();
//
// const storage = getStorage(app);
//
//
// export default function InputMess({ handleSendMessage }) {
//
//   const [selectedUser, setSelectedUser] = useState(null);
//
//   const [message, setMessage] = useState("");
//
//   const [showPicker, setShowPicker] = useState(false);
//
//   const fileInputImage = useRef();
//
//
//   function handleChange(e) {
//
//     setMessage(e.target.value); // Cập nhật giá trị từ thẻ input vào state
//
//   }
//   function keyClickEnter(e) {
//     if (e.key === 'Enter') {
//       handleClick();
//     }
//   }
//   function handleClick() {
//     if (message !== "") {
//       handleSendMessage(message); // Truyền giá trị message vào hàm handleSendMessage
//       setMessage('')
//     }
//
//   }
//
//
//   function handleUploadImage(img) {
//     const file = img.target.files[0];
//     const storage = getStorage();
//     const storageRef = ref(storage, "images/" + file.name); // Sử dụng child() để tạo thư mục con
//
//     uploadBytes(storageRef, file)
//         .then((snapshot) => {
//             console.log("Upload complete");
//             // Lấy đường dẫn tải xuống
//             return getDownloadURL(snapshot.ref);
//
//         })
//         .then((downloadURL) => {
//             // Handle việc hiển thị hình ảnh trong chatBox
//             console.log("Download URL:", downloadURL);
//
//             // Gửi đường dẫn tải xuống đến hàm handleSendMessage để hiển thị trong chatBox
//             handleSendMessage(downloadURL);
//
//             // Cập nhật giá trị của mess (nếu cần)
//             // setMess(downloadURL);
//         })
//         .catch((error) => {
//             console.error("Upload error:", error);
//             // Xử lý lỗi nếu cần
//         });
// }
//
//
//   return (
//
//     <div className="text-muted d-flex justify-content-start align-items-center pe-3 mt-2">
//       <img
//         src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp"
//         alt="avatar 3"
//         style={{ width: "40px", height: "100%" }}
//       />
//
//       <input
//         autoComplete="off"
//         type="text"
//         className="form-control form-control-lg"
//         id="exampleFormControlInput2"
//         placeholder="Type message"
//         value={message} // Gán giá trị từ state vào giá trị của thẻ input
//         onChange={handleChange} // Gắn sự kiện onChange để cập nhật state khi nhập liệu vào thẻ input
//         onKeyPress={keyClickEnter}
//
//       />
//       <input
//         type="file"
//         style={{ display: "none" }}
//         ref={fileInputImage}
//         onChange={handleUploadImage}
//       />
//       <a
//         className="ms-3 text-muted"
//         onClick={() => fileInputImage.current.click()}
//       >
//         <MDBIcon fas icon="paperclip" />
//       </a>
//
//       <a className="ms-3 text-muted" href="#!">
//         <MDBIcon fas icon="smile"  onClick={() => setShowPicker(!showPicker)} />
//           <div className="emoji-picker">
//               {showPicker && <Picker
//           data={data}
//
//           onEmojiSelect={(e)=>{setMessage(message+e.native);
//             setShowPicker(!showPicker)
//           }}
//           />}
//           </div>
//       </a>
//       <a className="ms-3" onClick={handleClick}>
//         <MDBIcon fas icon="paper-plane" />
//       </a>
//     </div>
//
//   );
// }

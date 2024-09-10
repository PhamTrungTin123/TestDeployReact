import React, { useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import {
    MDBBtn,
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBInput,
    MDBCheckbox,
    MDBIcon,MDBCardImage
} from 'mdb-react-ui-kit';
import './style.css'
import {
    createUserWithEmailAndPassword,
} from "firebase/auth";
import ava from "../../img/addAvatar.png"
import { auth, db } from "../../firebase";
import { collection, doc, setDoc, query, where, getDocs } from "firebase/firestore";
import Swal from 'sweetalert2';
import upload from "../../componemts/ChatRoom/upload";


const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [isMale, setIsMale] = useState(true);

    const navigate = useNavigate();
    const [emailError, setEmailError] = useState('');
    const [isCheckedMale, setIsCheckedMale] = useState(false);
    const [isCheckedFemale, setIsCheckedFemale] = useState(false);
    const [avatar, setAvatar] = useState({
        file: null,
        url: "",
    });

    const handleAvatar = (e) => {
        if (e.target.files[0]) {
            setAvatar({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0]),
            });
        }
    };

    const handleMaleChange = () => {
        setIsCheckedMale(true);
        setIsCheckedFemale(false);
        setIsMale(true);
    };

    const handleFemaleChange = () => {
        setIsCheckedFemale(true);
        setIsCheckedMale(false);
        setIsMale(false);
    };

    const validateEmail = (email) => {
        const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return pattern.test(email);
    };

    const handleUsernameChange = (event) => {
        const value = event.target.value;
        setUsername(value);
        if (value.trim() === "") {
            Swal.fire({
                text: "Username không được để trống hoặc chỉ có khoảng trắng",
                icon: 'warning',
            });
        }
    };

    const handlePasswordChange = (event) => {
        const value = event.target.value;
        setPassword(value);
        if (value.trim() === "") {
            Swal.fire({
                text: "Password không được để trống hoặc chỉ có khoảng trắng",
                icon: 'warning',
            });
        }
    };

    const handleEmailChange = (event) => {
        const value = event.target.value;
        setEmail(value);

        if (emailError && validateEmail(value)) {
            setEmailError('');
        }
    };

    const handleRegister = async (event) => {
        event.preventDefault();

        if (!validateEmail(email)) {
            setEmailError("Email không hợp lệ");
            return;
        }

        if (username.trim() === "" || password.trim() === "") {
            return Swal.fire({
                text: "Username và Password không được để trống hoặc chỉ có khoảng trắng",
                icon: 'warning',
            });
        }

        const usersRef = collection(db, "users");
        const q = query(usersRef, where("username", "==", username));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            return Swal.fire({
                text: "Select another username",
                icon: 'warning',
            });
        }

        try {
            const res = await createUserWithEmailAndPassword(auth, email, password);
            let imgUrl = "";
            if (avatar.file) {
                imgUrl = await upload(avatar.file);
            }

            const userData = {
                username,
                email,
                password,
                gender: isMale ? 'male' : 'female',
                id: res.user.uid,
            };

            if (imgUrl) {
                userData.avatar = imgUrl;
            }

            await setDoc(doc(db, "users", res.user.uid), userData);

            const requestData = {
                action: "onchat",
                data: {
                    event: "REGISTER",
                    data: {
                        user: username,
                        pass: password,
                    }
                }
            };

            const socket = new WebSocket("ws://140.238.54.136:8080/chat/chat");

            socket.onopen = () => {
                Swal.fire({
                    text: "Kết nối WebSocket thành công",
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
                socket.send(JSON.stringify(requestData));
            };

            socket.onmessage = (event) => {
                const response = JSON.parse(event.data);
                if (response.status === "success") {
                    Swal.fire({
                        position: 'center',
                        icon: response.status,
                        title: response.status,
                        showConfirmButton: false,
                        timer: 1500
                    }).then(() => {
                        navigate("/login");
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: response.status,
                        text: response.mes,
                    });
                }
                socket.close();
            };

            socket.onerror = (error) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi WebSocket',
                    text: 'Không thể kết nối WebSocket',
                });
            };

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message,
            });
        }
    };


    return (
        <MDBContainer style={{ marginTop: '100px' }} fluid>
            <MDBCard style={{ borderRadius: '25px', marginTop: '50px' }}>
                <MDBCardBody>
                    <MDBRow>
                        <MDBCol md='10' lg='6' className='order-2 order-lg-1 d-flex flex-column align-items-center'>
                            <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Đăng ký</p>
                            <form onSubmit={handleRegister}>
                                <div className="d-flex flex-row align-items-center mb-4">
                                    <MDBIcon fas icon="user me-3" size='lg'/>
                                    <MDBInput
                                        label='Username'
                                        id='form2'
                                        type='text'
                                        value={username}
                                        onChange={handleUsernameChange}
                                    />
                                </div>
                                <div className="d-flex flex-row align-items-center mb-4">
                                    <MDBIcon fas icon="lock me-3" size='lg'/>
                                    <MDBInput
                                        label='Mật khẩu'
                                        id='form3'
                                        type='password'
                                        value={password}
                                        onChange={handlePasswordChange}
                                    />
                                </div>
                                <div className="d-flex flex-row align-items-center mb-4">
                                    <MDBIcon fas icon="envelope me-3" size='lg'/>
                                    <MDBInput
                                        label='Email'
                                        id='form4'
                                        type='email'
                                        value={email}
                                        onChange={handleEmailChange}
                                    />
                                </div>
                                {emailError && <p className="text-danger">{emailError}</p>}
                                <div className="mb-4 d-flex">
                                    <MDBCheckbox id='male' label='Male' value='male' checked={isCheckedMale}
                                                 onChange={handleMaleChange} class="mr-2"/>
                                    <MDBCheckbox id='female' label='Female' value='female' checked={isCheckedFemale}
                                                 onChange={handleFemaleChange} class="ml-2"/>
                                </div>
                                <div className="mb-4 d-flex align-items-center">
                                    <input
                                        type="file"
                                        id="file"
                                        style={{ display: "none" }}
                                        onChange={handleAvatar}

                                    />
                                    <label htmlFor="file" className="LabelUpload" >
                                        <div className="img_cont_msg">
                                        <img  src={avatar.url || ava} alt=""
                                             className="rounded-circle user_img_msg"
                                        />
                                        </div>
                                        <span id="UploadImg" >Upload an image</span>

                                    </label>
                                </div>
                                <MDBBtn className='mb-4' size='lg' type="submit">Đăng ký</MDBBtn>
                                <p className="small fw-bold mt-2 pt-1 mb-2">Already have an account? <Link
                                    to="/login">Login</Link></p>
                            </form>
                        </MDBCol>
                        <MDBCol md='10' lg='6' className='order-1 order-lg-2 d-flex align-items-center'>
                            <MDBCardImage
                                src='https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp'
                                fluid/>
                        </MDBCol>
                    </MDBRow>
                </MDBCardBody>
            </MDBCard>
        </MDBContainer>
    );
};

export default Register;

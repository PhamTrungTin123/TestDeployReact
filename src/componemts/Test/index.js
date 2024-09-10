import React, { useState, useEffect } from "react";
import {
    MDBBtn,
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBCardImage,

}
    from 'mdb-react-ui-kit';
const Test = () => {
    const [roomName, setRoomName] = useState("");
    const [socket, setSocket] = useState(null);
    const [isLoginSuccess, setIsLoginSuccess] = useState(false);

    const [name, setName] = useState("");
    const [page, setPage] = useState("");

    const [error, setError] = useState('');

    const [userList, setUserList] = useState([]);

    const [user, setUser] = useState("");
    const [pass, setPass] = useState("");

    const [currentName, setCurrentName] = useState("");

    // Khi component được tạo, thiết lập kết nối WebSocket
    useEffect(() => {
        const newSocket = new WebSocket("ws://140.238.54.136:8080/chat/chat");
        newSocket.addEventListener("open", (event) => {
            console.log("Kết nối WebSocket đã được thiết lập", event);
            setSocket(newSocket);
        });

        return () => {
            // Đóng kết nối WebSocket khi component bị hủy
            newSocket.close();
        };
    }, []);

    useEffect(() => {
        const handleLogin = () => {
            // Gửi yêu cầu đăng nhập đến server WebSocket
            const requestData = {
                action: "onchat",
                data: {
                    event: "LOGIN",
                    data: {
                        user: sessionStorage.getItem('username'),
                        pass: sessionStorage.getItem('password'),
                    },
                },
            };

            // socket.send(JSON.stringify(requestData));
            console.log("Đã gửi yêu cầu đăng nhập ở trang HOME")
        };
    }, []);
    const handleJoin = () => {
        const requestcreateRoom = {
            action: "onchat",
            data: {
                event: "JOIN_ROOM",
                data: {
                    name: 'fox',
                },
            },
        };
        socket.send(JSON.stringify(requestcreateRoom));
    }
    const handlecheck = () => {
        const requestcreateRoom = {
            action: "onchat",
            data: {
                event: "CHECK_USER",
                data: {
                    user: "20130357"
                },
            },
        };
        socket.send(JSON.stringify(requestcreateRoom));
    }
    const handleLogout = () => {
        const requestcreateRoom = {
            action: "onchat",
            data: {
                event: "LOGOUT",
            },
        };
        socket.send(JSON.stringify(requestcreateRoom));
    }
    const handleLogin = () => {
        // Gửi yêu cầu đăng nhập đến server WebSocket
        const requestData = {
            action: "onchat",
            data: {
                event: "LOGIN",
                data: {
                    // user: sessionStorage.getItem('username'),
                    // pass: sessionStorage.getItem('password'),
                    user: user,
                    pass: pass
                },
            },
        };

        socket.send(JSON.stringify(requestData));
        console.log("Đã gửi yêu cầu đăng nhập ở trang HOME")


        socket.onmessage = (event) => {
            const response = JSON.parse(event.data);
            if (response.status === 'success' && response.event === 'GET_ROOM_CHAT_MES') {
                const users = response.data.chatData;
                setUserList(users);
                console.log(users);
            }
        }

    };


    // Sau khi đăng nhập thành công, set socket và lưu trữ thông tin đăng nhập
    useEffect(() => {
        if (socket) {
            socket.onmessage = (event) => {
                const responseData = JSON.parse(event.data);
                if (responseData && responseData.status === "success") {
                    // Đăng nhập thành công
                    setIsLoginSuccess(true);
                    // Lưu trữ thông tin đăng nhập, ví dụ: lưu trữ token
                }
            };
        }
    }, [socket]);

    return (
        <><ul>
            {Array.isArray(userList) ? (
                userList.map((user, index) => (
                    <li key={index}>
                        {user.name}<br />
                        {user.mes}<br />
                    </li>
                ))) : (
                <li>no user</li>
            )}
        </ul><><MDBContainer style={{ marginTop: '100px' }} fluid>
            <MDBCard className='text-black m-5' style={{ borderRadius: '25px', marginTop: '50px' }}>
                <MDBCardBody>
                    <MDBRow>
                        <MDBCol md='10' lg='6' className='order-2 order-lg-1 d-flex flex-column align-items-center'>

                            <p classNAme="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Sign up</p>


                            {/* <div className="d-flex flex-row align-items-center mb-4">
        <MDBIcon fas icon="envelope me-3" size='lg' />
        <MDBInput
            value={name}
            onChange={(e) => setName(e.target.value)}
            label='Username' id='form2' type='email' />
    </div> */}

                            {/* <div className="d-flex flex-row align-items-center mb-4">
        <MDBIcon fas icon="lock me-3" size='lg' />

        <MDBInput
            value={page}
            onChange={(e) => setPage(e.target.value)}
            label='Password' id='form3' type='password' />
    </div> */}
                            <MDBBtn className='mb-4' size='lg' onClick={handleJoin}>Join</MDBBtn>
                            {error && <div className="alert alert-danger mt-3">{error}</div>}
                            <MDBBtn className='mb-4' size='lg' onClick={handleLogout}>logout</MDBBtn>
                            <MDBBtn className='mb-4' size='lg' onClick={handlecheck}>Check</MDBBtn>

                        </MDBCol>

                        <MDBCol md='10' lg='6' className='order-1 order-lg-2 d-flex align-items-center'>
                            <MDBCardImage src='https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp' fluid />
                        </MDBCol>

                    </MDBRow>
                </MDBCardBody>
            </MDBCard>

        </MDBContainer><div>
                    <input
                        type="text"
                        value={user}
                        onChange={(e) => setUser(e.target.value)}
                        placeholder="Nhập tên người dùng" />
                    <input
                        type="password"
                        value={pass}
                        onChange={(e) => setPass(e.target.value)}
                        placeholder="Nhập mật khẩu" />
                    <button onClick={handleLogin}>Đăng nhập</button>

                </div></></>
    );
};

export default Test;
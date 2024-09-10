import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { MDBContainer, MDBCol, MDBRow, MDBBtn, MDBIcon, MDBInput, MDBCheckbox } from 'mdb-react-ui-kit';
import Swal from 'sweetalert2';
import { useWebSocket } from "../WebSocket/WebSocketContext";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, provider, db } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const socket = useWebSocket();
  const usernameRef = useRef(username);
  const passwordRef = useRef(password);
  useEffect(() => {
    const sessionData = localStorage.getItem('sessionData');
    if (sessionData) {
      navigate("/chat");
    }
  }, [navigate]);
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
  useEffect(() => {
    usernameRef.current = username;
  }, [username]);
  useEffect(() => {
    passwordRef.current = password;
  }, [password]);

  const handleGoogleSignIn = async () => {
    try {
      const data = await signInWithPopup(auth, provider);
      const email = data.user.email;

      // Check if the email exists in the Firestore users collection
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Email not found in the database',
        });
        return;
      }

      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
      const username = userData.username;
      const password = userData.password;

      // Store email, username, and password in local storage
      localStorage.setItem("email", email);
      localStorage.setItem("username", username);

      // Prepare request data for the API
      const requestData = {
        action: "onchat",
        data: {
          event: "LOGIN",
          data: {
            user: username,
            pass: password
          }
        }
      };

      // Send request to the WebSocket API
      if (socket) {
        socket.send(JSON.stringify(requestData));
      } else {
        Swal.fire({
          text: "WebSocket connection is not established",
          icon: 'error',
        });
        return;
      }

      // Handle WebSocket response
      const handleMessage = (event) => {
        const response = JSON.parse(event.data);
        if (response.status === "success" && response.event === "LOGIN") {
          const reloginCode = response.data.RE_LOGIN_CODE;
          localStorage.setItem("sessionData", JSON.stringify({
            username,
            password,
            code: response.data.RE_LOGIN_CODE,
            reloginCode: btoa(reloginCode),
          }));
          sessionStorage.setItem("sessionData", JSON.stringify({
            username,
            password,
            code: response.data.RE_LOGIN_CODE,
            reloginCode: btoa(reloginCode),
          }));

          const userListRequest = {
            action: 'onchat',
            data: {
              event: 'GET_USER_LIST',
            },
          };
          socket.send(JSON.stringify(userListRequest));
        } else if (response.status === "error" && response.event === "LOGIN") {
          Swal.fire({
            icon: 'error',
            title: response.status,
            text: response.mes,
          });
        } else if (response.status === 'success' && response.event === 'GET_USER_LIST') {
          const users = response.data;
          localStorage.setItem("userList", JSON.stringify(users));
          sessionStorage.setItem("userList", JSON.stringify(users));

          navigate("/chat", { state: { username, password, userList: users } });
        }
      };

      const handleError = () => {
        Swal.fire({
          icon: 'error',
          title: 'WebSocket Error',
          text: 'Unable to establish WebSocket connection',
        });
      };

      socket.addEventListener('message', handleMessage);
      socket.addEventListener('error', handleError);

      return () => {
        socket.removeEventListener('message', handleMessage);
        socket.removeEventListener('error', handleError);
      };
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message,
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (username.trim() === "" || password.trim() === "") {
      return Swal.fire({
        text: "Username và Password không được để trống hoặc chỉ có khoảng trắng",
        icon: 'warning',
      });
    }
    try {
      // Fetch the email associated with the provided username
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("username", "==", username));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        return Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Invalid username or password',
        });
      }
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
      const email = userData.email;
      // Authenticate using the fetched email and provided password
      await signInWithEmailAndPassword(auth, email, password);
      if (!socket) {
        return Swal.fire({
          text: "WebSocket connection is not established",
          icon: 'error',
        });
      }
      const requestData = {
        action: "onchat",
        data: {
          event: "LOGIN",
          data: {
            user: username,
            pass: password
          }
        }
      };

      socket.send(JSON.stringify(requestData));
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message,
      });
    }
  };

  useEffect(() => {
    if (!socket) return;

    const handleOpen = () => {
      Swal.fire({
        text: "WebSocket connection established",
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
    };

    const handleMessage = (event) => {
      const response = JSON.parse(event.data);
      if (response.status === "success" && response.event === "LOGIN") {
        const reloginCode = response.data.RE_LOGIN_CODE;
        localStorage.setItem("sessionData", JSON.stringify({
          username: usernameRef.current,
          password: passwordRef.current,
          code: response.data.RE_LOGIN_CODE,
          reloginCode: btoa(reloginCode),
        }));
        sessionStorage.setItem("sessionData", JSON.stringify({
          username: usernameRef.current,
          password: passwordRef.current,
          code: response.data.RE_LOGIN_CODE,
          reloginCode: btoa(reloginCode),
        }));

        const userListRequest = {
          action: 'onchat',
          data: {
            event: 'GET_USER_LIST',
          },
        };
        socket.send(JSON.stringify(userListRequest));
      } else if (response.status === "error" && response.event === "LOGIN") {
        Swal.fire({
          icon: 'error',
          title: response.status,
          text: response.mes,
        });
      } else if (response.status === 'success' && response.event === 'GET_USER_LIST') {
        const users = response.data;
        localStorage.setItem("userList", JSON.stringify(users));
        sessionStorage.setItem("userList", JSON.stringify(users));

        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Login successful',
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          navigate("/chat", { state: { username: usernameRef.current, password: passwordRef.current, userList: users } });
        });
      }
    };

    const handleError = () => {
      Swal.fire({
        icon: 'error',
        title: 'WebSocket Error',
        text: 'Unable to establish WebSocket connection',
      });
    };

    socket.addEventListener('open', handleOpen);
    socket.addEventListener('message', handleMessage);
    socket.addEventListener('error', handleError);

    return () => {
      socket.removeEventListener('open', handleOpen);
      socket.removeEventListener('message', handleMessage);
      socket.removeEventListener('error', handleError);
    };
  }, [socket, navigate]);




  return (
      <MDBContainer fluid className="p-3 my-5 h-custom">
        <MDBRow>
          <MDBCol col='10' md='6'>
            <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp" className="img-fluid" alt="Sample image" />
          </MDBCol>
          <MDBCol col='4' md='6'>
            <div className="d-flex flex-row align-items-center justify-content-center">
              <p className="lead fw-normal mb-0 me-3">Sign in with</p>
              <MDBBtn floating size='md' tag='a' className='me-2'>
                <MDBIcon fab icon='facebook-f' />
              </MDBBtn>
              <MDBBtn floating size='md' tag='a' className='me-2' onClick={handleGoogleSignIn} >
                <MDBIcon fab icon='google' />
              </MDBBtn>
              <MDBBtn floating size='md' tag='a' className='me-2'>
                <MDBIcon fab icon='linkedin-in' />
              </MDBBtn>
            </div>
            <div className="divider d-flex align-items-center my-4">
              <p className="text-center fw-bold mx-3 mb-0">Or</p>
            </div>
            <form onSubmit={handleSubmit}>
              <MDBInput wrapperClass='mb-4' id='formControlLg' size="lg"
                        label="Username"
                        icon="user"
                        value={username}
                        onChange={handleUsernameChange}
              />
              <MDBInput wrapperClass='mb-4' id='formControlLg' type='password' size="lg"
                        label="Password"
                        icon="lock"
                        value={password}
                        onChange={handlePasswordChange}
              />
              <div className="d-flex justify-content-between mb-4">
                <MDBCheckbox name='flexCheck' value='' id='flexCheckDefault' label='Remember me' />
                <a href="#!">Forgot password?</a>
              </div>
              <div className='text-center text-md-start mt-4 pt-2'>
                <MDBBtn className="mb-0 px-5" size='lg' type="submit">Đăng nhập</MDBBtn>
                <p className="small fw-bold mt-2 pt-1 mb-2">Don't have an account? <Link to="/register">Register</Link></p>
              </div>
            </form>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
  );
};

export default Login;
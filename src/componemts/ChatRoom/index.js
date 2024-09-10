import React, {useState, useEffect, useRef} from "react";
import {
    MDBBtn,
    MDBModal,
    MDBModalDialog,
    MDBModalContent,
    MDBModalHeader,
    MDBModalTitle,
    MDBModalBody,
    MDBModalFooter,
    MDBIcon,
    MDBInput,
    MDBTabs,
    MDBTabsItem,
    MDBTabsLink,
    MDBTabsContent,
    MDBTabsPane
} from 'mdb-react-ui-kit';
import './style.css';
import {useNavigate} from 'react-router-dom';
import Swal from "sweetalert2";
import {useWebSocket} from "../WebSocket/WebSocketContext";

import {fromByteArray, toByteArray } from 'base64-js';
import axios from 'axios';


import {
    getFirestore,
    collection,
    getDocs,
    getDoc,
    updateDoc,
    doc,
    setDoc,
    query,
    where,
    addDoc,
    arrayRemove,
    arrayUnion
} from "firebase/firestore";
import ava from "../../img/addAvatar.png";

import upload from "../../componemts/ChatRoom/upload";
import word from "../../img/file-type-word.256x239.png";
import pdf from "../../img/file-type-pdf2.252x256.png";
import xlsx from "../../img/file-type-excel.256x239.png";
import txt from "../../img/file-txt.204x256.png";
import zip from "../../img/zip.188x256.png";
import pptx from "../../img/filetype-pptx.209x256.png";
import html from "../../img/file-type-html.226x256.png";
import css from "../../img/file-type-css.226x256.png";
import js from "../../img/file-type-js-official.256x256.png";
import ts from "../../img/file-type-typescript-official.256x256.png";
import mp3 from "../../img/audio-x-mp3-playlist.256x253.png";
import csv from "../../img/csv.224x256.png"
import java from "../../img/java-original-wordmark.139x256.png";
import sql from "../../img/sql-database-sql-azure.245x256.png";
import drawio from "../../img/file-type-drawio.256x256.png";
import {auth, db,storage} from "../../firebase";
import EmojiPicker from 'emoji-picker-react';

import {getStorage, ref, uploadBytes, getDownloadURL} from "firebase/storage";



export default function ChatRoom() {
    const [basicModal, setBasicModal] = useState(false);
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const socket = useWebSocket();

    const sessionData = JSON.parse(sessionStorage.getItem('sessionData')) || {};
    const {username, code} = sessionData;

    const usernameRef = useRef(username);
    const initialUserList = JSON.parse(localStorage.getItem('userList')) || [];
// =======
//     const initialUserList = JSON.parse(sessionStorage.getItem('userList')) || [];
// >>>>>>> main

    const toggleOpen = () => setBasicModal(!basicModal);
    const specificMessageRef = useRef({});
    const toggleMenu = () => setIsOpen(!isOpen);
    //Tab của change avatar//
    const [activeTab, setActiveTab] = useState('user');
    //Tab của userList//
    const [activeContactsTab, setActiveContactsTab] = useState('user');
    //Tab cho create,join room//
    const [activeRoomTab, setActiveRoomTab] = useState('create');


    const [searchInput, setSearchInput] = useState('');
    const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
    const [userList, setUserList] = useState(initialUserList);
    const [roomOwner, setRoomOwner] = useState('');
    const [messageContent, setMessageContent] = useState('');
    const [messageContentChat, setMessageContentChat] = useState('');
    const [displayName, setDisplayName] = useState(username);
    const [type, setType] = useState(0);
    const [lastMessage, setLastMessage] = useState(null);
    const [lastIndex, setlastIndex] = useState(-1);
    const [searchType, setSearchType] = useState('');
    const [messages, setMessages] = useState([]);
    const [darkMode, setDarkMode] = useState(false);
    const [roomNames, setRoomNames] = useState('');
    const messagesEndRef = useRef(null);
    const [scrollToBottom, setScrollToBottom] = useState(false); // State để xác định cuộn xuống dưới cùng
    const [userAvatar, setUserAvatar] = useState('https://therichpost.com/wp-content/uploads/2020/06/avatar2.png');
    const [data, setData] = useState([]);
    const [rooms, setRooms] = useState([])
    const [roomAvatar, setRoomAvatar] = useState('');
    const [isGifPickerVisible, setGifPickerVisible] = useState(false);
    const [gifs,setGifs] = useState(false);
    const GIPHY_API_KEY = '5LcV29T4yVNSvuCZ3vu2S2BQpUdfWHIy'; // Thay bằng API key của bạn
    const [searchTerm, setSearchTerm] = useState('');
    const [gifList, setGifList] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);


    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setSelectedFiles(prevFiles => [...prevFiles, ...files]);
            files.forEach(file => console.log("Selected file:", file.name)); // Log each file name
        }
    };



    const [avatarUrls, setAvatarUrls] = useState({});


    const [avatar, setAvatar] = useState({

        file: null,

        url: "",

    });


    const [userStatuses, setUserStatuses] = useState({});

    const handleAvatar = (e) => {

        if (e.target.files[0]) {

            setAvatar({

                file: e.target.files[0],

                url: URL.createObjectURL(e.target.files[0]),

            });

        }

    };
    const fetchGifs = (term) => {
        axios.get(`https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${term}&limit=10`)
            .then(response => {
                const gifs = response.data.data;
                setGifList(gifs.map(gif => gif.images.fixed_height.url));

                // Hiển thị tên file gif trong console
                console.log('GIFs:', gifs.map(gif => gif.title || gif.slug || 'Unknown'));

                if (!isGifPickerVisible) {
                    setGifPickerVisible(true);
                }
            })
            .catch(error => console.error('Error fetching GIFs:', error));
    };
    const handleGifClick = async (gifUrl) => {
        if (gifUrl === '') return;

        // Encode message content
        const messageBytes = new TextEncoder().encode(gifUrl);
        const encodedMessageGif = fromByteArray(messageBytes);

        // Determine if displayName is a room
        const isRoom = userList.some(user => user.name === displayName && user.type === 1);

        let chatMessage;
        if (isRoom) {
            console.log("Sending message to room:", displayName);
            chatMessage = {
                action: "onchat",
                data: {
                    event: "SEND_CHAT",
                    data: {
                        type: "room",
                        to: displayName,
                        mes: encodedMessageGif
                    }
                }
            };
        } else {
            console.log("Sending message to user:", displayName);
            chatMessage = {
                action: "onchat",
                data: {
                    event: "SEND_CHAT",
                    data: {
                        type: "people",
                        to: displayName,
                        mes: encodedMessageGif
                    }
                }
            };
        }

        // Create a new message object for immediate display
        const date = new Date();

        date.setHours(date.getHours() - 7);

        const adjustedCreateAt = date.toISOString();



        // Create a new message object for immediate display



        // Create a new message object for immediate display

        // const newMessage = {
        //
        //     name: username,
        //     createAt: adjustedCreateAt, //
        //     mes: messageContentChat.trim(), // Use the plain message content
        //     type: isRoom ? "room" : "people",
        //     to: displayName
        // }

        if (socket && socket.readyState === WebSocket.OPEN) {
            setMessageContentChat(''); // Clear message content after sending
            setScrollToBottom(true); // Scroll to bottom
            console.log('Message object:', chatMessage);
            socket.send(JSON.stringify(chatMessage));
            setShouldFetchMessages(true);

            // Update messages state immediately
            // setMessages(prevMessages => [...prevMessages, newMessage]);
        } else {
            console.error('WebSocket is not open. Unable to send message.');
        }
        setGifPickerVisible(false);
    };
    // Hàm kiểm tra trạng thái user
    const checkUserStatus = (usernameToCheck) => {
        if (!socket || socket.readyState !== WebSocket.OPEN) {
            console.error('WebSocket connection is not open');
            return;
        }

        const requestData = {
            action: "onchat",
            data: {
                event: "CHECK_USER",
                data: {
                    user: usernameToCheck
                }
            }
        };

        console.log('Sent request:', requestData); // In ra yêu cầu để kiểm tra
        socket.send(JSON.stringify(requestData));
    };

    // Xử lý khi nhận được tin nhắn kiểm tra trạng thái người dùng
    const handleCheckUserMessage = (event) => {
        const response = JSON.parse(event.data);
        console.log('Received response:', response); // In ra toàn bộ phản hồi để kiểm tra

        if (response.event === "CHECK_USER") {
            const isOnline = response.data.status;

            // Tìm người dùng đang chờ phản hồi và cập nhật trạng thái
            const userIndex = userList.findIndex(user => user.pending);
            if (userIndex !== -1) {
                const usernameToCheck = userList[userIndex].name;
                userList[userIndex].status = isOnline; // Cập nhật trạng thái trong userList
                userList[userIndex].pending = false; // Đánh dấu là đã nhận phản hồi

                console.log('response.data:', response.data);
                console.log('usernameToCheck:', usernameToCheck);

                setUserStatuses(prevStatuses => ({
                    ...prevStatuses,
                    [usernameToCheck]: isOnline
                }));

                if (isOnline) {
                    console.log(`${usernameToCheck} is online`);
                    // Nếu bất kỳ người dùng nào trực tuyến, đánh dấu tất cả phòng là trực tuyến
                    userList.forEach(user => {
                        if (user.type === 1) { // type === 1 indicates a room
                            setUserStatuses(prevStatuses => ({
                                ...prevStatuses,
                                [user.name]: true
                            }));
                        }
                    });
                } else {
                    console.log(`${usernameToCheck} is offline`);
                }
            }
        } else if (response.event === "ACTION_NOT_EXIST") {
            console.error('Received an unknown action:', response); // Thông báo lỗi nếu sự kiện không tồn tại
        }
    };

    useEffect(() => {
        if (!socket) return;

        console.log('userList:', userList); // Log để kiểm tra dữ liệu userList

        if (userList.length > 0) {
            // Đánh dấu tất cả người dùng là đang chờ phản hồi nếu chưa đánh dấu
            userList.forEach(user => {
                if (user.type === 0 && !user.pending) { // Only check users (type === 0)
                    user.pending = true;
                    console.log('Checking user:', user.name); // Log để kiểm tra mỗi lần kiểm tra user
                    checkUserStatus(user.name);
                } else if (user.type === 1) { // Mark all rooms as online initially
                    setUserStatuses(prevStatuses => ({
                        ...prevStatuses,
                        [user.name]: true
                    }));
                }
            });

            socket.addEventListener('message', handleCheckUserMessage);

            return () => {
                // Cleanup khi component unmount
                socket.removeEventListener('message', handleCheckUserMessage);
            };
        }
    }, [socket, userList]);


    useEffect(() => {
        usernameRef.current = username;
    }, [username]);
    // Sử dụng useEffect để cuộn xuống dưới cùng khi có tin nhắn mới


    // Sử dụng useEffect để cuộn xuống dưới cùng khi có tin nhắn mới


    useEffect(() => {
        if (scrollToBottom) {
            const msgCardBody = document.querySelector('.msg_card_body');
            if (msgCardBody) {
                msgCardBody.scrollTop = msgCardBody.scrollHeight;
            }
            setScrollToBottom(false); // Đặt lại trạng thái sau khi cuộn xuống
        }
    }, [messages, scrollToBottom]);

    const [joinRoomCode, setJoinRoomCode] = useState('');
    const [joinRoomModal, setJoinRoomModal] = useState(false);
    const [changeAvatarModal, setChangeAvatarModal] = useState(false);
    const [roomModal, setRoomModal] = useState(false);


    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark-mode');
        } else {
            document.documentElement.classList.remove('dark-mode');
        }
    }, [darkMode]);

    useEffect(() => {
        const handleBeforeUnload = () => {
            //
            // localStorage.clear();
            // sessionStorage.clear();

        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    const handleToggleDarkMode = () => {
        setDarkMode(prevMode => !prevMode);
    };

    const fetchUserData = async () => {
        try {
            const db = getFirestore();
            const userRef = collection(db, 'users');
            const snapshot = await getDocs(userRef);
            const allData = snapshot.docs.map(doc => ({...doc.data(), id: doc.id}));
            setData(allData);
            console.log(allData);

            const userData = allData.find(user => user.username === username);

            if (userData) {
                if (userData.avatar && userData.avatar.length > 0) {
                    setUserAvatar(userData.avatar);
                } else {
                    if (userData.gender === 'male') {
                        setUserAvatar('https://bootdey.com/img/Content/avatar/avatar7.png');
                    } else if (userData.gender === 'female') {
                        setUserAvatar('https://bootdey.com/img/Content/avatar/avatar3.png');
                    }
                }
            } else {
                console.log('No matching user found in Firestore');
            }

        } catch (error) {
            console.error(error);
        }
    };
    const fetchRoomData = async () => {

        try {

            const db = getFirestore();

            const roomRef = collection(db, 'rooms');

            const snapshot = await getDocs(roomRef);

            const roomData = snapshot.docs.map(doc => ({...doc.data(), id: doc.id}));

            setRooms(roomData);

            console.log(roomData);

        } catch (error) {

            console.error(error);

        }

    };

    useEffect(() => {
        fetchUserData();
    }, [username]);
    useEffect(() => {

        fetchRoomData();

    }, []);


    useEffect(() => {
        if (!socket) return;

        const handleReload = () => {
            if (username && code) {
                const requestData = {
                    action: "onchat",
                    data: {
                        event: "RE_LOGIN",
                        data: {
                            user: username,
                            code: code
                        }
                    }
                };

                if (socket.readyState === WebSocket.OPEN) {
                    socket.send(JSON.stringify(requestData));
                } else {
                    socket.addEventListener('open', () => {
                        socket.send(JSON.stringify(requestData));
                    }, {once: true});
                }
            }
        };

        const handleReloginMessage = (event) => {
            const response = JSON.parse(event.data);
            if (response.event === "RE_LOGIN") {
                if (response.status === "success") {
                    sessionStorage.setItem('sessionData', JSON.stringify({
                        username: username,
                        code: response.data.RE_LOGIN_CODE
                    }));
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: response.status,
                        text: response.mes,
                    });
                }
            }
        };

        handleReload();

        window.addEventListener('beforeunload', handleReload);
        socket.addEventListener('message', handleReloginMessage);

        return () => {
            window.removeEventListener('beforeunload', handleReload);
            socket.removeEventListener('message', handleReloginMessage);
        };
    }, [socket, username, code]);

    useEffect(() => {
        const savedUserList = JSON.parse(sessionStorage.getItem('userList'));
        if (savedUserList) {
            setUserList(savedUserList);
        }

        const roomData = JSON.parse(sessionStorage.getItem('data'));
        if (roomData && roomData.own) {
            const roomOwner = roomData.own;
            setRoomOwner(roomOwner);
            setMessageContent(username === roomOwner ? 'Người tạo phòng' : 'Người tham gia');
        }
    }, [username]);

    const handleLogout = () => {
        if (!socket || socket.readyState !== WebSocket.OPEN) {
            console.error('WebSocket connection is not open');
            Swal.fire({
                icon: 'error',
                title: 'WebSocket Error',
                text: 'Unable to establish WebSocket connection',
            });
            return;
        }

        const requestData = {
            action: "onchat",
            data: {
                event: "LOGOUT",
            }
        };
        socket.send(JSON.stringify(requestData));

        const handleLogoutMessage = (event) => {
            const response = JSON.parse(event.data);

            if (response.status === "success") {
                sessionStorage.clear();
                localStorage.clear();
                sessionStorage.removeItem('userList');
                setUserList([]);
                setDisplayName('');
                setMessages([]);
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Logout successful',
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    navigate('/logout');
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: response.status,
                    text: response.mes,
                });
            }

            socket.removeEventListener('message', handleLogoutMessage);
        };

        socket.addEventListener('message', handleLogoutMessage);
    };


// <<<<<<< HEAD
//     const handleCreateRoom = () => {
// =======
    const handleCreateRoom = async () => {
        // Get sessionData from local storage
        const sessionData = JSON.parse(sessionStorage.getItem('sessionData'));
        const sessionUsername = sessionData ? sessionData.username : '';

        const roomAvatar = avatar.file ? await upload(avatar.file) : 'https://therichpost.com/wp-content/uploads/2020/06/avatar2.png';

        setRoomAvatar(roomAvatar);

        // Generate a new document ID for the room
        const roomDocRef = doc(collection(db, 'rooms'));
        const roomId = roomDocRef.id;

        // Create room data with the generated ID
        const firestoreRoomData = {
            id: roomId,
            roomname: roomNames,
            roomavatar: roomAvatar,
            createdBy: sessionUsername // Use username from sessionData
        };

        // Add room to Firestore with the specified ID
        await setDoc(roomDocRef, firestoreRoomData);

        const createRoom = {
            action: "onchat",
            data: {
                event: "CREATE_ROOM",
                data: {
                    name: roomNames
                }
            }
        };

        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(createRoom));
        } else {
            console.error('WebSocket is not open. Unable to send message.');
            return;
        }
    };

    useEffect(() => {
        const handleCreateRoomResponse = (event) => {
            const response = JSON.parse(event.data);
            console.log('Received response:', response);

            if (response.event === "CREATE_ROOM") {
                if (response.status === "success") {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: response.status,
                        text: response.message,
                        showConfirmButton: false,
                        timer: 1500
                    });

                    const currentDate = new Date();
                    currentDate.setHours(currentDate.getHours() - 7);
                    const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')} ${String(currentDate.getHours()).padStart(2, '0')}:${String(currentDate.getMinutes()).padStart(2, '0')}:${String(currentDate.getSeconds()).padStart(2, '0')}`;

                    const newUserList = [{
                        name: roomNames,
                        type: 1,
                        actionTime: formattedDate,
                        roomOwner: username,
                        avatar: roomAvatar // Include the room avatar
                    }, ...userList];

                    setUserList(newUserList);
                    sessionStorage.setItem('userList', JSON.stringify(newUserList));

                    // Extract the room data from the response
                    const roomResponseData = {
                        id: response.data.id,
                        name: response.data.name,
                        own: response.data.own,
                        userList: response.data.userList,
                        chatData: response.data.chatData
                    };

                    // Update the rooms state with the extracted room data
                    setRooms(prevRooms => [...prevRooms, roomResponseData]);

                    // Save room data to sessionStorage
                    const roomSessionData = {
                        own: username
                    };
                    sessionStorage.setItem('data', JSON.stringify(roomSessionData));

                    // Log the response data
                    console.log('Room created successfully:', response.data);
                } else {
                    Swal.fire({
                        icon: 'warning',
                        text: 'Tên phòng đã tồn tại!',
                    });
                    console.error('Chi tiết lỗi tạo phòng:', response);
                }
            }
        };

        if (socket) {
            socket.addEventListener('message', handleCreateRoomResponse);
        }

        return () => {
            if (socket) {
                socket.removeEventListener('message', handleCreateRoomResponse);
            }
        };
    }, [socket, userList, roomNames, username, roomAvatar]);


    const handleSearchInputChange = (event) => {
        setSearchInput(event.target.value);
    };

    const handleCheckboxChange = (event) => {
        setIsCheckboxChecked(event.target.checked);
    };

    const handleSearch = () => {
        if (!socket || socket.readyState !== WebSocket.OPEN) {
            console.error('WebSocket connection is not open');
            Swal.fire({
                icon: 'error',
                title: 'WebSocket Error',
                text: 'Unable to establish WebSocket connection',
            });
            return;
        }

        const trimmedSearchInput = searchInput.trim();

        if (!isCheckboxChecked) {
            const user = userList.find(user => user.name === trimmedSearchInput && user.type === 0);
            if (user) {
                setDisplayName(user.name);
                setMessageContent('Người dùng');
                setSearchType('user');

                // Set user avatar
                let avatarSrc = 'https://therichpost.com/wp-content/uploads/2020/06/avatar2.png';
                if (user.avatar) {
                    avatarSrc = user.avatar;
                } else {
                    const matchedUser = data.find(dbUser => dbUser.username === user.name);
                    if (matchedUser) {
                        if (matchedUser.gender === 'male') {
                            avatarSrc = 'https://bootdey.com/img/Content/avatar/avatar7.png';
                        } else if (matchedUser.gender === 'female') {
                            avatarSrc = 'https://bootdey.com/img/Content/avatar/avatar3.png';
                        }
                    }
                }

                setUserAvatar(avatarSrc);

                Swal.fire({
                    text: `User ${user.name} exists.`,
                    icon: 'success',
                });

                // Fetch messages for the user
                fetchMessages('GET_PEOPLE_CHAT_MES', user.name, 0);
            } else {
                Swal.fire({
                    text: `User ${trimmedSearchInput} does not exist.`,
                    icon: 'warning',
                });
            }
        } else {
            const requestData = {
                action: "onchat",
                data: {
                    event: "GET_ROOM_CHAT_MES",
                    data: {
                        name: trimmedSearchInput,
                        page: 1
                    }
                }
            };

            socket.send(JSON.stringify(requestData));

            socket.onmessage = (event) => {
                const response = JSON.parse(event.data);
                if (response.status === "success") {
                    const roomName = trimmedSearchInput;
                    const matchedRoom = rooms.find(room => room.roomname === roomName);

                    if (!matchedRoom) {
                        Swal.fire({
                            text: `Room ${roomName} does not exist.`,
                            icon: 'warning',
                        });
                        return;
                    }

                    let savedUserList = JSON.parse(sessionStorage.getItem('userList')) || [];
                    const existingRoom = savedUserList.find(room => room.name === roomName);
                    if (!existingRoom) {
                        savedUserList.push(matchedRoom);
                        sessionStorage.setItem('userList', JSON.stringify(savedUserList));
                    }

                    setDisplayName(roomName);
                    setMessageContent('Phòng');
                    setSearchType('room');

                    // Update room avatar similar to handleLiClick
                    let avatarSrc = 'https://therichpost.com/wp-content/uploads/2020/06/avatar2.png';
                    const sessionRoom = savedUserList.find(room => room.name === roomName && room.type === 1);
                    if (sessionRoom && sessionRoom.avatar) {
                        avatarSrc = sessionRoom.avatar;
                    } else {
                        if (matchedRoom && matchedRoom.roomavatar) {
                            avatarSrc = matchedRoom.roomavatar;
                        }
                    }

                    setUserAvatar(avatarSrc);
                    setAvatarUrls(prevState => ({...prevState, [roomName]: avatarSrc}));

                    Swal.fire({
                        text: `Room ${roomName} exists.`,
                        icon: 'success',
                    });

                    // Fetch messages for the room
                    fetchMessages('GET_ROOM_CHAT_MES', roomName, 1);
                } else {
                    Swal.fire({
                        text: `Room ${trimmedSearchInput} does not exist.`,
                        icon: 'warning',
                    });
                }
            };
        }
    };


    const fetchMessages = (event, name, type) => {
        const requestData = {
            action: "onchat",
            data: {
                event: event,
                data: {
                    name: name,
                    page: 1
                }
            }
        };

        socket.send(JSON.stringify(requestData));

        socket.onmessage = (event) => {
            const response = JSON.parse(event.data);
            if (response.status === "success") {
                let fetchedMessages = [];

                if (type === 0 && Array.isArray(response.data)) {
                    fetchedMessages = response.data.reverse();
                } else if (type === 1 && response.data && Array.isArray(response.data.chatData)) {
                    fetchedMessages = response.data.chatData.reverse();
                }

                setMessages(fetchedMessages);
                setScrollToBottom(true); // Scroll to bottom when new messages are received
            // } else {
            //     Swal.fire({
            //         text: `Failed to fetch messages for ${name}.`,
            //         icon: 'error',
            //     });
            }
        };
    };


    // Hàm để lấy tất cả phản ứng từ Firestore
    const fetchReactions = async () => {
        const querySnapshot = await getDocs(collection(db, "messages"));
        const reactionsMap = {};
        querySnapshot.forEach((doc) => {
            reactionsMap[doc.id] = doc.data().reactions;
        });
        return reactionsMap;
    };
    const scrollToMessage = (messageId) => {
        if (specificMessageRef.current[messageId]) {
            specificMessageRef.current[messageId].scrollIntoView({behavior: 'smooth'});
        }
    };

    const handleLiClick = async (name, type, roomOwner) => {
        setType(type);
        setDisplayName(name);
        setMessageContent(type === 0 ? 'Người dùng' : 'Phòng');
        setSearchType(type === 0 ? 'user' : 'room');
        let avatarSrc = 'https://therichpost.com/wp-content/uploads/2020/06/avatar2.png';

        const sessionData = JSON.parse(sessionStorage.getItem('userList'));

        if (type === 0) {
            const sessionUser = sessionData ? sessionData.find(user => user.name === name) : null;

            if (sessionUser && sessionUser.avatar) {
                avatarSrc = sessionUser.avatar;
            } else {
                const matchedUser = data.find(dbUser => dbUser.username === name);

                if (matchedUser) {
                    if (matchedUser.avatar && matchedUser.avatar.length > 0) {
                        avatarSrc = matchedUser.avatar;
                    } else if (matchedUser.gender === 'male') {
                        avatarSrc = 'https://bootdey.com/img/Content/avatar/avatar7.png';
                    } else if (matchedUser.gender === 'female') {
                        avatarSrc = 'https://bootdey.com/img/Content/avatar/avatar3.png';
                    }
                }
            }
        } else if (type === 1) {
            const sessionRoom = sessionData ? sessionData.find(room => room.name === name && room.type === 1) : null;
            if (sessionRoom && sessionRoom.avatar) {
                avatarSrc = sessionRoom.avatar;
            } else {
                const matchedRoom = rooms.find(room => room.roomname === name);
                if (matchedRoom && matchedRoom.roomavatar) {
                    avatarSrc = matchedRoom.roomavatar;
                }
            }
        }

        setUserAvatar(avatarSrc);
        setAvatarUrls(prevState => ({...prevState, [name]: avatarSrc}));

        // Update sessionStorage
        const updatedSessionData = sessionData.map(user => {
            if (user.name === name) {
                return {...user, avatar: avatarSrc};
            }
            return user;
        });
        sessionStorage.setItem('userList', JSON.stringify(updatedSessionData));

        if (!socket || socket.readyState !== WebSocket.OPEN) {
            console.error('WebSocket connection is not open');
            Swal.fire({
                icon: 'error',
                title: 'WebSocket Error',
                text: 'Unable to establish WebSocket connection',
            });
            return;
        }

        const requestData = {
            action: "onchat",
            data: {
                event: type === 0 ? "GET_PEOPLE_CHAT_MES" : "GET_ROOM_CHAT_MES",
                data: {
                    name: name,
                    page: 1
                }
            }
        };

        socket.send(JSON.stringify(requestData));


        socket.onmessage = async (event) => {
            const response = JSON.parse(event.data);
            if (response.status === "success") {
                let fetchedMessages = [];
                if (type === 0 && Array.isArray(response.data)) {
                    fetchedMessages = response.data.reverse();
                } else if (type === 1 && response.data && Array.isArray(response.data.chatData)) {
                    fetchedMessages = response.data.chatData.reverse();
                }
                let lastIndex = fetchedMessages.length - 1;
                setLastMessage(lastIndex);
                const lastmessage = fetchedMessages[lastIndex];

                setLastMessage(lastmessage);

                fetchedMessages.forEach(message => {
                    if (message.mes) {
                        try {
                            const decodedBytes = toByteArray(message.mes);
                            const decodedMessages = new TextDecoder().decode(decodedBytes);
                            message.mes = decodedMessages;
                        } catch (error) {
                            // console.error('Error decoding message:', error);
                        }
                    }
                });




                // Lấy phản ứng từ Firestore
                const reactions = await fetchReactions();

                // // Kết hợp phản ứng vào tin nhắn
                //                 // const updatedMessages = fetchedMessages.map(message => {
                //                 //     message.reactions = reactions[message.id] || [];
                //                 //     return message;
                //                 // });
                // Lấy dữ liệu từ Firestore
                const firestoreData = await Promise.all(fetchedMessages.map(async message => {
                    // Lấy dữ liệu từ Firestore cho tin nhắn hiện tại
                    const messageRef = doc(db, "messages", String(message.id));
                    const messageDoc = await getDoc(messageRef);

                    if (messageDoc.exists()) {
                        const firebaseMessage = messageDoc.data();
                        message.isRecalled = firebaseMessage.isRecalled || false;
                        message.reactions = firebaseMessage.reactions || [];
                    } else {
                        // Nếu tin nhắn không tồn tại trên Firestore, khởi tạo giá trị mặc định
                        message.isRecalled = false;
                        message.reactions = [];
                    }

                    return message;
                }));

                setMessages(firestoreData);
                // Vòng lặp để in ra id của mỗi tin nhắn
                firestoreData.forEach((message, index) => {
                    console.log("id: "+ message.id);
                    console.log("mes: "+ message.mes);
                });


                // Decode messages


                // Update message list
                // setMessages([...fetchedMessages]);
                setScrollToBottom(false);

            // } else {
            //     Swal.fire({
            //         text: `Failed to fetch messages for ${name}.`,
            //         icon: 'error',
            //     });
            }
        };
        setScrollToBottom(true);
    };
    useEffect(() => {
        setScrollToBottom(true);
    }, [messages]);

    useEffect(() => {
        setScrollToBottom(true);
    }, [messages]);

    const add7Hours = (dateString) => {
        const date = new Date(dateString);
        date.setHours(date.getHours() + 7);
        return date;
    };

    const renderDateTime = (dateString) => {
        const date = add7Hours(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;

    };

// <<<<<<< HEAD

    // Start of sendChat function
    const [shouldFetchMessages, setShouldFetchMessages] = useState(false);


    // const sendChat = () => {
    //     if (messageContentChat.trim() === '') return;
    //     console.log('Message content:', messageContentChat);
    //
    //     // Encode message content
    //     const messageBytes = new TextEncoder().encode(messageContentChat.trim());
    //     const encodedMessage = fromByteArray(messageBytes);
    //     const chatMessage = {
    //
    //         "action": "onchat",
    //         "data": {
    //             "event": "SEND_CHAT",
    //             "data": {
    //                 "type": "people",
    //                 "to": displayName,
    //                 "mes": encodedMessage
    //             }
    //
    //         }
    //     };
    //
    //     if (socket && socket.readyState === WebSocket.OPEN) {
    //         setMessageContentChat(''); // Xóa nội dung tin nhắn sau khi gửi
    //         setScrollToBottom(true); // Kích hoạt cuộn xuống dưới
    //         console.log('Message object:', chatMessage);
    //         socket.send(JSON.stringify(chatMessage));
    //         setShouldFetchMessages(true); // Kích hoạt việc tải lại tin nhắn
    //
    //     } else {
    //         console.error('WebSocket is not open. Unable to send message.');
    //     }
    // };
    //
    // useEffect(() => {
    //     if (shouldFetchMessages) {
    //         handleLiClick(displayName, 0, roomOwner);
    //         setShouldFetchMessages(false); // Đặt lại để ngăn không gọi lại khi messages thay đổi
    //     }
    // }, [shouldFetchMessages]);
    //
    //
    //
    // const handleInputChange = (event) => {
    //     setMessageContentChat(event.target.value);
    // };
    //
    // const handleSendClick = () => {
    //     sendChat();
    // };
    //
    // const handleKeyDown = (event) => {
    //     if (event.key === 'Enter') {
    //         event.preventDefault();
    //         sendChat();
    //     }
    // };

    const sendFiles = async () => {
        if (selectedFiles.length === 0) return;

        let fileUrls = [];
        for (const file of selectedFiles) {
            const fileRef = ref(storage, `chat_files/${file.name}`);
            await uploadBytes(fileRef, file);
            const fileUrl = await getDownloadURL(fileRef);
            fileUrls.push(fileUrl);
            console.log("File URL:", fileUrl);
        }

        const fileUrlsString = fileUrls.join(' ').trim();
        const isRoom = userList.some(user => user.name === displayName && user.type === 1);

        let chatMessage = {
            action: "onchat",
            data: {
                event: "SEND_CHAT",
                data: {
                    type: isRoom ? "room" : "people",
                    to: displayName,
                    mes: fileUrlsString
                }
            }
        };

        const date = new Date();
        date.setHours(date.getHours() - 7);
        const adjustedCreateAt = date.toISOString();



        if (socket && socket.readyState === WebSocket.OPEN) {
            setSelectedFiles([]); // Clear selected files after sending
            setScrollToBottom(true); // Scroll to bottom
            console.log('File message object:', chatMessage);
            socket.send(JSON.stringify(chatMessage));
            setShouldFetchMessages(true);

            // Update messages state immediately
        } else {
            console.error('WebSocket is not open. Unable to send message.');
        }
    };
    // hàm send chat
    const sendChat = () => {
        if (messageContentChat.trim() === '') return;

        // Encode message content
        const messageBytes = new TextEncoder().encode(messageContentChat.trim());
        const encodedMessage = fromByteArray(messageBytes);

        // Determine if displayName is a room
        const isRoom = userList.some(user => user.name === displayName && user.type === 1);

        let chatMessage;
        if (isRoom) {
            console.log("Sending message to room:", displayName);
            chatMessage = {
                action: "onchat",
                data: {
                    event: "SEND_CHAT",
                    data: {
                        type: "room",
                        to: displayName,
                        mes: encodedMessage
                    }
                }
            };
        } else {
            console.log("Sending message to user:", displayName);
            chatMessage = {
                action: "onchat",
                data: {
                    event: "SEND_CHAT",
                    data: {
                        type: "people",
                        to: displayName,
                        mes: encodedMessage
                    }
                }
            };
        }

        // Create a new message object for immediate display
        const date = new Date();

        date.setHours(date.getHours() - 7);

        const adjustedCreateAt = date.toISOString();



        // Create a new message object for immediate display



        // Create a new message object for immediate display

        // const newMessage = {
        //
        //     name: username,
        //     createAt: adjustedCreateAt, //
        //     mes: messageContentChat.trim(), // Use the plain message content
        //     type: isRoom ? "room" : "people",
        //     to: displayName
        // }

        if (socket && socket.readyState === WebSocket.OPEN) {
            setMessageContentChat(''); // Clear message content after sending
            setScrollToBottom(true); // Scroll to bottom
            console.log('Message object:', chatMessage);
            socket.send(JSON.stringify(chatMessage));
            setShouldFetchMessages(true);

            // Update messages state immediately
            // setMessages(prevMessages => [...prevMessages, newMessage]);
        } else {
            console.error('WebSocket is not open. Unable to send message.');
        }
    };

    useEffect(() => {
        if (shouldFetchMessages) {
            handleLiClick(displayName, type, roomOwner);
            setShouldFetchMessages(false); // Reset to prevent re-calling when messages change
        }
    }, [shouldFetchMessages]);

    const handleInputChange = (event) => {
        setMessageContentChat(event.target.value);
    };

    const handleSendClick = () => {
        if (selectedFiles.length > 0) {
            sendFiles();
        } else {
            sendChat();
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            if (event.shiftKey) {
                event.preventDefault();
                setMessageContentChat(prev => prev + '\n');
            } else {
                event.preventDefault();
                sendChat();
            }
        }
    };


    // End of sendChat function
// =======
    // join room
    const handleJoinRoom = () => {
        const isAlreadyMember = userList.some((room) => room.name === joinRoomCode && room.type === 1);
        if (isAlreadyMember) {
            Swal.fire({
                icon: 'info',
                title: 'Already a member',
                text: 'Bạn đã là thành viên của phòng.',
            });
            return;
        }

        const joinRoomRequest = {
            action: "onchat",
            data: {
                event: "JOIN_ROOM",
                data: {
                    name: joinRoomCode // Thay đổi từ code thành name
                }
            }
        };

        console.log('Sending join room request:', JSON.stringify(joinRoomRequest)); // Log toàn bộ request

        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(joinRoomRequest));
        } else {
            console.error('WebSocket is not open. Unable to send message.');
        }

        setJoinRoomModal(false); // Đóng modal sau khi gửi yêu cầu tham gia phòng
    };

    useEffect(() => {
        const handleJoinRoomResponse = (event) => {
            const response = JSON.parse(event.data);
            console.log('Received response:', response); // Debug phản hồi nhận được
            if (response.event === "JOIN_ROOM") {
                if (response.status === "success") {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: response.status,
                        text: 'Joined room successfully',
                        showConfirmButton: false,
                        timer: 1500
                    });

                    // Cập nhật danh sách userList và lưu vào sessionStorage
                    const currentDate = new Date();
                    currentDate.setHours(currentDate.getHours() - 7);
                    const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')} ${String(currentDate.getHours()).padStart(2, '0')}:${String(currentDate.getMinutes()).padStart(2, '0')}:${String(currentDate.getSeconds()).padStart(2, '0')}`;

                    const newUserList = [{
                        name: joinRoomCode,
                        type: 1,
                        actionTime: formattedDate,
                        roomOwner: response.data.roomOwner || 'Unknown'
                    }, ...userList];
                    setUserList(newUserList);
                    sessionStorage.setItem('userList', JSON.stringify(newUserList));

                    // Xử lý các hành động khác nếu cần
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Join Room Error',
                        text: response.message || 'Failed to join the room',
                    });
                }
            }
        };

        if (socket) {
            socket.addEventListener('message', handleJoinRoomResponse);
        }

        return () => {
            if (socket) {
                socket.removeEventListener('message', handleJoinRoomResponse);
            }
        };
    }, [socket, userList, joinRoomCode]);


    const checkIncludes = (text, smallText) => {
        return text.includes(smallText);
    };

    const replaceText = (text, text1, text2) => {
        return text.replace(text1, text2);
    };

    const getFileIcon = (fileName) => {
        const extension = fileName.split('.').pop().toLowerCase();
        const fileIcons = {
            'pdf': pdf,
            'docx': word,
            'xlsx': xlsx,
            'pptx': pptx,
            'css': css,
            'html': html,
            'js': js,
            'txt': txt,
            'zip': zip,
            'mp3':mp3,
            'java':java,
            'sql':sql,
            'csv':csv,
            'drawio':drawio,
            'ts':ts
            // Add paths to other icons as necessary
        };
        return fileIcons[extension];
    };


    const urlRegex = /https?:\/\/[^\s]+/g;
    const checkURLFile = (mes) => {
        return (
            mes?.startsWith("https://firebasestorage") &&
            (checkIncludes(mes, "files") || checkIncludes(mes, "images")) // Kiểm tra nếu là file hoặc ảnh
        );
    };

    const nameFile = (mes) => {
        const urlParts = mes.split("/");
        const fileNameWithParams = urlParts[urlParts.length - 1];
        const fileName = fileNameWithParams.split("?")[0];
        return decodeURIComponent(fileName.replace("chat_files%2F", ""));
    };

    const isImageURL = (url) => {
        const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
        const lowerCaseUrl = url.toLowerCase();
        return imageExtensions.some(ext => lowerCaseUrl.includes(ext));
    };

    const renderMessageContent = (message) => {
        if (!message || typeof message.mes !== 'string') {
            return <div className="message-content">{message?.mes || ''}</div>;
        }

        const parts = message.mes.split(urlRegex);
        const urls = message.mes.match(urlRegex) || [];

        return (
            <div className="message-content">
                {parts.map((part, index) => (
                    <React.Fragment key={index}>
                        {part && <div>{part}</div>}
                        {urls[index] &&
                        checkURLFile(urls[index]) ? (
                            isImageURL(urls[index]) ? (
                                <div>
                                    <img
                                        style={{
                                            maxWidth: "100%",
                                            height: "auto",
                                            objectFit: "cover",
                                        }}
                                        src={urls[index]}
                                        alt=""
                                    />
                                </div>
                            ) : (
                                <div>
                                    <img src={getFileIcon(nameFile(urls[index]))} alt="" style={{ width: '24px', height: '24px', marginRight: '8px' }} />
                                    <a href={urls[index]} target="_blank" rel="noopener noreferrer" download>
                                        {nameFile(urls[index])}
                                    </a>
                                </div>
                            )
                        ) : /https:\/\/media[0-9]*\.giphy\.com\/media\/[a-zA-Z0-9]+\/[0-9]+\.gif/.test(urls[index]) ? (
                            <div>
                                <iframe
                                    src={`https://giphy.com/embed/${urls[index].split('media/')[1].split('/')[0]}`}
                                    width="300"
                                    height="271"
                                    frameBorder="0"
                                    className="giphy-embed"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        ) : /https:\/\/www.youtube.com\/watch\?v=/.test(urls[index]) ? (
                            <div>
                                <iframe
                                    width="100%"
                                    height="315"
                                    src={replaceText(urls[index], "watch?v=", "embed/")}
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        ) : (
                            <div>
                                <a href={urls[index]} target="_blank" rel="noopener noreferrer">
                                    {urls[index]}
                                </a>
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </div>
        );
    };



// >>>>>>> main
    //chuc nang xoa, thu hoi chat
    const [hoveredMessage, setHoveredMessage] = useState(null); // Thêm trạng thái để theo dõi tin nhắn được chọn

    // const handleDeleteMessage = async (messageId) => {
    //     console.log("messageId: "+messageId)
    //     const updatedMessages = messages.map(message => {
    //         if (message.id === messageId) {
    //             if (!message.hasOwnProperty('isRecalled')) {
    //                 return {...message, isRecalled: true};
    //             }
    //             return {...message, isRecalled: true};
    //         }
    //         return message;
    //     });
    //
    //     setMessages(updatedMessages);
    //     // Lấy tham chiếu của tin nhắn bị thu hồi
    //     const messageElement = specificMessageRef.current[messageId];
    //
    //     const messageRef = doc(db, "messages", String(messageId));
    //     const messageDoc = await getDoc(messageRef);
    //
    //     if (messageDoc.exists()) {
    //         await updateDoc(messageRef, {
    //             isRecalled: true
    //         });
    //     }else{
    //         await setDoc(messageRef, {
    //             id: messageId,
    //             isRecalled: true
    //         });
    //     }
    //
    //     console.log('Message recalled:', messageId);
    //
    //     // Cuộn tới tin nhắn bị thu hồi
    //     if (messageElement) {
    //         messageElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    //     }
    //
    //     // Ngăn việc cuộn tự động xuống cuối
    //     setScrollToBottom(false);
    // };
    const handleDeleteMessage = async (messageId) => {
        console.log("messageId: " + messageId);

        // Kiểm tra nếu messageId là undefined
        if (!messageId) {
            console.error('messageId is undefined');
            return;
        }

        // Cập nhật state của tin nhắn
        const updatedMessages = messages.map(message => {
            if (message.id === messageId) {
                return {...message, isRecalled: true};
            }
            return message;
        });

        setMessages(updatedMessages);

        // Lấy tham chiếu của tin nhắn bị thu hồi
        const messageElement = specificMessageRef.current[messageId];

        try {
            const messageRef = doc(db, "messages", String(messageId));
            const messageDoc = await getDoc(messageRef);

            if (messageDoc.exists()) {
                await updateDoc(messageRef, {
                    isRecalled: true
                });
            } else {
                await setDoc(messageRef, {
                    id: messageId,
                    isRecalled: true
                });
            }

            console.log('Message recalled:', messageId);

            // Cuộn tới tin nhắn bị thu hồi
            if (messageElement) {
                messageElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }

            // Ngăn việc cuộn tự động xuống cuối
            setScrollToBottom(false);
        } catch (error) {
            console.error("Error recalling message: ", error);
        }
    };


    const handleReplyMessage = (message) => {
        // Xử lý trả lời tin nhắn
        console.log('Reply to message:', message);
    };

    const [showEmojiPicker, setShowEmojiPicker] = useState(false); // State để điều khiển hiển thị Emoji Picker
    const [emojiPickerMessageId, setEmojiPickerMessageId] = useState(null); // Trạng thái để lưu trữ ID tin nhắn hiện tại
    const emojiPickerRef = useRef(null);

    // Thêm hàm xử lý click vào biểu tượng cảm xúc
    const handleEmojiClick = (messageId) => { // Thay đổi
        setEmojiPickerMessageId(messageId);
        setShowEmojiPicker(!showEmojiPicker);
        console.log(`Thả biểu tượng cảm xúc cho tin nhắn có ID: ${messageId}`);
    };
    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (upload) => {
                setAvatar({url: upload.target.result, file: file});
            };
            reader.readAsDataURL(file);
        }
    };

// Function to handle room avatar change


// Function to update avatar URL in Firestore
    const updateAvatarURLInFirestore = async (uid, avatarURL) => {
        const userDocRef = doc(db, 'users', uid);
        await updateDoc(userDocRef, {avatar: avatarURL});
    };

// Function to update room avatar URL in Firestore

// Function to fetch username from Firebase
    const getUsernameFromFirebase = async (uid) => {
        const userDocRef = doc(db, 'users', uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
            return userDoc.data().username;
        }
        return null;
    };

// Function to update user avatar
    const updateUserAvatar = async () => {
        try {
            const user = auth.currentUser;
            if (user && avatar.file) {
                const avatarURL = await uploadAvatar(avatar.file);
                await updateAvatarURLInFirestore(user.uid, avatarURL);

                const username = await getUsernameFromFirebase(user.uid);

                if (username) {
                    // Update sessionStorage with the new avatar URL
                    const sessionData = JSON.parse(sessionStorage.getItem('userList'));
                    if (sessionData) {
                        const updatedSessionData = sessionData.map((userItem) =>
                            userItem.name === username
                                ? {...userItem, avatar: avatarURL}
                                : userItem
                        );
                        sessionStorage.setItem('userList', JSON.stringify(updatedSessionData));
                    }

                    // Update the state with the new avatar URL
                    setUserAvatar(avatarURL);
                    setUserList((prevUserList) =>
                        prevUserList.map((userItem) =>
                            userItem.name === username
                                ? {...userItem, avatar: avatarURL}
                                : userItem
                        )
                    );

                    Swal.fire({
                        icon: 'success',
                        title: 'Avatar updated successfully',
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            }
        } catch (error) {
            console.error('Error updating avatar: ', error);
            Swal.fire({
                icon: 'error',
                title: 'Failed to update avatar',
                text: error.message,
            });
        }
        setChangeAvatarModal(false);
    };

// Function to update room avatar


// Function to upload avatar to Firebase storage

// Function to update room avatar URL in Firestore
    // Function to handle room avatar change
    const handleRoomAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (upload) => {
                setRoomAvatar({url: upload.target.result, file: file});
            };
            reader.readAsDataURL(file);
        }
    };

// Function to upload avatar to Firebase storage
    const uploadAvatar = async (file) => {
        const storage = getStorage();
        const storageRef = ref(storage, `avatars/${file.name}`);
        await uploadBytes(storageRef, file);
        return getDownloadURL(storageRef);
    };

// Function to update room avatar URL in Firestore
    const updateRoomAvatarURLInFirestore = async (roomName, avatarURL) => {
        const roomQuery = query(collection(db, 'rooms'), where('roomname', '==', roomName));
        const querySnapshot = await getDocs(roomQuery);

        if (!querySnapshot.empty) {
            const roomDocRef = querySnapshot.docs[0].ref;
            await updateDoc(roomDocRef, {roomavatar: avatarURL});
            return roomDocRef.id;
        }

        throw new Error('Room not found');
    };

// Function to get the latest room avatar URL from Firestore
    const getLatestRoomAvatarURLFromFirestore = async (roomName) => {
        const roomQuery = query(collection(db, 'rooms'), where('roomname', '==', roomName));
        const querySnapshot = await getDocs(roomQuery);

        if (!querySnapshot.empty) {
            const roomData = querySnapshot.docs[0].data();
            return roomData.roomavatar;
        }

        throw new Error('Room not found');
    };

// Function to update room avatar
    const updateRoomAvatar = async () => {
        try {
            const room = userList.find(user => user.type === 1 && user.name === roomNames);
            if (room && roomAvatar.file) {
                const avatarURL = await uploadAvatar(roomAvatar.file);
                const roomId = await updateRoomAvatarURLInFirestore(room.name, avatarURL);

                // Fetch the latest room avatar URL from Firestore
                const latestAvatarURL = await getLatestRoomAvatarURLFromFirestore(room.name);

                // Update sessionStorage with the new room avatar URL
                const sessionData = JSON.parse(sessionStorage.getItem('userList'));
                if (sessionData) {
                    const updatedSessionData = sessionData.map((userItem) =>
                        userItem.name === room.name && userItem.type === 1
                            ? {...userItem, avatar: latestAvatarURL}
                            : userItem
                    );
                    sessionStorage.setItem('userList', JSON.stringify(updatedSessionData));
                }
                setUserAvatar(latestAvatarURL);
                // Update the state with the new room avatar URL
                setUserList((prevUserList) =>
                    prevUserList.map((userItem) =>
                        userItem.name === room.name && userItem.type === 1
                            ? {...userItem, avatar: latestAvatarURL}
                            : userItem
                    )
                );

                Swal.fire({
                    icon: 'success',
                    title: 'Room avatar updated successfully',
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Failed to update room avatar',
                    text: 'Invalid room name',
                });
            }
        } catch (error) {
            console.error('Error updating room avatar: ', error);
            Swal.fire({
                icon: 'error',
                title: 'Failed to update room avatar',
                text: error.message,
            });
        }
        setChangeAvatarModal(false);
    };
// Component useEffect to load user list from sessionStorage
    useEffect(() => {
        const storedUserList = sessionStorage.getItem('userList');
        if (storedUserList) {
            setUserList(JSON.parse(storedUserList));
        } else {
            // Fetch the user list from Firestore or other sources if not in sessionStorage
        }
    }, []);

    // Thêm hàm xử lý chọn biểu tượng cảm xúc

    const handleEmojiSelect = async (emojiData, event) => {
        if (emojiPickerMessageId !== null) {
            const reaction = emojiData.native || emojiData.emoji || emojiData.unicode;

            const updatedMessages = messages.map(message => {
                if (message.id === emojiPickerMessageId) {
                    message.reactions = message.reactions || [];

                    const reactionIndex = message.reactions.indexOf(reaction);
                    if (reactionIndex > -1) {
                        message.reactions.splice(reactionIndex, 1); // Remove reaction if it already exists
                    } else {
                        message.reactions = [reaction]; // Replace with new reaction if it doesn't exist
                    }
                }
                return message;
            });

            setMessages(updatedMessages);

            const messageRef = doc(db, "messages", String(emojiPickerMessageId));
            const messageDoc = await getDoc(messageRef);

            if (messageDoc.exists()) {
                const currentReactions = messageDoc.data().reactions || [];
                const reactionIndex = currentReactions.indexOf(reaction);

                if (reactionIndex > -1) {
                    await updateDoc(messageRef, {
                        reactions: arrayRemove(reaction) // Remove reaction if it already exists in Firestore
                    });
                } else {
                    await updateDoc(messageRef, {
                        reactions: [reaction] // Replace with new reaction if it doesn't exist in Firestore
                    });
                }
            } else {
                await setDoc(messageRef, {
                    id: emojiPickerMessageId,
                    reactions: [reaction]
                });
            }

            setShowEmojiPicker(false);
            scrollToMessage(emojiPickerMessageId); // Cuộn đến tin nhắn có biểu tượng cảm xúc
        }
    };

    const handleClickOutside = (event) => {
        if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
            setShowEmojiPicker(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    return (
        <>
            <div className="maincontainer">
                <div className="container-fluid h-50">
                    <div className="row justify-content-center h-100">
                        <div className="col-md-4 col-xl-3 chat" id="chatleft">
                            <div className="card mb-sm-3 mb-md-0 contacts_card">
                                <div className="card-header">
                                    <div className="input-group">
                                        <div className="input-group-prepend"></div>
                                        <input
                                            type="checkbox"
                                            className="cbox"
                                            aria-label="Checkbox for search"
                                            checked={isCheckboxChecked}
                                            onChange={handleCheckboxChange}
                                        />
                                        <MDBInput
                                            type="text"
                                            placeholder="Search..."
                                            name="searchInput"
                                            className="form-control search"
                                            value={searchInput}
                                            onChange={handleSearchInputChange}
                                            list="datalistOptions"
                                        />
                                        <datalist id="datalistOptions">
                                            {userList
                                                .filter(user => !isCheckboxChecked ? user.type === 0 : user.type === 1)
                                                .map((user, index) => (
                                                    <option key={index} value={user.name}/>
                                                ))}
                                        </datalist>
                                        <div className="input-group-prepend">
                    <span className="input-group-text search_btn" onClick={handleSearch}>
                        <i className="fas fa-search"></i>
                    </span>
                                        </div>
                                    </div>
                                    <div className="tabs-wrapper">
                                        <input type="radio" name="tab" id="userTab"
                                               checked={activeContactsTab === 'user'}
                                               onChange={() => setActiveContactsTab('user')}/>
                                        <label htmlFor="userTab" className="tab-label">User</label>
                                        <input type="radio" name="tab" id="roomTab"
                                               checked={activeContactsTab === 'room'}
                                               onChange={() => setActiveContactsTab('room')}/>
                                        <label htmlFor="roomTab" className="tab-label">Room</label>
                                        <div className="tab-slider"></div>
                                    </div>
                                </div>
                                <div className="card-body contacts_body"
                                     style={{overflowY: 'auto', overflowX: 'auto', maxHeight: '550px'}}>
                                    <ul className="contacts">
                                        {userList.length > 0 ? (
                                            userList
                                                .filter(user => activeContactsTab === 'user' ? user.type === 0 : user.type === 1)
                                                .map((user, index) => {
                                                    const matchedUser = data.find(dbUser => dbUser.username === user.name);
                                                    const sessionUser = Array.isArray(sessionData) ? sessionData.find(sessionUser => sessionUser.name === user.name) : null;
                                                    let avatarSrc = 'https://therichpost.com/wp-content/uploads/2020/06/avatar2.png';

                                                    if (user.avatar) {
                                                        avatarSrc = user.avatar;
                                                    } else if (user.type === 1) {
                                                        const matchedRoom = rooms.find(room => room.roomname === user.name);
                                                        if (matchedRoom && matchedRoom.roomavatar) {
                                                            avatarSrc = matchedRoom.roomavatar;
                                                        }
                                                    } else {
                                                        if (sessionUser && sessionUser.avatar) {
                                                            avatarSrc = sessionUser.avatar;
                                                        } else if (matchedUser) {
                                                            if (matchedUser.avatar && matchedUser.avatar.length > 0) {
                                                                avatarSrc = matchedUser.avatar;
                                                            } else if (matchedUser.gender === 'male') {
                                                                avatarSrc = 'https://bootdey.com/img/Content/avatar/avatar7.png';
                                                            } else if (matchedUser.gender === 'female') {
                                                                avatarSrc = 'https://bootdey.com/img/Content/avatar/avatar3.png';
                                                            }
                                                        }
                                                    }


                                                    return (
                                                        <li key={index}
                                                            className={user.name === displayName ? 'active' : ''}
                                                            onClick={() => handleLiClick(user.name, user.type, user.roomOwner)}>
                                                            <div className="d-flex bd-highlight">
                                                                <div className="img_cont">
                                                                    <img
                                                                        src={avatarSrc}
                                                                        alt="avatar"
                                                                        className="rounded-circle user_img"
                                                                    />
                                                                    {/*<span className="online_icon"></span>*/}
                                                                    <span
                                                                        className={`online_icon ${userStatuses[user.name] ? 'online' : 'offline'}`}></span>
                                                                </div>
                                                                <div className="user_info">
                                                                    <span>{user.name}</span>
                                                                    <p className="typechat">Type: {user.type}</p>
                                                                    <p>Last
                                                                        Action: {renderDateTime(user.actionTime)}</p>
                                                                </div>

                                                            </div>
                                                        </li>
                                                    );
                                                })

                                        ) : (
                                            <li>No users found.</li>
                                        )}
                                    </ul>
                                </div>
                                <div className="card-footer"></div>
                            </div>
                        </div>

                        <div className="col-md-8 col-xl-6 chat" id="chatcenter">
                            <div className="card" id="chatcenter">
                                <div className="card-header msg_head cor">
                                    <div className="d-flex bd-highlight">
                                        <div className="img_cont">
                                            <img
                                                src={userAvatar}
                                                className="rounded-circle user_img"
                                            />

                                            {/*<span className="online_icon"></span>*/}
                                            <span
                                                className={`online_icon ${userStatuses[displayName] ? 'online' : 'offline'}`}></span>

                                        </div>
                                        <div className="user_info">
                                            <span>{displayName}</span>
                                            {searchType === 'room' && messageContent && <p>{messageContent}</p>}
                                        </div>

                                        <div className="video_cam">
                                            <span><i className="fas fa-video"></i></span>
                                            <span><i className="fas fa-phone"></i></span>
                                            <span>
                                                <MDBBtn
                                                    rounded
                                                    size="sm"
                                                    color="primary"
                                                    onClick={() => setRoomModal(true)}
                                                    style={{marginBottom: "3px"}}
                                                >
                                                    <MDBIcon fas icon="plus-circle"/>
                                                </MDBBtn>
                                            </span>
                                        </div>
                                    </div>
                                    <span id="action_menu_btn" onClick={toggleMenu}>
                                        <i className="fas fa-ellipsis-v"></i>
                                    </span>
                                    <div className={`action_menu ${isOpen ? 'open' : ''}`}>
                                        <ul>
                                            <li id="toggle-dark-mode" onClick={handleToggleDarkMode}>
                                                <i className={`fa-regular ${darkMode ? 'fa-sun' : 'fa-moon'}`}
                                                   id="icontype"></i>
                                                <span
                                                    className={`${darkMode ? 'light' : 'dark'}`}>{darkMode ? 'Light mode' : 'Dark mode'}</span>
                                            </li>
                                            <li onClick={() => setChangeAvatarModal(true)}>
                                                <i className="fas fa-user-circle"></i> Change Avatar
                                            </li>

                                            <li id="logout-button" onClick={handleLogout}><i
                                                className="fas fa-ban"></i> Logout
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="card-body msg_card_body" ref={messagesEndRef}
                                     style={{overflowY: 'auto', overflowX: 'auto', maxHeight: '600px'}}>
                                    {messages.map((message, index) => {
                                        const sessionData = JSON.parse(sessionStorage.getItem('userList'));
                                        const matchedUser = data.find(dbUser => dbUser.username === message.name);
                                        const sessionUser = Array.isArray(sessionData) ? sessionData.find(sessionUser => sessionUser.name === message.name) : null;
                                        let avatarSrc = 'https://therichpost.com/wp-content/uploads/2020/06/avatar2.png';

                                        if (sessionUser && sessionUser.avatar) {
                                            avatarSrc = sessionUser.avatar;
                                        } else if (matchedUser) {
                                            if (matchedUser.avatar && matchedUser.avatar.length > 0) {
                                                avatarSrc = matchedUser.avatar;
                                            } else if (matchedUser.gender === 'male') {
                                                avatarSrc = 'https://bootdey.com/img/Content/avatar/avatar7.png';
                                            } else if (matchedUser.gender === 'female') {
                                                avatarSrc = 'https://bootdey.com/img/Content/avatar/avatar3.png';
                                            }
                                        }

                                        return (

// <<<<<<< HEAD

                                            <div key={index}

                                                 className={`d-flex mb-4 ${message.name === username ? 'justify-content-end' : 'justify-content-start'}`}

                                                 ref={el => (specificMessageRef.current[message.id] = el)}

                                                 onMouseEnter={() => setHoveredMessage(index)}

                                                 onMouseLeave={() => setHoveredMessage(null)}>


                                                {searchType === 'room' && message.name !== username && (

                                                    <span className="sender">{message.name} </span>

                                                )}

                                                <div className="img_cont_msg">

                                                    <img src={avatarSrc} alt="avatar"

                                                         className="rounded-circle user_img_msg"/>


                                                </div>

                                                <div

                                                    className={`msg_cotainer${message.name === username ? '_send' : ''}   ${message.isRecalled &&message.name === username  ? 'recalledMessage' : ''}`}>

                                                    {/*<div className={"message-content" }>*/}
                                                    <div
                                                        className={`message-content`}>

                                                        {message.isRecalled&&message.name === username ? (
                                                            <span>Tin nhắn đã bị thu hồi</span>
                                                        ) : (
                                                            <>
                                                                {renderMessageContent(message)}
                                                                <span
                                                                    className={`msg_time${message.name === username ? '_send' : ''}`}>
                                                                            {renderDateTime(message.createAt)}
                                                                        </span>
                                                                {message.reactions && (
                                                                    <div className="message-reactions">
                                                                        {message.reactions.map((reaction, reactionIndex) => (
                                                                            <span
                                                                                key={reactionIndex}>{reaction}</span>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </>
                                                        )}

                                                        {hoveredMessage === index && (

                                                            <div

                                                                className={`message-icons ${message.name === username ? 'left' : 'right'}`}>
                                                                {message.name !== username ?"":( <i className="fas fa-trash"

                                                                                                    onClick={() => handleDeleteMessage(message.id)}></i>)}

                                                                <i className="fas fa-reply"

                                                                   onClick={() => handleReplyMessage(message)}></i>

                                                                <i className="fas fa-smile"

                                                                   onClick={() => handleEmojiClick(message.id)}></i>

                                                            </div>

                                                        )}

                                                        {showEmojiPicker && emojiPickerMessageId === message.id && (
                                                            <div className="emoji-picker-container">
                                                                <EmojiPicker
                                                                    onEmojiClick={(emojiData, event) => handleEmojiSelect(emojiData, event)}/>
                                                            </div>
                                                        )}

                                                    </div>

                                                </div>

                                            </div>

                                        );

                                    })}
                                    <div ref={messagesEndRef}></div>
                                </div>

                                <div className="card-footer"
                                     style={{height: selectedFiles.length > 0 ? '150px' : '100px'}}>
                                    {selectedFiles.length > 0 && (
                                        <div className="selected-files" contentEditable={false}>
                                            {selectedFiles.map((file, index) => (
                                                <div key={index} className="selected-file">
                                                    <span>{file.name}</span>
                                                    <button
                                                        onClick={() => setSelectedFiles(prevFiles => prevFiles.filter((_, i) => i !== index))}>x
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="input-group" style={{marginBottom: "10px"}}>
                                        <div className="input-group-append" id="sendfile">
                                            <label className="input-group-text attach_btn"
                                                   style={{height: '30px', cursor: 'pointer'}}>

                                                <i className="fas fa-paperclip"></i>

                                                <input type="file" style={{display: 'none'}}
                                                       onChange={handleFileChange} multiple/>

                                            </label>

                                            <span className="input-group-text attach_btn"
                                                  style={{height: "30px"}}
                                                  onClick={() => setGifPickerVisible(!isGifPickerVisible)}>
                                                <MDBIcon fas icon="gift"/>

                                            </span>
                                        </div>
                                        <textarea name="" className="form-control type_msg"
                                                  placeholder="Type your message..."
                                                  value={messageContentChat}
                                                  onChange={handleInputChange}
                                                  onKeyDown={handleKeyDown}// Listen for Enter key press>
                                        ></textarea>
                                        <div className="input-group-append">
                                            <span className="input-group-text send_btn"
                                                  onClick={handleSendClick}><i
                                                className="fas fa-location-arrow"></i></span>
                                        </div>
                                    </div>
                                    {isGifPickerVisible && (
                                        <div className="gif-picker" style={{
                                            position: 'absolute',
                                            bottom: '80px',
                                            zIndex: 1000,
                                            backgroundColor: 'white',
                                            padding: '10px',
                                            borderRadius: '8px'
                                        }}>
                                            <div className="d-flex">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Search GIFs..."
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') fetchGifs(searchTerm);
                                                    }}
                                                />
                                                <button className="btn btn-primary ml-2"
                                                        onClick={() => fetchGifs(searchTerm)}>Search
                                                </button>
                                            </div>
                                            <div className="d-flex flex-wrap mt-2">
                                                {gifList.map((gifUrl, index) => (
                                                    <img
                                                        key={index}
                                                        src={gifUrl}
                                                        alt={`gif-${index}`}
                                                        style={{
                                                            width: '100px',
                                                            height: '100px',
                                                            margin: '5px',
                                                            cursor: 'pointer'
                                                        }}
                                                        onClick={() => handleGifClick(gifUrl)}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>


            <MDBModal show={roomModal} onHide={() => setRoomModal(false)}>
                <MDBModalDialog>
                    <MDBModalContent>
                        <MDBModalHeader>
                            <MDBModalTitle>Room</MDBModalTitle>
                            <MDBBtn className="btn-close" color="none" onClick={() => setRoomModal(false)}/>
                        </MDBModalHeader>
                        <MDBTabs className="mb-3" id="tabchangeava" style={{marginBottom: 0, marginLeft: 0}}>
                            <MDBTabsItem>
                                <MDBTabsLink onClick={() => setActiveRoomTab('create')}
                                             active={activeRoomTab === 'create'}>
                                    Create
                                </MDBTabsLink>
                            </MDBTabsItem>
                            <MDBTabsItem>
                                <MDBTabsLink onClick={() => setActiveRoomTab('join')}
                                             active={activeTab === 'join'}>
                                    Join
                                </MDBTabsLink>
                            </MDBTabsItem>
                        </MDBTabs>
                        <MDBTabsContent>
                            <MDBTabsPane show={activeRoomTab === 'create'}>
                                <MDBInput
                                    type="text"
                                    value={roomNames}
                                    onChange={(e) => setRoomNames(e.target.value)}
                                    label="Room Name"
                                />
                                <br/>
                                <input
                                    type="file"
                                    id="file"
                                    style={{display: "none"}}
                                    onChange={handleAvatar}
                                />
                                <label htmlFor="file" className="LabelUpload"
                                       style={{backgroundColor: "white"}}>
                                    <div className="img_cont_msg">
                                        <img src={avatar.url || ava} alt=""
                                             className="rounded-circle user_img_msg"/>
                                    </div>
                                    <span id="UploadImg">Upload an image</span>
                                </label>
                            </MDBTabsPane>
                            <MDBTabsPane show={activeRoomTab === 'join'}>
                                <MDBInput
                                    type="text"
                                    value={joinRoomCode}
                                    onChange={(e) => setJoinRoomCode(e.target.value)}
                                    label="Room Code"
                                />
                                <br/>

                            </MDBTabsPane>
                        </MDBTabsContent>
                        <MDBModalFooter>
                            <MDBBtn color="secondary" onClick={() => setRoomModal(false)}>
                                Close
                            </MDBBtn>
                            <MDBBtn onClick={activeRoomTab === 'join' ? handleJoinRoom : handleCreateRoom}>
                                {activeRoomTab === 'join' ? 'Join' : 'Create'}
                            </MDBBtn>
                        </MDBModalFooter>
                    </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>

            {/* Modal Change Avatar */}
            <MDBModal show={changeAvatarModal} onHide={() => setChangeAvatarModal(false)}>
                <MDBModalDialog>
                    <MDBModalContent>
                        <MDBModalHeader>
                            <MDBModalTitle>Change Avatar</MDBModalTitle>
                            <MDBBtn className="btn-close" color="none"
                                    onClick={() => setChangeAvatarModal(false)}/>
                        </MDBModalHeader>
                        <MDBTabs className="mb-3" style={{marginBottom: 0}}>
                            <MDBTabsItem>
                                <MDBTabsLink onClick={() => setActiveTab('user')} active={activeTab === 'user'}>
                                    User
                                </MDBTabsLink>
                            </MDBTabsItem>
                            <MDBTabsItem>
                                <MDBTabsLink onClick={() => setActiveTab('room')} active={activeTab === 'room'}>
                                    Room
                                </MDBTabsLink>
                            </MDBTabsItem>
                        </MDBTabs>
                        <MDBTabsContent>
                            <MDBTabsPane show={activeTab === 'user'}>
                                <MDBInput style={{backgroundColor: "white"}}
                                          type="text"
                                          value={displayName}
                                          label="Default Input"
                                          disabled
                                />
                                <br/>
                                <input
                                    type="file"
                                    id="file"
                                    style={{display: "none"}}
                                    onChange={handleAvatarChange}
                                />
                                <label htmlFor="file" className="LabelUpload"
                                       style={{backgroundColor: "white"}}>
                                    <div className="img_cont_msg">
                                        <img
                                            src={avatar.url || 'https://therichpost.com/wp-content/uploads/2020/06/avatar2.png'}
                                            alt="" className="rounded-circle user_img_msg"/>
                                    </div>
                                    <span id="UploadImg">Upload an image</span>
                                </label>
                            </MDBTabsPane>
                            <MDBTabsPane show={activeTab === 'room'}>
                                <MDBInput
                                    type="text"
                                    value={roomNames}
                                    onChange={(e) => setRoomNames(e.target.value)}
                                    label="Room Name"
                                    list="datalistOption"
                                />
                                <datalist id="datalistOption">
                                    {userList
                                        .filter(user => user.type === 1)
                                        .map((user, index) => (
                                            <option key={index} value={user.name}/>
                                        ))}
                                </datalist>
                                <br/>
                                <input
                                    type="file"
                                    id="fileRoom"
                                    style={{display: "none"}}
                                    onChange={handleRoomAvatarChange}
                                />
                                <label htmlFor="fileRoom" className="LabelUpload"
                                       style={{backgroundColor: "white"}}>
                                    <div className="img_cont_msg">
                                        <img
                                            src={roomAvatar.url || 'https://therichpost.com/wp-content/uploads/2020/06/avatar2.png'}
                                            alt="" className="rounded-circle user_img_msg"/>
                                    </div>
                                    <span id="UploadImg">Upload an image</span>
                                </label>
                            </MDBTabsPane>
                        </MDBTabsContent>
                        <MDBModalFooter>
                            <MDBBtn color="secondary" onClick={() => setChangeAvatarModal(false)}>
                                Close
                            </MDBBtn>
                            <MDBBtn onClick={activeTab === 'user' ? updateUserAvatar : updateRoomAvatar}>
                                Update Avatar
                            </MDBBtn>
                        </MDBModalFooter>
                    </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>
        </>
    );
}
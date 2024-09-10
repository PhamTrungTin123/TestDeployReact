import React, { useState, useEffect } from "react";

import {
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBIcon,
    MDBTypography,
} from "mdb-react-ui-kit";
import CreateRoom from "../CreateRoom";
import { useLocation } from 'react-router-dom';



export default function UserList({ userList, handleUserClick, selectedUser }) {

    // const { selectedUser } = props;
    // const [selectedUser, setSocket] = useState(null);

    const circleStyle = {
        borderRadius: '3rem',
    };


    return (
        <MDBCard style={circleStyle}>
            <MDBCardBody>
                <MDBTypography style={{ height: "525px", overflow: "scroll" }} listUnStyled className="mb-0">


                        <div>
                            <li  className="p-2 border-bottom" onClick={() => handleUserClick()}>

                                <a
                                    style={circleStyle}
                                    className={ 'd-flex justify-content-between btn-secondary'}>
                                    <div className="d-flex flex-row">

                                            {/*<img*/}
                                            {/*    src="./img/people.png"*/}
                                            {/*    alt="avatar"*/}
                                            {/*    className="rounded-circle d-flex align-self-center me-3 shadow-1-strong"*/}
                                            {/*    width="60" />*/}

                                            <img
                                                src=""
                                                alt="avatar"
                                                className="rounded-circle d-flex align-self-center me-3 shadow-1-strong"
                                                width="60"
                                            />


                                        <div className="pt-1">
                                            <p className="fw-bold mb-0">Tin</p>
                                            <p className="small text-muted">
                                                {/* Lorem ipsum dolor sit. */}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="pt-1">
                                        <p style={{ marginRight: 10 }} className="small text-muted mb-1" ></p>
                                    </div>
                                </a>
                            </li>

                        </div>


                </MDBTypography>
            </MDBCardBody>
        </MDBCard>
    );
}
import React from 'react';

const ErrorMessage=({message,removeErrorMessage}:{
    message:{
        id: string;
        title: string;
        message: string;
    },
    removeErrorMessage:((id: string) => void) | undefined
})=>{
    return (
        <div className="Error" style={{
            boxShadow: "rgba(0, 0, 0, 0.486) 0px 0px 5px",
            width: "500px",
            padding: "15px 20px",
            transition: "cubic-bezier(.21,.49,.46,1.17) all 0.2s",
            position: "relative",
            borderRadius: "10px",
            background: "rgba(255, 255, 255, 0.799)",
            backdropFilter: "blur(6px)",
            zIndex:500
        }}>
            <h1 style={{
                fontSize: "30px",
                background: "linear-gradient(to right bottom,rgb(255, 0, 0),rgb(255, 4, 79))",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontFamily: "'Poppins', sans-serif"
            }}>{message.title}</h1>
            {/* <hr style={{
                margin: "5px 0px",
                opacity: "0.5"
            }}/> */}
            <p style={{
                fontSize: "18px",
                marginBottom: "5px",
                color: "rgb(43, 39, 39)",
                fontFamily: "'Open Sans', sans-serif"
            }}>{message.message}</p>
            <span style={{
                position: "absolute",
                top: "12px",
                right: "12px"
            }}
            onClick={()=>removeErrorMessage?removeErrorMessage(message.id):null}><i className="fa fa-times" aria-hidden="true"></i></span>
        </div>
    );
}


export default ErrorMessage;
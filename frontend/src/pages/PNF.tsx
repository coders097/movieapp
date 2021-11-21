import React from 'react';
import { useHistory } from 'react-router';
import noplacepic from '../assets/noplace.jpg';

function PNF() {

    let history=useHistory();
    return (
        <section className="PNF" style={{
            display:"flex",
            justifyContent:"center",
            alignItems:"center",
            flexDirection:"column",
            height:"500px",
            width:"100%",
            background:`linear-gradient(to bottom,rgba(0, 0, 0, 0.2),rgba(0, 0, 0, 0.5)),url(${noplacepic}) center no-repeat`,
            backgroundSize:"cover"
        }}>
            <h1 style={{
                fontSize:"8vw",
                color:"white"
            }}>404</h1>
            <p style={{
                fontSize:"4vw",
                color:"white",
                marginBottom:"10px"
            }}>Seems like you are lost in this site</p>
            <button className="btn" onClick={()=>history.push("/")}>Go Back Home</button>
        </section>
    );
}

export default PNF;
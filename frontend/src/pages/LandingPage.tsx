import React, { createRef, useContext, useEffect, useState } from 'react';
import '../scss/LandingPage.scss';
import logo from '../assets/logo.png';
import servicePic1 from '../assets/servicepic1.png';
import servicePic2 from '../assets/servicepic2.png';
import servicePic3 from '../assets/servicepic3.png';
import SignupComponent from '../components/SignupComponent';
import { AUTHCONTEXT, ERRORCONTEXT } from '../App';
import { useHistory } from 'react-router';
import keyGen from "../utils/uniqueKeysGenerator";
let basicUrl="http://localhost:3200";


const LandingPage=()=>{

    let [showSignInView,setSignInView]=useState(false);
    let errorContext=useContext(ERRORCONTEXT);
    let email=createRef<HTMLInputElement>();
    let password=createRef<HTMLInputElement>();

    let authContext=useContext(AUTHCONTEXT);
    useEffect(()=>{
        window.scrollTo(0,0);
        authContext?.authDispatch({
            type:"CACHE_LOAD_LOGIN",
            payload:{
                setSignIn:authContext?.setSignIn
            }
        });
    },[]);

    return (
        <>
           <header className="Hero-Section">
                <div className="nav">
                    <img src={logo} alt="logo"/>
                    <button className="btn btn-danger" onClick={()=>setSignInView(!showSignInView)}>{
                        showSignInView?"Signup":"Signin"}</button>
                </div>
                <div className="hero-details">
                    {showSignInView?<>
                        <h1>
                            Signin to your account
                        </h1>
                        <p>New Movies & Shows are updated</p>
                        <div className="input-box" style={{
                            flexDirection:"column",
                            alignItems:"center"
                        }}>
                            <input type="email" ref={email} placeholder="Enter your email"/>
                            <input type="password" ref={password} placeholder="Enter your password"/>
                            <button onClick={()=>{
                                if(email.current?.checkValidity() && password.current?.checkValidity()){
                                    fetch(basicUrl+"/auth/login",{
                                        method:"POST",
                                        headers:{
                                            "Content-Type":"application/json"
                                        },
                                        body:JSON.stringify({
                                            email:email.current.value,
                                            password:password.current.value
                                        })
                                    }).then(res=>res.json()).then(data=>{
                                        if(data.success){
                                            authContext?.authDispatch({
                                                type:"LOGIN",
                                                payload:data.data
                                            });
                                            authContext?.setSignIn(true);
                                        }else {
                                            console.log(data.error);
                                            errorContext?.addErrorMessage({
                                                id:keyGen(),
                                                title:"AUTHENTICATION",
                                                message:data.error
                                            })
                                        }
                                    }).catch(err=>{
                                        console.log(err);
                                        errorContext?.addErrorMessage({
                                            id:keyGen(),
                                            title:"AUTHENTICATION",
                                            message:"Login Failed Due To Network/SERVER"
                                        })
                                    });
                                }
                            }} className="btn">Let's go</button>
                        </div>
                    </>
                    :<SignupComponent setSignInView={setSignInView}/>}
                </div>
           </header>
           <section className="About-Section">
                <p>Videonet is a media library containing informations on movies, tv shows and actors providing 
                you with latest data and watching their trailers with the ability to bookmark your favorites.
                </p>
                <h2>- <span>CEO</span> Loren Jonas</h2>
           </section>
           <section className="Services-Section">
                <h2>Our Services</h2>
                <div className="all-cards">
                    <div className="service-card">
                        <img src={servicePic2} alt="service"/>
                        <h3>
                            Get Information of all latest Movies and TV Shows and of course search for them according to your favorite actors. We just have a ton of content for you.
                        </h3>
                    </div>
                    <div className="service-card">
                        <img src={servicePic3} alt="service"/>
                        <h3>
                            Watch the trailers of all movies, tv shows whether it can be trending or of your favorite actors.
                            Search all our database containing about millions.
                        </h3>
                    </div>
                    <div className="service-card">
                        <img src={servicePic1} alt="service"/>
                        <h3>
                            We also provide you a wonderful way to save your interest for movies and tv shows. Make them as bookmarks. Know about them
                            anytime you want.
                        </h3>
                    </div>
                </div>
           </section>
           <section className="footer">
                <p>Made with <span><i className="fa fa-heart" aria-hidden="true"></i></span> by Biswamohan 2021. Feel free to contact me at bmd097@gmail.com</p>
           </section>
        </>
    );
}

export default LandingPage;
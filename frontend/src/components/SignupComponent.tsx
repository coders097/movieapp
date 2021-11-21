import React, { createRef, useContext, useState } from 'react';
import { ERRORCONTEXT } from '../App';
import userdefaultpic from '../assets/avatar.jpg';
import keyGen from "../utils/uniqueKeysGenerator";
let basicUrl="http://localhost:3200";



function SignupComponent({setSignInView}:{
    setSignInView:React.Dispatch<React.SetStateAction<boolean>>
}) {

    let errorContext=useContext(ERRORCONTEXT);

    let [flow,setFlow]=useState(true);
    let [_email,setEmail]=useState("");
    let pic=createRef<HTMLInputElement>();
    let email=createRef<HTMLInputElement>();
    let password=createRef<HTMLInputElement>();
    let name=createRef<HTMLInputElement>();
    let selectCheck=createRef<HTMLInputElement>();
    let picView=createRef<HTMLImageElement>();

    let signup=()=>{
        if(password.current?.checkValidity() && (name.current!.value.length>=3) && selectCheck.current?.checked){
            let formData=new FormData();
            formData.append("name",name.current!.value);
            formData.append("email",_email);
            formData.append("password",password.current!.value);
            if(pic.current!.files!.length!==0){
                formData.append("pic",pic.current!.files![0]);
            }
            fetch(basicUrl+"/auth/signup",{
                method:"POST",
                body:formData
            }).then(res=>res.json()).then(data=>{
                console.log(data);
                if(data.success){
                    setSignInView(true);
                }else {
                    console.log("Failed");
                    errorContext?.addErrorMessage({
                        id:keyGen(),
                        title:"AUTHENTICATION",
                        message:"Signup Failed Due To SERVER"
                    });
                }
                }).catch(err=>{
                    console.log("Failed");
                    errorContext?.addErrorMessage({
                        id:keyGen(),
                        title:"AUTHENTICATION",
                        message:"SERVER PROBLEM!"
                    })
                });
        }
    }

    return (
        <>
            {flow?<>
                <h1>
                Unlimited Movies & TV Shows
            </h1>
            <p>Watch Trailers Anytime & Find All Trending Currents Here</p>
            <div className="input-box">
                <input type="email" placeholder="Enter your email" ref={email}/>
                <button className="btn btn-danger" onClick={()=>{
                    if(email.current!.value.length>1 && email.current!.checkValidity()){
                        console.log(email.current?.checkValidity());
                        setEmail(email.current!.value);
                        setFlow(!flow);
                    }
                }}>GET STARTED</button>
            </div></>:<>
            <figure>
                <img src={userdefaultpic} alt="profile-pic" ref={picView}/>
            </figure>
            <input type="file" style={{display:"none"}} onChange={(e)=>{
                if(e.target.files!.length>0){
                    let url=URL.createObjectURL(e.target.files![0]);
                    picView.current!.src=url;
                    setTimeout(()=>URL.revokeObjectURL(url),1500);
                }
            }} ref={pic}/>
            <button className="btn" onClick={()=>pic.current?.click()}>Choose Pic</button>
            <input type="text" placeholder="Enter your name" ref={name}/>
            <input type="password" placeholder="Enter your new password" ref={password}/>
            <h4><input type="checkbox" ref={selectCheck}/> I agree to all terms & conditions according to the <span>Videonet Customer Agreement.</span></h4>
            <div style={{display:"flex",gap:"10px"}}>
                <button className="btn" onClick={()=>setFlow(!flow)}>Go Back</button>
                <button className="btn" onClick={()=>signup()}>Create Account</button>
            </div> </>}
        </>
    );
}

export default SignupComponent; 
import React, { createRef, useContext } from 'react';
import ReactDOM from 'react-dom';
import '../scss/EditProfile.scss';
import pic from '../assets/test.jpg';
import { AUTHCONTEXT, ERRORCONTEXT } from '../App';
import keyGen from "../utils/uniqueKeysGenerator";


 const EditProfile=({setShowEditProfileView}:{
  setShowEditProfileView:React.Dispatch<React.SetStateAction<boolean>>
})=>{

  let authContext=useContext(AUTHCONTEXT);
  let errorContext=useContext(ERRORCONTEXT);

  let name=createRef<HTMLInputElement>();
  let email=createRef<HTMLInputElement>();
  let password=createRef<HTMLInputElement>();
  let picInput=createRef<HTMLInputElement>();
  let pic=createRef<HTMLImageElement>();

  let deleteCheckInput=createRef<HTMLInputElement>();
  let deleteProfile=()=>{
    if(deleteCheckInput.current?.value!==authContext?.authState.name){
      alert("Type there first!");
      return;
    }
    fetch("http://localhost:3200/auth/deleteProfile",{
      method:"POST",
      headers:{
        "Authorization":`Bearer ${authContext?.authState.token}`,
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        id:authContext?.authState._id
      })
    }).then(res=>res.json()).then(data=>{
      if(data.success){
        authContext?.logOut();
      }else{
        console.log("failed");
        errorContext?.addErrorMessage({
          id:keyGen(),
          title:"PROFILE EDIT",
          message:"Failed to delete your profile!"
        })
      }
    }).catch(err=>{
      console.log(err);
      errorContext?.addErrorMessage({
        id:keyGen(),
        title:"PROFILE EDIT",
        message:"May be disconnected or session closed. Refresh!"
      })
    });
  }

  let editProfile=()=>{
    let _name=name.current?.value.trim();
    let _email=email.current?.value.trim();
    let _password=password.current?.value.trim();
    if(_name!=="" || 
    _email!=="" ||
    _password!=="" ||
    picInput.current!.files!.length>0){
      if(_name!=="" && _name!.length!<3){
        alert("Invalid Name!");
        return;
      }
      if(_email!=="" && !email.current?.checkValidity()){
        alert("Invalid Email!");
        return;
      }
      if(_password!=="" && !password.current?.checkValidity()){
        alert("Invalid Password!");
        return;
      }


      let formData=new FormData();
      formData.append("id",authContext!.authState._id);
      if(_name!=="") formData.append("name",_name!);
      if(_email!=="") formData.append("email",_email!);
      if(_password!=="") formData.append("password",_password!);
      if(picInput.current!.files!.length>0) formData.append("pic",picInput.current!.files![0]);


      fetch("http://localhost:3200/auth/editProfile",{
        method:"POST",
        headers:{
          "Authorization":`Bearer ${authContext?.authState.token}`,
        },
        body:formData
      }).then(res=>res.json()).then(data=>{
        if(data.success){
          authContext?.authDispatch({
            type:"EDITPROFILE",
            payload:data.data
          });
          alert("Success!");
        }else{
          console.log("Failed");
          errorContext?.addErrorMessage({
            id:keyGen(),
            title:"PROFILE EDIT",
            message:"Server Problem could not edit your profile!"
          })
        }
      }).catch(err=>{
        console.log(err);
      });
    }
  }
  
    return (
        ReactDOM.createPortal(<> 
          <div className="profile">
            <h1>Profile</h1>
            <p onClick={()=>setShowEditProfileView(false)}><i className="fa fa-times" aria-hidden="true"></i></p>
          </div>  
          <form>
            <figure onClick={()=>picInput.current?.click()}>
                <img src={"http://localhost:3200/auth/accountPic/"+authContext?.authState.pic} alt="user-pic" ref={pic}/>
                <input type="file" style={{display:"none"}} ref={picInput} onChange={e=>{
                  if(e.target.files!.length>0){
                    let url=URL.createObjectURL(e.target.files![0]);
                    pic.current!.src=url;
                    setTimeout(()=>URL.revokeObjectURL(url),1500);
                  }
                }}/>
            </figure>
            <div className="profile-details">
                <label htmlFor={"edit-profile-name"} style={{userSelect:"none",pointerEvents:"none"}}>{authContext?.authState.name}</label>
                <input className="_input" id="edit-profile-name" type="text" ref={name} placeholder="Enter new name"/>
                <label htmlFor={"edit-profile-email"}>{authContext?.authState.email}</label>
                <input className="_input" id="edit-profile-email" type="email" ref={email} placeholder="Enter new email"/>
                <label htmlFor={"edit-profile-password"}>Edit Password</label>
                <input className="_input" id="edit-profile-password" type="password" ref={password} placeholder="Enter new password"/>
                <button className="btn" onClick={(e)=>{
                  e.preventDefault();
                  editProfile();
                }}>Save</button>
                <hr/>
                <div className="delete-profile">
                    <input className="_input" type="text" placeholder="Type userName to delete account" onChange={e=>{
                      if(e.target.value===authContext?.authState.name) e.target.style.color="green";
                      else e.target.style.color="red";
                    }} ref={deleteCheckInput}/>
                    <button className="btn btn-danger" onClick={e=>{
                      e.preventDefault();
                      deleteProfile();
                    }}>Delete</button>
                </div>
            </div>
          </form>
        </>,document.getElementById("EditProfile") as HTMLElement)
    );
}

export default EditProfile;
import React, { useEffect } from 'react';
import { useHistory } from 'react-router';
import '../scss/HomePage.scss';

function HomePage() {

    let history=useHistory();
    useEffect(()=>{
        window.scrollTo(0,0);
    },[]);

    return (
        <section className="HomePage">
            <h1>What do you want to view?</h1>
            <div>
               <button className="main-btn" style={{color:"rgb(3, 124, 194)"}} onClick={()=>history.push("/movies")}>Movies</button> 
               <button className="main-btn" style={{color:"rgb(3, 128, 3)"}}
                onClick={()=>history.push("/shows")}>Shows</button> 
            </div>
            <span>or</span>
            <h2>check your bookmarks</h2>
            <button className="main-btn" style={{color:"grey"}}
             onClick={()=>history.push("/bookmarks")}>Bookmarks</button>
        </section>
    );
}

export default HomePage;
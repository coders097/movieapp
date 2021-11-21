import React from 'react';
import logo from '../assets/logo.png';
import Brand1 from '../assets/brands/amazon.png';
import Brand2 from '../assets/brands/netflix.png';
import Brand3 from '../assets/brands/spotify.png';
import Brand4 from '../assets/brands/hotstar.svg';
import Brand5 from '../assets/brands/hulu.svg';
import '../scss/Footer.scss';

function Footer() {
    return (
        <footer>
            <img src={logo} alt="logo" draggable="false"/>
            <div className="text">
                <h1>VideoNet</h1>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cum reprehenderit,
                     numquam, corrupti pariatur vitae ad nesciunt doloremque in amet optio esse quidem 
                     laudantium atque inventore? Ipsa illum iste, sint eligendi aliquid tempore 
                     repudiandae odit commodi eius quos illo impedit ipsum laboriosam possimus
                      dicta et qui assumenda! Illum, voluptatibus quae nam amet tempora blanditiis
                       pariatur iste eius laborum perspiciatis magni ab saepe explicabo? Nemo et 
                       commodi hic delectus dolorem aliquam aliquid labore autem molestias in.
                        Ipsam incidunt exercitationem pariatur repellendus fugit neque architecto
                         a excepturi dolorum illum impedit esse laborum ipsum facilis, amet voluptatem
                          minima possimus, minus voluptas? In, delectus reprehenderit!</p>
                <h3>Streaming Partners</h3>
                <div className="partners">
                    <img src={Brand1} alt="brand" draggable="false"/>
                    <img src={Brand2} alt="brand" draggable="false"/>
                    <img src={Brand3} alt="brand" draggable="false"/>
                    <img src={Brand4} alt="brand" draggable="false"/>
                    <img src={Brand5} alt="brand" draggable="false"/>
                </div>

            </div>
        </footer>
    );
}

export default React.memo(Footer);
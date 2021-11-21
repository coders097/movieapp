import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import "../scss/ImageViewer.scss";

interface Props{
    pic:string,
    setPicState:React.Dispatch<React.SetStateAction<{
      pic: string;
      show: boolean;
  }>>
}

const ImageViewer:React.FC<Props> = ({pic,setPicState}) => {

  let zoomContainer = React.createRef<HTMLDivElement>();
  useEffect(() => {
    let scale = 1;
    let panning = false;
    let pointX = 0;
    let pointY = 0;
    let start = {
      x: 0,
      y: 0,
    };

    let setTransform = () => {
      if (zoomContainer.current) {
        zoomContainer.current.style.transform =`scale(${scale}) translate(${Math.ceil(pointX)}px,${Math.ceil(pointY)}px)`;
      }
    };

    if(zoomContainer.current){
        zoomContainer.current.addEventListener("mousedown", (e) => {
        e.preventDefault();
        start = { x: e.clientX - pointX, y: e.clientY - pointY };
        panning = true;
        });

        zoomContainer.current.addEventListener("mouseup", (e) => {
        panning = false;
        });

        zoomContainer.current.addEventListener("mousemove", (e) => {
        e.preventDefault();
        if (!panning) return;
        pointX = e.clientX - start.x;
        pointY = e.clientY - start.y;
        setTransform();
        });

        zoomContainer.current.addEventListener("wheel", (e) => {
        e.preventDefault();
        let xs = (e.clientX - pointX) / scale;
        let ys = (e.clientY - pointY) / scale;
        let delta = -e.deltaY;
        if (delta > 0) scale = Math.min(2.5,scale * 1.2);
        else scale = Math.max(1,scale / 1.2);
        pointX = e.clientX - xs * scale;
        pointY = e.clientY - ys * scale;
        setTransform();
        });
        setTransform();
    }
  }, [pic]);

  return (
      ReactDOM.createPortal(
        <>
            <div className="zoom" ref={zoomContainer}>
                <img src={pic} alt="image-pic" />
            </div>
            <p onClick={()=>setPicState({
              pic:"",
              show:false
            })}><i className="fa fa-times" aria-hidden="true"></i></p>
        </>,document.getElementById("ImageViewer") as HTMLElement)
  );
};

export default ImageViewer;

import React from 'react';
import '../scss/PartialView.scss';
import ReactDOM from 'react-dom';
import MovieOrTVHeaderView from './MovieOrTVHeaderView';

const PartialView = ({partialView,setPartialView}:{
    partialView:{
        show: boolean;
        data: {};
        type: string;
    },
    setPartialView:React.Dispatch<React.SetStateAction<{
        show: boolean;
        data: {};
        type: string;
    }>>
}) => {
    return (
        ReactDOM.createPortal(<>
            {partialView.show?<MovieOrTVHeaderView setPartialView={setPartialView} partialView={partialView}/>:null}
        </>,document.querySelector('.PartialView') as HTMLElement)
    );
};

export default PartialView;
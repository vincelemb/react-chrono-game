import React from 'react';

import { CloseSvg } from '../components/svg';

type ModalProps = {
    onCloseBtnClick?: (event: any) => void;
    count?: number | string;
    isIcon?: boolean;
    iconPosition?: string;
    title?: string;
    bgColor?: string;
    isModal: boolean;
    isOverlay?:boolean;
};

const Modal: React.FC<ModalProps> = (props: React.PropsWithChildren<ModalProps>) => {

    return (
        <React.Fragment>
            {props.isModal === true && (
                <div className="_fixed  _top-0 _bottom-0 _left-0 _right-0 _z-50 _w-full _h-full _justify-center _items-center _flex" 
                style={{backgroundColor:`${props.isOverlay === true ? "rgba(0,0,0,.8)" : "transparent"}`}}>
                    <button className="_absolute _top-0 _right-0 _m-sm" onClick={props.onCloseBtnClick && props.onCloseBtnClick}><CloseSvg svgWidth="25px"></CloseSvg></button>
                    <div className="_flex-col _flex _justify-center _items-center _absolute _h-auto _p-sm">
                        {props.children}
                    </div>
                </div>
            )}
        </React.Fragment>

    );
};

export default Modal;

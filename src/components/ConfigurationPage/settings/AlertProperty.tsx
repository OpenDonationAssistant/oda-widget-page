import React from "react";

export default function AlertProperty({ alert, number, isSelected }:{ alert:any, number: number, isSelected: boolean}){
  return (
    <>
      (
        <div key={number} className="payment-alerts-previews-item">
          {alert.image && (
            <img
              className={`payment-alert-image-preview ${
                isSelected ? "selected" : ""
              }`}
              src={`${process.env.REACT_APP_FILE_API_ENDPOINT}/files/${alert.image}`}
              onClick={() => {
                setTab("trigger");
                setSelected(isSelected ? -2 : number);
              }}
            />
          )}
          {alert.video && (
            <video
              className={`payment-alert-image-preview ${
                isSelected ? "selected" : ""
              }`}
              src={`${process.env.REACT_APP_FILE_API_ENDPOINT}/files/${alert.video}`}
              muted={true}
              onClick={() => {
                setTab("trigger");
                setSelected(isSelected ? -2 : number);
              }}
            />
          )}
          {!alert.image && !alert.video && (
            <div
              onClick={() => {
                setTab("trigger");
                setSelected(isSelected ? -2 : number);
              }}
              className={`payment-alert-image-preview ${
                isSelected ? "selected" : ""
              }`}
            ></div>
          )}
          {isSelected && (
            <div onClick={() => deleteAlert()} className="alert-delete-button">
              <span className="material-symbols-sharp">delete</span>
            </div>
          )}
        </div>
      )
    </>
  );
}

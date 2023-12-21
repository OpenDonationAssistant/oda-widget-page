import React from "react";
import "./css/Toolbar.css";

export default function Toolbar() {
  return (
    <div className="toolbar">
      <div className="toolbar-title">
			<img className="oda-logo" src={`${process.env.PUBLIC_URL}/favicon.png`}/>
			</div>
      <button className="toolbar-button">
        <span className="material-symbols-sharp">rss_feed</span>
        <span className="toolbar-button-title">News</span>
      </button>
      <button className="toolbar-button active">
        <span className="material-symbols-sharp">widgets</span>
        <span className="toolbar-button-title">Widgets</span>
      </button>
      <button className="toolbar-button">
        <span className="material-symbols-sharp">credit_card</span>
        <span className="toolbar-button-title">Payment Gateways</span>
      </button>
      <button className="toolbar-button">
        <span className="material-symbols-sharp">language</span>
        <span className="toolbar-button-title">Donation page</span>
      </button>
    </div>
  );
}

import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import classes from "./Menu.module.css";

export default function Menu({ children }: { children: React.ReactNode }) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const navigate = useNavigate();

  function listenCloseMediaMenuEvent() {
    setShowMenu(!showMenu);
  }

  useEffect(() => {
    document.addEventListener("closeMediaMenu", listenCloseMediaMenuEvent);
    return () =>
      document.removeEventListener("closeMediaMenu", listenCloseMediaMenuEvent);
  }, [menuRef]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target) &&
        showMenu
      ) {
        setShowMenu(false);
        if (menuRef.current && menuRef.current.contains(event.target)) {
          event.target.click();
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu, menuRef, buttonRef]);

  return (
    <div>
      <button
        ref={buttonRef}
        className={`${classes.menubutton} btn btn-outline-dark`}
        onClick={() => setShowMenu(!showMenu)}
      >
        <img
          className={classes.logo}
          src={`${process.env.PUBLIC_URL}/favicon.png`}
        />
      </button>
      <div
        ref={menuRef}
        className={`${classes.widgetmenu} ${showMenu ? "" : "visually-hidden"}`}
      >
        <button className="btn btn-dark" onClick={() => navigate(0)}>
          Reload
        </button>
        {children}
      </div>
    </div>
  );
}

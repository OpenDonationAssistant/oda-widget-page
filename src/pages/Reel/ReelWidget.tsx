import Glide from '@glidejs/glide';
import "@glidejs/glide/dist/css/glide.core.min.css";
import "@glidejs/glide/dist/css/glide.theme.min.css";

import React, { useEffect, useRef } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { setupCommandListener } from "../../socket";

export default function ReelWidget({}) {
  const { recipientId, settings, conf, widgetId } = useLoaderData();
  const navigate = useNavigate();
  const glideRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setupCommandListener(widgetId, () => navigate(0));
  }, [widgetId]);

  useEffect(() => {
    if (!glideRef) {
      return;
    }

    const glide = new Glide('.glide',{ type: 'carousel',perView: 3, rewind: true, animationDuration: 140 }).mount();
    setupScroll(glide, 20);
  }, [glideRef]);

  function setupScroll(glide:any, iteration: number){
    if (iteration < 1){
      return;
    }
    const scroll = () => glide.go(`=${getRndInteger(0,3)}`);
    setTimeout(() => {
      scroll();
      setupScroll(glide, iteration - 1);
    }, 140);
  }

  function getRndInteger(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `html, body {height: 100%; background-color: "rgba(0,0,0,0)";}`,
        }}
      />
      <div>
        <div className="glide" ref={glideRef}>
          <div className="glide__track" data-glide-el="track">
            <ul className="glide__slides">
              <li className="glide__slide">0</li>
              <li className="glide__slide">1</li>
              <li className="glide__slide">2</li>
              <li className="glide__slide">3</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

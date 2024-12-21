"use client";
import { useEffect, useRef, useState } from "react";
import Button from "./Button";
import { TiLocationArrow } from "react-icons/ti";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { FC } from "react";

gsap.registerPlugin(ScrollTrigger);

const Hero: FC = () => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [hasClicked, setHasClicked] = useState(false);
  const totalImages = 4;

  const upcomingImageIndex = (currentIndex % totalImages) + 1;

  useEffect(() => {
    if (hasClicked) {
      gsap.set("#next-image", { visibility: "visible" });

      gsap.to("#next-image", {
        transformOrigin: "center center",
        scale: 1,
        width: "100%",
        height: "100%",
        duration: 1,
        ease: "power1.inOut",
      });

      gsap.from("#current-image", {
        transformOrigin: "center center",
        scale: 0,
        duration: 1.5,
        ease: "power1.inOut",
      });
    }
  }, [hasClicked]);

  useEffect(() => {
    gsap.set("#image-frame", {
      clipPath: "polygon(14% 0, 72% 0, 88% 90%, 0 95%)",
      borderRadius: "0% 0% 40% 10%",
    });

    gsap.from("#image-frame", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      borderRadius: "0% 0% 0% 0%",
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: "#image-frame",
        start: "center center",
        end: "bottom center",
        scrub: true,
      },
    });
  }, []);

  return (
    <div id="home" className="relative h-screen w-screen overflow-hidden">
      
      <div
        id="image-frame"
        className="relative z-10 h-screen w-screen overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: `url(/images/BG.png)` }}
      >

        <div className="absolute top-0 left-0 w-full h-full">
          <div className="mt-24 px-5 sm:px-10">
            <h1 className="special-font hero-heading text-blue-100">
              Porch<b>e</b>911
            </h1>
            <p className="mb-5 max-w-lg text-blue-100 font-medium text-lg">
            Sleek and timeless, the Porsche 911<br/> embodies unparalleled performance.
            </p>
            <a href="/Market-Place" target="_blank" rel="noopener noreferrer">
              <Button
                id="watch-trailer"
                title="Visit MarketPlace"
                leftIcon={<TiLocationArrow />}
                containerClass="bg-red-800 flex-center gap-1"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

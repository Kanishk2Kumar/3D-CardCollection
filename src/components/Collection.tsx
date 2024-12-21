"use client";
import { useState, useRef, ReactNode, MouseEvent, FC } from "react";
import { TiLocationArrow } from "react-icons/ti";

interface BentoTiltProps {
  children: ReactNode;
  className?: string;
}

export const BentoTilt: FC<BentoTiltProps> = ({ children, className = "" }) => {
  const [transformStyle, setTransformStyle] = useState<string>("");
  const itemRef = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (!itemRef.current) return;

    const { left, top, width, height } =
      itemRef.current.getBoundingClientRect();

    const relativeX = (event.clientX - left) / width;
    const relativeY = (event.clientY - top) / height;

    const tiltX = (relativeY - 0.5) * 5;
    const tiltY = (relativeX - 0.5) * -5;

    const newTransform = `perspective(700px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(.95, .95, .95)`;
    setTransformStyle(newTransform);
  };

  const handleMouseLeave = () => {
    setTransformStyle("");
  };

  return (
    <div
      ref={itemRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform: transformStyle }}
    >
      {children}
    </div>
  );
};

interface BentoCardProps {
  src: string;
  title: ReactNode;
  description?: string;
  isComingSoon?: boolean;
  imageClassName?: string; // New prop for custom image classes
}

export const BentoCard: FC<BentoCardProps> = ({
  src,
  title,
  description,
  isComingSoon,
  imageClassName = "", // Default to an empty string if not provided
}) => {
  return (
    <div className="relative size-full">
      <img
        src={src}
        alt={typeof title === "string" ? title : "Car Image"}
        className={`absolute left-0 top-0 size-full object-cover object-center ${imageClassName}`}
      />
      <div className="relative z-10 flex size-full flex-col justify-between p-5 text-blue-50">
        <div>
          <h1 className="bento-title special-font">{title}</h1>
          {description && (
            <p className="mt-3 max-w-64 text-xs md:text-base">{description}</p>
          )}
        </div>
        {isComingSoon && (
          <div className="border-hsla relative flex w-fit cursor-pointer items-center gap-1 overflow-hidden rounded-full bg-red-900 px-5 py-2 text-xs uppercase text-white">
            <TiLocationArrow className="relative z-20" />
            <p className="relative z-20">Launched Recently</p>
          </div>
        )}
      </div>
    </div>
  );
};

const Features: FC = () => (
  <section className="bg-black pb-52 lg:px-20">
    <div className="container mx-auto px-3 md:px-10">
      <div className="px-5 py-32">
        <p className="font-circular-web text-lg text-blue-50">
          Into the Metagame Layer
        </p>
        <p className="max-w-md font-circular-web text-lg text-blue-50 opacity-50">
          Immerse yourself in a showcase of high-performance cars with elegant
          and dynamic designs.
        </p>
      </div>

      <BentoTilt className="border-hsla relative mb-7 h-96 w-full overflow-hidden rounded-md md:h-[65vh]">
        <BentoCard
          src="./images/BMW-M5.png"
          title="BMW M5"
          description="Experience the fusion of luxury and power in the iconic BMW M5."
          isComingSoon
        />
      </BentoTilt>

      <div className="grid h-[135vh] w-full grid-cols-2 grid-rows-3 gap-7">
        <BentoTilt className="bento-tilt_1 row-span-1 md:col-span-1 md:row-span-2">
          <BentoCard
            src="images/Porche911(930).png"
            title="Porsche 911 (930)"
            description="The legendary Porsche 911 (930) - a true classic of its era."
            isComingSoon
            imageClassName="!h-auto mt-32"
          />
        </BentoTilt>

        <BentoTilt className="bento-tilt_1 row-span-1 ms-32 md:col-span-1 md:ms-0">
          <BentoCard
            src="images/Porche911.png"
            title="Porsche 911"
            description="Sleek and timeless, the Porsche 911 embodies unparalleled performance."
            isComingSoon
          />
        </BentoTilt>

        <BentoTilt className="bento-tilt_1 me-14 md:col-span-1 md:me-0">
          <BentoCard
            src="images/MCLaren.png"
            title="McLaren 720S"
            description="The McLaren 720S redefines the supercar experience with its agility and power."
            isComingSoon
            imageClassName="!h-auto m-10 pb-20"
          />
        </BentoTilt>
        <BentoTilt className="bento-tilt_2">
          <div className="flex size-full flex-col justify-between bg-red-100 p-5">
            <h1 className="bento-title special-font max-w-64 text-black">
              More cars coming soon.
            </h1>
            <TiLocationArrow className="m-5 scale-[5] self-end" />
          </div>
        </BentoTilt>

        <BentoTilt className="bento-tilt_2">
          <img
            src="images/Lamborghini.png"
            alt="Lamborghini"
            className="size-full object-cover object-center"
          />
        </BentoTilt>
      </div>
    </div>
  </section>
);

export default Features;

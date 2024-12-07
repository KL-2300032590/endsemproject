import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const CursorFollower = () => {
  const cursorRef = useRef(null);
  const cursorDotRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      gsap.to(cursorRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.5,
        ease: "power2.out",
      });
    };

    const handleClick = () => {
      // Create pop animation
      gsap.to(cursorRef.current, {
        scale: 1.5,
        duration: 0.2,
        ease: "power2.out",
        onComplete: () => {
          gsap.to(cursorRef.current, {
            scale: 1,
            duration: 0.2,
            ease: "power2.in",
          });
        },
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className="hidden md:block"
        style={{
          position: "fixed",
          width: "40px",
          height: "40px",
          border: "2px solid #ad59ce",
          borderRadius: "50%",
          pointerEvents: "none",
          transform: "translate(-50%, -50%)",
          zIndex: 9999,
          mixBlendMode: "difference",
        }}
      />
    </>
  );
};

export default CursorFollower;

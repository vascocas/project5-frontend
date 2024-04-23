import { useState, useEffect } from "react";
import { userStore } from "../../stores/UserStore";

function MediaType() {
  const updateMediatype = userStore((state) => state.updateMediatype);
  const [mediaType, setMediaType] = useState({
    isBigScreen: false,
    isSmallScreen: false,
    isMobile: false,
    isPortrait: false,
  });

  const handleResize = () => {
    setMediaType({
      isBigScreen: window.matchMedia("(min-width: 1224px)").matches,
      isSmallScreen: window.matchMedia("(min-width: 750px)").matches && window.matchMedia("(max-width: 1224px)").matches,
      isMobile: window.matchMedia("(max-width: 750px)").matches,
      isPortrait: window.matchMedia("(orientation: portrait)").matches,
    });
  };

  useEffect(() => {
    // Initial check
    handleResize();
    // Add event listener
    window.addEventListener("resize", handleResize);
    // Cleanup

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    updateMediatype(mediaType);
  }, [mediaType, updateMediatype]);
}
export default MediaType;

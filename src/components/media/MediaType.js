import { useState, useEffect } from "react";
import { userStore } from "../../stores/UserStore";
function MediaType() {
const updateMediatype = userStore((state) => state.updateMediatype);
const [mediaType, setMediaType] = useState({
isDesktopOrLaptop: false,
isBigScreen: false,
isTabletOrMobile: false,
isPortrate: false,
isRetina: false
});
const handleResize = () => {
setMediaType({
isDesktopOrLaptop: window.matchMedia('(min-width: 1224px)').matches,
isBigScreen: window.matchMedia('(min-width: 1824px)').matches,
isTabletOrMobile: window.matchMedia('(max-width: 1224px)').matches,
isPortrate: window.matchMedia('(orientation: portrait)').matches,
isRetina: window.matchMedia('(min-resolution: 2pppx)').matches
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
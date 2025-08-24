import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        // Reset scroll on every route change
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });

        // Optional: Listen to popstate (browser back/forward)
        const handlePopState = () => {
            window.scrollTo({ top: 0, left: 0, behavior: "auto" });
        };

        window.addEventListener("popstate", handlePopState);

        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, [pathname]);

    return null;
};

export default ScrollToTop;

import { useEffect, useRef } from "react";

export const useIsMounted = () => {
    const isMountRef = useRef(true);
    useEffect(() => {
      isMountRef.current = false;
    }, []);
    return isMountRef.current;
};
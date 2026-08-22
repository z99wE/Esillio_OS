import { useState, useEffect } from "react";

export function useZeroAI() {
    const [isZeroAI, setIsZeroAI] = useState(() => {
        return localStorage.getItem("esillio_zero_ai") === "true";
    });

    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === "esillio_zero_ai") {
                setIsZeroAI(e.newValue === "true");
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    const toggleZeroAI = (value) => {
        localStorage.setItem("esillio_zero_ai", value ? "true" : "false");
        setIsZeroAI(value);
        // Dispatch event for same-tab updates
        window.dispatchEvent(new Event("storage"));
    };

    return { isZeroAI, toggleZeroAI };
}

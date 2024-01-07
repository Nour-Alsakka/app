import { useState, useEffect } from "react";

export function useLocalStorageState(key) {
    const [value, setValue] = useState(function () {
        return localStorage.getItem(key) || "";
    });

    useEffect(
        function () {
            localStorage.setItem(key, value);
        },
        [value, key]
    );
    return [value, setValue];
}

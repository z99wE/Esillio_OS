import { useEffect, useState } from "react";

import {
    getUploadResult,
    subscribe
} from "../services/uploadState";

export default function useUpload() {

    const [result, setResult] =
        useState(getUploadResult());

    useEffect(() => {

        return subscribe(setResult);

    }, []);

    return result;

}
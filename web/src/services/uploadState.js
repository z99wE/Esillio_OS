let uploadResult = null;

const listeners = new Set();

export function setUploadResult(data) {
    uploadResult = data;

    listeners.forEach(listener => listener(uploadResult));
}

export function getUploadResult() {
    return uploadResult;
}

export function subscribe(listener) {
    listeners.add(listener);

    return () => listeners.delete(listener);
}
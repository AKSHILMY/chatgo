type StorableValue = string | number | boolean | object | null;

export function setLocalStorageItem<T extends StorableValue>(key: string, value: T): void {
    try {
        const serialized = JSON.stringify(value);
        localStorage.setItem(key, serialized);
    } catch (err) {
        console.error(`Failed to set localStorage item "${key}":`, err);
    }
}

export function getLocalStorageItem<T>(key: string): T | null {
    try {
        const raw = localStorage.getItem(key);
        return raw ? (JSON.parse(raw) as T) : null;
    } catch (err) {
        console.error(`Failed to parse localStorage item "${key}":`, err);
        return null;
    }
}

export function removeLocalStorageItem(key: string): void {
    try {
        localStorage.removeItem(key);
    } catch (err) {
        console.error(`Failed to remove localStorage item "${key}":`, err);
    }
}

export function clearLocalStorage(): void {
    try {
        localStorage.clear();
    } catch (err) {
        console.error("Failed to clear localStorage:", err);
    }
}

export function hasKey(key: string): boolean {
    return localStorage.getItem(key) !== null;
}

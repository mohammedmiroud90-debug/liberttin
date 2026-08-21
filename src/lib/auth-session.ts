import type { ParseUser } from "./blog/auth";
import { isAdminUser } from "./blog/auth";

export const AUTH_STORAGE_KEY = "billiant.user";

export function readStoredUser(): ParseUser | null {
	if (typeof window === "undefined") return null;
	try {
		const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
		if (!raw) return null;
		const parsed = JSON.parse(raw) as ParseUser;
		return parsed?.sessionToken && parsed?.objectId ? parsed : null;
	} catch {
		return null;
	}
}

export function storeUser(user: ParseUser): void {
	window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
}

export function clearStoredUser(): void {
	window.localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function storedUserIsAdmin(user: ParseUser | null = readStoredUser()): boolean {
	return isAdminUser(user);
}

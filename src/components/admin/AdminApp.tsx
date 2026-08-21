import type { ReactNode } from "react";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { SignInModal } from "@/components/auth/SignInModal";
import { AdminShell } from "@/components/admin/AdminShell";

/** Wraps original Billientt admin pages with auth + shell (unchanged). */
export function AdminApp({ children }: { children: ReactNode }) {
	return (
		<AuthProvider>
			<AdminShell>{children}</AdminShell>
			<SignInModal side="right" />
		</AuthProvider>
	);
}

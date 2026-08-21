import AdminPostsPage from "@/app/[locale]/admin/page";
import AdminCommentsPage from "@/app/[locale]/admin/comments/page";
import AdminSubscribersPage from "@/app/[locale]/admin/subscribers/page";
import AdminAnalyticsPage from "@/app/[locale]/admin/analytics/page";
import AdminSettingsPage from "@/app/[locale]/admin/settings/page";
import NewPostPage from "@/app/[locale]/admin/posts/new/page";
import EditPostPage from "@/app/[locale]/admin/posts/[id]/edit/page";
import { AdminApp } from "@/components/admin/AdminApp";

export function AdminPosts() {
	return (
		<AdminApp>
			<AdminPostsPage />
		</AdminApp>
	);
}

export function AdminComments() {
	return (
		<AdminApp>
			<AdminCommentsPage />
		</AdminApp>
	);
}

export function AdminSubscribers() {
	return (
		<AdminApp>
			<AdminSubscribersPage />
		</AdminApp>
	);
}

export function AdminAnalytics() {
	return (
		<AdminApp>
			<AdminAnalyticsPage />
		</AdminApp>
	);
}

export function AdminSettings() {
	return (
		<AdminApp>
			<AdminSettingsPage />
		</AdminApp>
	);
}

export function AdminNewPost() {
	return (
		<AdminApp>
			<NewPostPage />
		</AdminApp>
	);
}

export function AdminEditPost({ id }: { id: string }) {
	return (
		<AdminApp>
			<EditPostPage params={Promise.resolve({ locale: "en", id })} />
		</AdminApp>
	);
}

/** Reads `/[locale]/admin/posts/[id]/edit/` from the browser URL. */
export function AdminEditPostFromUrl() {
	const id =
		typeof window !== "undefined"
			? (() => {
					const parts = window.location.pathname.split("/").filter(Boolean);
					const idx = parts.indexOf("posts");
					return idx >= 0 ? parts[idx + 1] || "" : "";
				})()
			: "";

	if (!id || id === "placeholder") {
		return (
			<AdminApp>
				<div className="mx-auto max-w-4xl px-4 py-24 text-center text-sm text-gray-500">
					Loading post…
				</div>
			</AdminApp>
		);
	}

	return <AdminEditPost id={id} />;
}

import type { Locale } from "./locales";
import { DEFAULT_LOCALE } from "./locales";

type UiKey =
	| "nav.home"
	| "nav.blog"
	| "nav.about"
	| "nav.contact"
	| "nav.policies"
	| "home.latest"
	| "home.viewAll"
	| "home.empty"
	| "blog.empty"
	| "comments.title"
	| "comments.placeholder"
	| "comments.respond"
	| "comments.empty"
	| "comments.reply"
	| "footer.rights"
	| "toc.label"
	| "lang.switch"
	| "search.title"
	| "search.description"
	| "search.button"
	| "search.placeholder"
	| "search.close"
	| "search.hint"
	| "search.noResults"
	| "search.resultsFor"
	| "search.countOne"
	| "search.countMany";

const en: Record<UiKey, string> = {
	"nav.home": "Home",
	"nav.blog": "Blog",
	"nav.about": "About",
	"nav.contact": "Contact",
	"nav.policies": "Policies",
	"home.latest": "Latest posts",
	"home.viewAll": "View all posts →",
	"home.empty": "No posts published yet.",
	"blog.empty": "No posts yet. Check back soon.",
	"comments.title": "Responses",
	"comments.placeholder": "What are your thoughts?",
	"comments.respond": "Respond",
	"comments.empty": "No responses yet. Be the first to share your thoughts.",
	"comments.reply": "Reply",
	"footer.rights": "All rights reserved.",
	"toc.label": "Table of contents",
	"lang.switch": "Switch language",
	"search.title": "Search articles",
	"search.description": "Search Liberttin blog articles",
	"search.button": "Search",
	"search.placeholder": "Search articles…",
	"search.close": "Close search",
	"search.hint": "Enter a search term using the search icon in the header.",
	"search.noResults": "No articles matched your search.",
	"search.resultsFor": "Results for",
	"search.countOne": "1 article found",
	"search.countMany": "articles found",
};

const fr: Record<UiKey, string> = {
	...en,
	"nav.home": "Accueil",
	"nav.blog": "Blog",
	"nav.about": "À propos",
	"nav.contact": "Contact",
	"nav.policies": "Politiques",
	"home.latest": "Derniers articles",
	"home.viewAll": "Voir tous les articles →",
	"home.empty": "Aucun article publié pour le moment.",
	"blog.empty": "Aucun article pour le moment. Revenez bientôt.",
	"comments.title": "Réponses",
	"comments.placeholder": "Quels sont vos pensées ?",
	"comments.respond": "Répondre",
	"comments.empty": "Aucune réponse pour le moment. Soyez le premier à partager.",
	"comments.reply": "Répondre",
	"footer.rights": "Tous droits réservés.",
	"toc.label": "Table des matières",
	"lang.switch": "Changer de langue",
	"search.title": "Rechercher des articles",
	"search.description": "Rechercher des articles sur Liberttin",
	"search.button": "Rechercher",
	"search.placeholder": "Rechercher des articles…",
	"search.close": "Fermer la recherche",
	"search.hint": "Saisissez un terme via l’icône de recherche dans l’en-tête.",
	"search.noResults": "Aucun article ne correspond à votre recherche.",
	"search.resultsFor": "Résultats pour",
	"search.countOne": "1 article trouvé",
	"search.countMany": "articles trouvés",
};

const es: Record<UiKey, string> = {
	...en,
	"nav.home": "Inicio",
	"nav.blog": "Blog",
	"nav.about": "Acerca de",
	"home.latest": "Últimos artículos",
	"home.viewAll": "Ver todos los artículos →",
	"home.empty": "Aún no hay artículos publicados.",
	"blog.empty": "Aún no hay artículos. Vuelve pronto.",
	"comments.title": "Respuestas",
	"comments.placeholder": "¿Qué piensas?",
	"comments.respond": "Responder",
	"comments.empty": "Aún no hay respuestas. Sé el primero en compartir.",
	"comments.reply": "Responder",
	"footer.rights": "Todos los derechos reservados.",
	"toc.label": "Tabla de contenidos",
	"lang.switch": "Cambiar idioma",
	"search.title": "Buscar artículos",
	"search.description": "Buscar artículos en Liberttin",
	"search.button": "Buscar",
	"search.placeholder": "Buscar artículos…",
	"search.close": "Cerrar búsqueda",
	"search.hint": "Introduce un término con el icono de búsqueda del encabezado.",
	"search.noResults": "Ningún artículo coincide con tu búsqueda.",
	"search.resultsFor": "Resultados para",
	"search.countOne": "1 artículo encontrado",
	"search.countMany": "artículos encontrados",
};

const de: Record<UiKey, string> = {
	...en,
	"nav.home": "Start",
	"nav.blog": "Blog",
	"nav.about": "Über uns",
	"home.latest": "Neueste Beiträge",
	"home.viewAll": "Alle Beiträge ansehen →",
	"home.empty": "Noch keine Beiträge veröffentlicht.",
	"blog.empty": "Noch keine Beiträge. Schau bald wieder vorbei.",
	"comments.title": "Antworten",
	"comments.placeholder": "Was denkst du?",
	"comments.respond": "Antworten",
	"comments.empty": "Noch keine Antworten. Sei der Erste.",
	"comments.reply": "Antworten",
	"footer.rights": "Alle Rechte vorbehalten.",
	"toc.label": "Inhaltsverzeichnis",
	"lang.switch": "Sprache wechseln",
	"search.title": "Artikel suchen",
	"search.description": "Artikel auf Liberttin durchsuchen",
	"search.button": "Suchen",
	"search.placeholder": "Artikel suchen…",
	"search.close": "Suche schließen",
	"search.hint": "Geben Sie einen Suchbegriff über das Suchsymbol in der Kopfzeile ein.",
	"search.noResults": "Keine Artikel gefunden.",
	"search.resultsFor": "Ergebnisse für",
	"search.countOne": "1 Artikel gefunden",
	"search.countMany": "Artikel gefunden",
};

const pt: Record<UiKey, string> = {
	...en,
	"nav.home": "Início",
	"nav.blog": "Blog",
	"nav.about": "Sobre",
	"home.latest": "Últimos artigos",
	"home.viewAll": "Ver todos os artigos →",
	"home.empty": "Ainda não há artigos publicados.",
	"blog.empty": "Ainda não há artigos. Volte em breve.",
	"comments.title": "Respostas",
	"comments.placeholder": "O que você pensa?",
	"comments.respond": "Responder",
	"comments.empty": "Ainda não há respostas. Seja o primeiro.",
	"comments.reply": "Responder",
	"footer.rights": "Todos os direitos reservados.",
	"toc.label": "Índice",
	"lang.switch": "Mudar idioma",
	"search.title": "Pesquisar artigos",
	"search.description": "Pesquisar artigos no Liberttin",
	"search.button": "Pesquisar",
	"search.placeholder": "Pesquisar artigos…",
	"search.close": "Fechar pesquisa",
	"search.hint": "Digite um termo usando o ícone de pesquisa no cabeçalho.",
	"search.noResults": "Nenhum artigo corresponde à sua pesquisa.",
	"search.resultsFor": "Resultados para",
	"search.countOne": "1 artigo encontrado",
	"search.countMany": "artigos encontrados",
};

/** Full dictionaries for all locales (fall back to English for incomplete ones). */
const dictionaries: Record<Locale, Record<UiKey, string>> = {
	en,
	fr,
	es,
	de,
	pt,
	ru: { ...en, "nav.home": "Главная", "nav.blog": "Блог", "nav.about": "О нас", "lang.switch": "Сменить язык", "toc.label": "Содержание", "comments.title": "Ответы", "home.latest": "Последние записи", "home.viewAll": "Все записи →", "footer.rights": "Все права защищены." },
	zh: { ...en, "nav.home": "首页", "nav.blog": "博客", "nav.about": "关于", "lang.switch": "切换语言", "toc.label": "目录", "comments.title": "回复", "home.latest": "最新文章", "home.viewAll": "查看全部 →", "footer.rights": "保留所有权利。" },
	ja: { ...en, "nav.home": "ホーム", "nav.blog": "ブログ", "nav.about": "概要", "lang.switch": "言語を切り替え", "toc.label": "目次", "comments.title": "返信", "home.latest": "最新の投稿", "home.viewAll": "すべての投稿 →", "footer.rights": "全著作権所有。" },
	ar: { ...en, "nav.home": "الرئيسية", "nav.blog": "المدونة", "nav.about": "حول", "lang.switch": "تغيير اللغة", "toc.label": "جدول المحتويات", "comments.title": "الردود", "home.latest": "أحدث المقالات", "home.viewAll": "عرض كل المقالات →", "footer.rights": "جميع الحقوق محفوظة." },
	hi: { ...en, "nav.home": "होम", "nav.blog": "ब्लॉग", "nav.about": "परिचय", "lang.switch": "भाषा बदलें", "toc.label": "विषय सूची", "comments.title": "प्रतिक्रियाएँ", "home.latest": "नवीनतम पोस्ट", "home.viewAll": "सभी पोस्ट देखें →", "footer.rights": "सर्वाधिकार सुरक्षित।" },
};

export function t(locale: Locale | string | undefined, key: UiKey): string {
	const code = (locale && dictionaries[locale as Locale] ? locale : DEFAULT_LOCALE) as Locale;
	return dictionaries[code][key] ?? dictionaries[DEFAULT_LOCALE][key] ?? key;
}

export type { UiKey };

import type { Locale } from "./locales";
import { DEFAULT_LOCALE } from "./locales";

type UiKey =
	| "nav.home"
	| "nav.blog"
	| "nav.about"
	| "nav.contact"
	| "nav.policies"
	| "nav.categories"
	| "nav.menu"
	| "site.description"
	| "home.latest"
	| "home.viewAll"
	| "home.empty"
	| "blog.empty"
	| "about.body"
	| "categories.title"
	| "categories.subtitle"
	| "categories.articleOne"
	| "categories.articleMany"
	| "categories.viewAll"
	| "contact.intro"
	| "contact.name"
	| "contact.namePlaceholder"
	| "contact.email"
	| "contact.emailPlaceholder"
	| "contact.subject"
	| "contact.subjectPlaceholder"
	| "contact.subjectGeneral"
	| "contact.subjectFeedback"
	| "contact.subjectSupport"
	| "contact.subjectCollaboration"
	| "contact.subjectOther"
	| "contact.message"
	| "contact.messageHint"
	| "contact.messagePlaceholder"
	| "contact.send"
	| "contact.sending"
	| "contact.otherWays"
	| "contact.emailLabel"
	| "contact.success"
	| "contact.error"
	| "contact.messageRequired"
	| "comments.title"
	| "comments.placeholder"
	| "comments.respond"
	| "comments.empty"
	| "comments.reply"
	| "comments.cancel"
	| "comments.replyingTo"
	| "comments.characters"
	| "comments.draftSaved"
	| "comments.draftRestored"
	| "comments.errorLoad"
	| "comments.errorPost"
	| "comments.errorEmpty"
	| "post.minRead"
	| "post.updated"
	| "post.share"
	| "post.copyLink"
	| "post.copied"
	| "post.authorBio"
	| "cookie.title"
	| "cookie.description"
	| "cookie.privacy"
	| "cookie.cookies"
	| "cookie.terms"
	| "cookie.decline"
	| "cookie.settings"
	| "cookie.accept"
	| "cookie.close"
	| "footer.rights"
	| "footer.description"
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
	| "search.countMany"
	| "notFound.title"
	| "notFound.description"
	| "notFound.home"
	| "notFound.blog";

const en: Record<UiKey, string> = {
	"nav.home": "Home",
	"nav.blog": "Blog",
	"nav.about": "About",
	"nav.contact": "Contact",
	"nav.policies": "Policies",
	"nav.categories": "Categories",
	"nav.menu": "Menu",
	"site.description": "Thoughts, stories and ideas from Libertta.",
	"home.latest": "Latest posts",
	"home.viewAll": "View all posts →",
	"home.empty": "No posts published yet.",
	"blog.empty": "No posts yet. Check back soon.",
	"about.body":
		"Libertta publishes stories, ideas, and research-minded writing. This site shares posts from our editorial backend and is available in multiple languages for navigation and interface copy.",
	"categories.title": "Categories",
	"categories.subtitle": "Explore articles by topic",
	"categories.articleOne": "article",
	"categories.articleMany": "articles",
	"categories.viewAll": "View all {count} articles →",
	"contact.intro":
		"Have a question, suggestion, or just want to say hello? We'd love to hear from you. Fill out the form below or reach out through any of our contact channels.",
	"contact.name": "Name *",
	"contact.namePlaceholder": "Your full name",
	"contact.email": "Email *",
	"contact.emailPlaceholder": "your.email@example.com",
	"contact.subject": "Subject *",
	"contact.subjectPlaceholder": "Select a subject",
	"contact.subjectGeneral": "General Inquiry",
	"contact.subjectFeedback": "Feedback",
	"contact.subjectSupport": "Technical Support",
	"contact.subjectCollaboration": "Collaboration",
	"contact.subjectOther": "Other",
	"contact.message": "Message *",
	"contact.messageHint": "Please be as detailed as possible",
	"contact.messagePlaceholder": "Tell us what's on your mind… Use the toolbar to format your message.",
	"contact.send": "Send Message",
	"contact.sending": "Sending…",
	"contact.otherWays": "Other Ways to Reach Us",
	"contact.emailLabel": "Email",
	"contact.success": "✓ Thank you for your message! We'll get back to you soon.",
	"contact.error": "✗ Something went wrong. Please try again or contact us directly via email.",
	"contact.messageRequired": "✗ Please enter a message.",
	"comments.title": "Responses",
	"comments.placeholder": "What are your thoughts?",
	"comments.respond": "Respond",
	"comments.empty": "No responses yet. Be the first to share your thoughts.",
	"comments.reply": "Reply",
	"comments.cancel": "Cancel",
	"comments.replyingTo": "Replying to:",
	"comments.characters": "characters",
	"comments.draftSaved": "Draft saved",
	"comments.draftRestored": "Draft restored",
	"comments.errorLoad": "Could not load comments.",
	"comments.errorPost": "Could not post your comment.",
	"comments.errorEmpty": "Please enter a comment.",
	"post.minRead": "min read",
	"post.updated": "Last updated on",
	"post.share": "Share this article",
	"post.copyLink": "Copy Link",
	"post.copied": "Copied!",
	"post.authorBio": "Writer, developer, and content creator sharing insights on technology and design.",
	"cookie.title": "We use cookies and other technologies.",
	"cookie.description":
		"This website uses cookies, web beacons, JavaScript and similar technologies. We accept that companies and third parties may create user profiles for personalization, market research and advertising. While information may be shared with third parties, it cannot be combined with personal data. You can find detailed information on this subject and how to withdraw your consent in the site's privacy policy.",
	"cookie.privacy": "Privacy Policy",
	"cookie.cookies": "Cookie Policy",
	"cookie.terms": "Terms & Conditions",
	"cookie.decline": "DECLINE",
	"cookie.settings": "SETTINGS",
	"cookie.accept": "OK",
	"cookie.close": "Close",
	"footer.rights": "All rights reserved.",
	"footer.description": "Sharing insights, stories, and ideas on technology, design, and innovation.",
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
	"notFound.title": "Page not found",
	"notFound.description": "The page you are looking for does not exist or may have been moved.",
	"notFound.home": "Back to home",
	"notFound.blog": "Browse articles",
};

const fr: Record<UiKey, string> = {
	...en,
	"nav.home": "Accueil",
	"nav.blog": "Blog",
	"nav.about": "À propos",
	"nav.contact": "Contact",
	"nav.policies": "Politiques",
	"nav.categories": "Catégories",
	"nav.menu": "Menu",
	"site.description": "Pensées, histoires et idées de Libertta.",
	"home.latest": "Derniers articles",
	"home.viewAll": "Voir tous les articles →",
	"home.empty": "Aucun article publié pour le moment.",
	"blog.empty": "Aucun article pour le moment. Revenez bientôt.",
	"about.body":
		"Libertta publie des histoires, des idées et des écrits de recherche. Ce site partage les articles de notre backend éditorial et est disponible en plusieurs langues pour la navigation et l’interface.",
	"categories.title": "Catégories",
	"categories.subtitle": "Explorez les articles par thème",
	"categories.articleOne": "article",
	"categories.articleMany": "articles",
	"categories.viewAll": "Voir les {count} articles →",
	"contact.intro":
		"Une question, une suggestion, ou simplement un bonjour ? Nous serions ravis de vous lire. Remplissez le formulaire ci-dessous ou contactez-nous via l’un de nos canaux.",
	"contact.name": "Nom *",
	"contact.namePlaceholder": "Votre nom complet",
	"contact.email": "E-mail *",
	"contact.emailPlaceholder": "votre.email@exemple.com",
	"contact.subject": "Sujet *",
	"contact.subjectPlaceholder": "Choisir un sujet",
	"contact.subjectGeneral": "Demande générale",
	"contact.subjectFeedback": "Retour",
	"contact.subjectSupport": "Support technique",
	"contact.subjectCollaboration": "Collaboration",
	"contact.subjectOther": "Autre",
	"contact.message": "Message *",
	"contact.messageHint": "Soyez aussi précis que possible",
	"contact.messagePlaceholder": "Dites-nous ce que vous avez en tête… Utilisez la barre d’outils pour formater votre message.",
	"contact.send": "Envoyer le message",
	"contact.sending": "Envoi…",
	"contact.otherWays": "Autres moyens de nous joindre",
	"contact.emailLabel": "E-mail",
	"contact.success": "✓ Merci pour votre message ! Nous vous répondrons bientôt.",
	"contact.error": "✗ Une erreur s’est produite. Réessayez ou contactez-nous directement par e-mail.",
	"contact.messageRequired": "✗ Veuillez saisir un message.",
	"comments.title": "Réponses",
	"comments.placeholder": "Quelles sont vos pensées ?",
	"comments.respond": "Répondre",
	"comments.empty": "Aucune réponse pour le moment. Soyez le premier à partager.",
	"comments.reply": "Répondre",
	"comments.cancel": "Annuler",
	"comments.replyingTo": "Réponse à :",
	"comments.characters": "caractères",
	"comments.draftSaved": "Brouillon enregistré",
	"comments.draftRestored": "Brouillon restauré",
	"comments.errorLoad": "Impossible de charger les commentaires.",
	"comments.errorPost": "Impossible de publier votre commentaire.",
	"comments.errorEmpty": "Veuillez saisir un commentaire.",
	"post.minRead": "min de lecture",
	"post.updated": "Dernière mise à jour le",
	"post.share": "Partager cet article",
	"post.copyLink": "Copier le lien",
	"post.copied": "Copié !",
	"post.authorBio": "Rédacteur, développeur et créateur de contenu partageant des idées sur la technologie et le design.",
	"cookie.title": "Nous utilisons des cookies et d’autres technologies.",
	"cookie.description":
		"Ce site utilise des cookies, balises web, JavaScript et technologies similaires. Nous acceptons que des entreprises et des tiers puissent créer des profils utilisateurs à des fins de personnalisation, d’études de marché et de publicité. Les informations partagées avec des tiers ne peuvent pas être combinées avec des données personnelles. Vous trouverez plus de détails et la façon de retirer votre consentement dans la politique de confidentialité.",
	"cookie.privacy": "Politique de confidentialité",
	"cookie.cookies": "Politique relative aux cookies",
	"cookie.terms": "Conditions générales",
	"cookie.decline": "REFUSER",
	"cookie.settings": "PARAMÈTRES",
	"cookie.accept": "OK",
	"cookie.close": "Fermer",
	"footer.rights": "Tous droits réservés.",
	"footer.description": "Partage d’idées, d’histoires et de réflexions sur la technologie, le design et l’innovation.",
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
	"notFound.title": "Page introuvable",
	"notFound.description": "La page que vous recherchez n’existe pas ou a été déplacée.",
	"notFound.home": "Retour à l’accueil",
	"notFound.blog": "Voir les articles",
};

const ar: Record<UiKey, string> = {
	...en,
	"nav.home": "الرئيسية",
	"nav.blog": "المدونة",
	"nav.about": "حول",
	"nav.contact": "اتصل",
	"nav.policies": "السياسات",
	"nav.categories": "الفئات",
	"nav.menu": "القائمة",
	"site.description": "أفكار وقصص ورؤى من ليبرتّا.",
	"home.latest": "أحدث المقالات",
	"home.viewAll": "عرض كل المقالات ←",
	"home.empty": "لا توجد مقالات منشورة بعد.",
	"blog.empty": "لا توجد مقالات بعد. عد قريبًا.",
	"about.body":
		"تنشر ليبرتّا قصصًا وأفكارًا وكتابات بحثية. يشارك هذا الموقع مقالات من نظامنا التحريري، وهو متاح بعدة لغات للتنقل وواجهة المستخدم.",
	"categories.title": "الفئات",
	"categories.subtitle": "استكشف المقالات حسب الموضوع",
	"categories.articleOne": "مقال",
	"categories.articleMany": "مقالات",
	"categories.viewAll": "عرض جميع المقالات ({count}) ←",
	"contact.intro":
		"هل لديك سؤال أو اقتراح أو تريد فقط إلقاء التحية؟ يسعدنا سماعك. املأ النموذج أدناه أو تواصل معنا عبر أي من قنوات الاتصال.",
	"contact.name": "الاسم *",
	"contact.namePlaceholder": "اسمك الكامل",
	"contact.email": "البريد الإلكتروني *",
	"contact.emailPlaceholder": "your.email@example.com",
	"contact.subject": "الموضوع *",
	"contact.subjectPlaceholder": "اختر موضوعًا",
	"contact.subjectGeneral": "استفسار عام",
	"contact.subjectFeedback": "ملاحظات",
	"contact.subjectSupport": "دعم فني",
	"contact.subjectCollaboration": "تعاون",
	"contact.subjectOther": "أخرى",
	"contact.message": "الرسالة *",
	"contact.messageHint": "يرجى تقديم أكبر قدر ممكن من التفاصيل",
	"contact.messagePlaceholder": "أخبرنا بما يدور في ذهنك… استخدم شريط الأدوات لتنسيق رسالتك.",
	"contact.send": "إرسال الرسالة",
	"contact.sending": "جارٍ الإرسال…",
	"contact.otherWays": "طرق أخرى للتواصل معنا",
	"contact.emailLabel": "البريد الإلكتروني",
	"contact.success": "✓ شكرًا لرسالتك! سنعود إليك قريبًا.",
	"contact.error": "✗ حدث خطأ ما. حاول مرة أخرى أو تواصل معنا مباشرة عبر البريد الإلكتروني.",
	"contact.messageRequired": "✗ يرجى إدخال رسالة.",
	"comments.title": "الردود",
	"comments.placeholder": "ما رأيك؟",
	"comments.respond": "رد",
	"comments.empty": "لا توجد ردود بعد. كن أول من يشارك.",
	"comments.reply": "رد",
	"comments.cancel": "إلغاء",
	"comments.replyingTo": "الرد على:",
	"comments.characters": "حرفًا",
	"comments.draftSaved": "تم حفظ المسودة",
	"comments.draftRestored": "تمت استعادة المسودة",
	"comments.errorLoad": "تعذر تحميل التعليقات.",
	"comments.errorPost": "تعذر نشر تعليقك.",
	"comments.errorEmpty": "يرجى إدخال تعليق.",
	"post.minRead": "دقيقة قراءة",
	"post.updated": "آخر تحديث في",
	"post.share": "شارك هذا المقال",
	"post.copyLink": "نسخ الرابط",
	"post.copied": "تم النسخ!",
	"post.authorBio": "كاتب ومطوّر ومنشئ محتوى يشارك رؤى حول التقنية والتصميم.",
	"cookie.title": "نستخدم ملفات تعريف الارتباط وتقنيات أخرى.",
	"cookie.description":
		"يستخدم هذا الموقع ملفات تعريف الارتباط وإشارات الويب وجافا سكريبت وتقنيات مماثلة. نقبل أن تقوم الشركات والأطراف الثالثة بإنشاء ملفات تعريف للمستخدمين لأغراض التخصيص وأبحاث السوق والإعلان. قد تُشارك المعلومات مع أطراف ثالثة دون دمجها مع بيانات شخصية. يمكنك الاطلاع على التفاصيل وكيفية سحب موافقتك في سياسة الخصوصية.",
	"cookie.privacy": "سياسة الخصوصية",
	"cookie.cookies": "سياسة ملفات تعريف الارتباط",
	"cookie.terms": "الشروط والأحكام",
	"cookie.decline": "رفض",
	"cookie.settings": "الإعدادات",
	"cookie.accept": "موافق",
	"cookie.close": "إغلاق",
	"footer.rights": "جميع الحقوق محفوظة.",
	"footer.description": "نشارك رؤى وقصصًا وأفكارًا حول التقنية والتصميم والابتكار.",
	"toc.label": "جدول المحتويات",
	"lang.switch": "تغيير اللغة",
	"search.title": "البحث في المقالات",
	"search.description": "ابحث في مقالات مدونة ليبرتّين",
	"search.button": "بحث",
	"search.placeholder": "ابحث في المقالات…",
	"search.close": "إغلاق البحث",
	"search.hint": "أدخل مصطلح بحث باستخدام أيقونة البحث في الرأس.",
	"search.noResults": "لا توجد مقالات مطابقة لبحثك.",
	"search.resultsFor": "نتائج البحث عن",
	"search.countOne": "تم العثور على مقال واحد",
	"search.countMany": "مقالات تم العثور عليها",
	"notFound.title": "الصفحة غير موجودة",
	"notFound.description": "الصفحة التي تبحث عنها غير موجودة أو ربما تم نقلها.",
	"notFound.home": "العودة إلى الرئيسية",
	"notFound.blog": "تصفح المقالات",
};

const es: Record<UiKey, string> = {
	...en,
	"nav.home": "Inicio",
	"nav.blog": "Blog",
	"nav.about": "Acerca de",
	"nav.contact": "Contacto",
	"nav.policies": "Políticas",
	"nav.categories": "Categorías",
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
	"nav.contact": "Kontakt",
	"nav.policies": "Richtlinien",
	"nav.categories": "Kategorien",
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
	"nav.contact": "Contato",
	"nav.policies": "Políticas",
	"nav.categories": "Categorias",
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
	ar,
	ru: {
		...en,
		"nav.home": "Главная",
		"nav.blog": "Блог",
		"nav.about": "О нас",
		"nav.contact": "Контакт",
		"nav.policies": "Политика",
		"nav.categories": "Категории",
		"lang.switch": "Сменить язык",
		"toc.label": "Содержание",
		"comments.title": "Ответы",
		"home.latest": "Последние записи",
		"home.viewAll": "Все записи →",
		"footer.rights": "Все права защищены.",
	},
	zh: {
		...en,
		"nav.home": "首页",
		"nav.blog": "博客",
		"nav.about": "关于",
		"nav.contact": "联系",
		"nav.policies": "政策",
		"nav.categories": "分类",
		"lang.switch": "切换语言",
		"toc.label": "目录",
		"comments.title": "回复",
		"home.latest": "最新文章",
		"home.viewAll": "查看全部 →",
		"footer.rights": "保留所有权利。",
	},
	ja: {
		...en,
		"nav.home": "ホーム",
		"nav.blog": "ブログ",
		"nav.about": "概要",
		"nav.contact": "お問い合わせ",
		"nav.policies": "ポリシー",
		"nav.categories": "カテゴリー",
		"lang.switch": "言語を切り替え",
		"toc.label": "目次",
		"comments.title": "返信",
		"home.latest": "最新の投稿",
		"home.viewAll": "すべての投稿 →",
		"footer.rights": "全著作権所有。",
	},
	hi: {
		...en,
		"nav.home": "होम",
		"nav.blog": "ब्लॉग",
		"nav.about": "परिचय",
		"nav.contact": "संपर्क",
		"nav.policies": "नीतियाँ",
		"nav.categories": "श्रेणियाँ",
		"lang.switch": "भाषा बदलें",
		"toc.label": "विषय सूची",
		"comments.title": "प्रतिक्रियाएँ",
		"home.latest": "नवीनतम पोस्ट",
		"home.viewAll": "सभी पोस्ट देखें →",
		"footer.rights": "सर्वाधिकार सुरक्षित।",
	},
};

export function t(locale: Locale | string | undefined, key: UiKey): string {
	const code = (locale && dictionaries[locale as Locale] ? locale : DEFAULT_LOCALE) as Locale;
	return dictionaries[code][key] ?? dictionaries[DEFAULT_LOCALE][key] ?? key;
}

export type { UiKey };

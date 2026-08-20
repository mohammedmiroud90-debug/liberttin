import type { Locale } from "./locales";
import { DEFAULT_LOCALE } from "./locales";

export type PolicyBlock =
	| { type: "p"; text: string }
	| { type: "h3"; text: string }
	| { type: "ul"; items: string[] }
	| { type: "highlight"; label: string; text: string }
	| { type: "box"; title: string; body: string; items?: string[] };

export type PolicySection = {
	id: string;
	title: string;
	blocks: PolicyBlock[];
};

export type PoliciesContent = {
	description: string;
	updated: string;
	navTitle: string;
	questionsTitle: string;
	questionsBody: string;
	contactLink: string;
	sections: PolicySection[];
};

const en: PoliciesContent = {
	description: "Libertta policies, terms, and guidelines",
	updated: "Last updated: August 20, 2026",
	navTitle: "Quick navigation",
	questionsTitle: "Questions or concerns?",
	questionsBody: "If you have any questions about these policies, please visit our {contact} or email us at",
	contactLink: "Contact page",
	sections: [
		{
			id: "comments",
			title: "Comments & replies policy",
			blocks: [
				{
					type: "p",
					text: "At Libertta, we believe in fostering meaningful conversations and diverse perspectives. Our comment system is designed to facilitate respectful dialogue while maintaining a safe and inclusive environment for all users.",
				},
				{ type: "h3", text: "General guidelines" },
				{
					type: "ul",
					items: [
						"Be respectful: Treat others with courtesy. Personal attacks, harassment, or bullying will not be tolerated.",
						"Stay on topic: Keep comments relevant to the article or discussion.",
						"No spam: Avoid repetitive content, ads, or promotional links without context.",
						"Use appropriate language: Profanity, hate speech, or discriminatory language is prohibited.",
						"Protect privacy: Do not share personal information about yourself or others.",
					],
				},
				{ type: "h3", text: "Prohibited content" },
				{ type: "p", text: "Comments containing the following will be removed:" },
				{
					type: "ul",
					items: [
						"Threats of violence or harm",
						"Hate speech or discriminatory remarks",
						"Harassment, bullying, or personal attacks",
						"Spam, advertising, or commercial promotion",
						"Misinformation or deliberately false information",
						"Illegal content or content promoting illegal activities",
						"Explicit sexual content or graphic violence",
					],
				},
				{
					type: "highlight",
					label: "Important:",
					text: "All comments are reviewed for compliance. We reserve the right to remove any comment that violates these guidelines without prior notice.",
				},
				{ type: "h3", text: "Reply guidelines" },
				{
					type: "ul",
					items: [
						"Address the argument, not the person",
						"Provide constructive feedback",
						"Use the reply feature to keep conversations threaded",
						"Acknowledge good points from others, even if you disagree",
					],
				},
				{ type: "h3", text: "Moderation & reporting" },
				{
					type: "p",
					text: "Our team may warn users, remove violating comments, or suspend accounts for repeated violations. Report issues to moderation@liberttin.blog.",
				},
			],
		},
		{
			id: "privacy",
			title: "Privacy policy",
			blocks: [
				{
					type: "p",
					text: "Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.",
				},
				{ type: "h3", text: "Information we collect" },
				{
					type: "ul",
					items: [
						"Content you provide: comments, replies, and contact form submissions",
						"Usage data: pages visited, time spent, and interactions",
						"Technical data: IP address, browser type, device information, and cookies",
					],
				},
				{ type: "h3", text: "How we use your information" },
				{
					type: "ul",
					items: [
						"To display comments and facilitate discussions",
						"To improve our website and user experience",
						"To respond to your inquiries",
						"To analyze site usage and prevent abuse",
					],
				},
				{ type: "h3", text: "Your rights" },
				{
					type: "ul",
					items: [
						"Access your personal data",
						"Request correction of inaccurate data",
						"Request deletion of your data",
						"Lodge a complaint with a supervisory authority",
					],
				},
				{
					type: "box",
					title: "Privacy contact",
					body: "Email us at privacy@liberttin.blog",
				},
			],
		},
		{
			id: "terms",
			title: "Terms of service",
			blocks: [
				{
					type: "p",
					text: "By accessing and using Libertta, you agree to be bound by these Terms of Service and all applicable laws and regulations.",
				},
				{ type: "h3", text: "Acceptable use" },
				{ type: "p", text: "You agree not to:" },
				{
					type: "ul",
					items: [
						"Violate any applicable laws or regulations",
						"Infringe on the intellectual property rights of others",
						"Transmit harmful code or malware",
						"Attempt unauthorized access to our systems",
						"Scrape or collect data from our site without permission",
					],
				},
				{ type: "h3", text: "Disclaimer" },
				{
					type: "p",
					text: 'Our content is provided "as is" without warranties of any kind. We do not guarantee accuracy, completeness, or usefulness of information on the site.',
				},
			],
		},
		{
			id: "content",
			title: "Content guidelines",
			blocks: [
				{
					type: "p",
					text: "Our content aims to inform, educate, and inspire. We strive for accuracy, fairness, and respect in all publications.",
				},
				{ type: "h3", text: "Editorial standards" },
				{
					type: "ul",
					items: [
						"Accuracy: we fact-check and correct errors promptly",
						"Fairness: we present multiple perspectives on complex issues",
						"Transparency: we disclose conflicts of interest",
						"Attribution: we credit sources and respect intellectual property",
					],
				},
			],
		},
		{
			id: "copyright",
			title: "Copyright & DMCA",
			blocks: [
				{
					type: "p",
					text: "All content on Libertta, including articles, images, and designs, is protected by copyright law.",
				},
				{ type: "h3", text: "DMCA notices" },
				{
					type: "p",
					text: "If you believe your copyright has been infringed, send a DMCA notice to dmca@liberttin.blog with a description of the work, the URL of the allegedly infringing content, your contact details, and required legal statements.",
				},
			],
		},
		{
			id: "cookies",
			title: "Cookie policy",
			blocks: [
				{
					type: "p",
					text: "We use cookies and similar technologies to enhance browsing and analyze site traffic.",
				},
				{
					type: "box",
					title: "Essential cookies",
					body: "Required for the website to function. These cannot be disabled.",
				},
				{
					type: "box",
					title: "Analytics cookies",
					body: "Help us understand how visitors interact with the site using anonymous information.",
				},
				{
					type: "box",
					title: "Preference cookies",
					body: "Remember settings such as language selection.",
				},
				{
					type: "highlight",
					label: "Note:",
					text: "By continuing to use our website, you consent to our use of cookies as described in this policy.",
				},
			],
		},
	],
};

const fr: PoliciesContent = {
	description: "Politiques, conditions et directives de Libertta",
	updated: "Dernière mise à jour : 20 août 2026",
	navTitle: "Navigation rapide",
	questionsTitle: "Questions ou préoccupations ?",
	questionsBody: "Pour toute question sur ces politiques, visitez notre {contact} ou écrivez-nous à",
	contactLink: "page Contact",
	sections: [
		{
			id: "comments",
			title: "Politique des commentaires et réponses",
			blocks: [
				{
					type: "p",
					text: "Chez Libertta, nous favorisons des conversations utiles et des points de vue variés. Notre système de commentaires vise un dialogue respectueux dans un environnement sûr et inclusif.",
				},
				{ type: "h3", text: "Règles générales" },
				{
					type: "ul",
					items: [
						"Soyez respectueux : pas d’attaques personnelles, de harcèlement ou d’intimidation.",
						"Restez dans le sujet : commentez l’article ou la discussion.",
						"Pas de spam : évitez les contenus répétitifs ou publicitaires hors contexte.",
						"Langage approprié : propos haineux ou discriminatoires interdits.",
						"Protégez la vie privée : ne partagez pas d’informations personnelles.",
					],
				},
				{ type: "h3", text: "Contenus interdits" },
				{ type: "p", text: "Seront retirés les commentaires contenant :" },
				{
					type: "ul",
					items: [
						"Menaces de violence",
						"Discours haineux ou discriminatoires",
						"Harcèlement ou attaques personnelles",
						"Spam ou promotion commerciale",
						"Désinformation volontaire",
						"Contenu illégal",
						"Contenu sexuel explicite ou violence graphique",
					],
				},
				{
					type: "highlight",
					label: "Important :",
					text: "Les commentaires sont modérés. Nous pouvons retirer tout contenu non conforme sans préavis.",
				},
				{ type: "h3", text: "Réponses et signalement" },
				{
					type: "p",
					text: "Répondez aux arguments, pas aux personnes. Signalez les abus à moderation@liberttin.blog.",
				},
			],
		},
		{
			id: "privacy",
			title: "Politique de confidentialité",
			blocks: [
				{
					type: "p",
					text: "Votre vie privée compte. Cette politique explique comment nous collectons, utilisons et protégeons vos données.",
				},
				{ type: "h3", text: "Données collectées" },
				{
					type: "ul",
					items: [
						"Contenu fourni : commentaires et formulaires de contact",
						"Données d’usage : pages visitées et interactions",
						"Données techniques : adresse IP, navigateur, appareil et cookies",
					],
				},
				{ type: "h3", text: "Vos droits" },
				{
					type: "ul",
					items: [
						"Accéder à vos données",
						"Demander une correction",
						"Demander une suppression",
						"Déposer une plainte auprès d’une autorité",
					],
				},
				{
					type: "box",
					title: "Contact confidentialité",
					body: "Écrivez à privacy@liberttin.blog",
				},
			],
		},
		{
			id: "terms",
			title: "Conditions d’utilisation",
			blocks: [
				{
					type: "p",
					text: "En utilisant Libertta, vous acceptez ces conditions et les lois applicables.",
				},
				{ type: "h3", text: "Usage acceptable" },
				{
					type: "ul",
					items: [
						"Ne pas violer la loi",
						"Respecter la propriété intellectuelle",
						"Ne pas transmettre de logiciels malveillants",
						"Ne pas tenter d’accès non autorisé",
						"Ne pas collecter de données sans permission",
					],
				},
				{
					type: "p",
					text: "Le contenu est fourni « en l’état », sans garantie d’exactitude ou d’exhaustivité.",
				},
			],
		},
		{
			id: "content",
			title: "Directives éditoriales",
			blocks: [
				{
					type: "p",
					text: "Notre contenu vise à informer, éduquer et inspirer, avec exactitude, équité et respect.",
				},
				{
					type: "ul",
					items: [
						"Exactitude : vérification et corrections rapides",
						"Équité : plusieurs perspectives sur les sujets complexes",
						"Transparence : divulgation des conflits d’intérêts",
						"Attribution : respect des sources et du droit d’auteur",
					],
				},
			],
		},
		{
			id: "copyright",
			title: "Droit d’auteur et DMCA",
			blocks: [
				{
					type: "p",
					text: "Tout le contenu de Libertta est protégé par le droit d’auteur. Pour un avis DMCA, contactez dmca@liberttin.blog.",
				},
			],
		},
		{
			id: "cookies",
			title: "Politique relative aux cookies",
			blocks: [
				{
					type: "p",
					text: "Nous utilisons des cookies pour améliorer la navigation et analyser le trafic.",
				},
				{
					type: "box",
					title: "Cookies essentiels",
					body: "Nécessaires au fonctionnement du site.",
				},
				{
					type: "box",
					title: "Cookies analytiques",
					body: "Aident à comprendre l’usage du site de façon anonyme.",
				},
				{
					type: "box",
					title: "Cookies de préférence",
					body: "Mémorisent des réglages comme la langue.",
				},
				{
					type: "highlight",
					label: "Note :",
					text: "En continuant à utiliser le site, vous acceptez cette politique de cookies.",
				},
			],
		},
	],
};

const ar: PoliciesContent = {
	description: "سياسات وشروط وإرشادات ليبرتّا",
	updated: "آخر تحديث: 20 أغسطس 2026",
	navTitle: "تنقّل سريع",
	questionsTitle: "أسئلة أو ملاحظات؟",
	questionsBody: "إذا كان لديك أي سؤال حول هذه السياسات، يرجى زيارة {contact} أو مراسلتنا على",
	contactLink: "صفحة الاتصال",
	sections: [
		{
			id: "comments",
			title: "سياسة التعليقات والردود",
			blocks: [
				{
					type: "p",
					text: "في ليبرتّا نؤمن بحوار هادف ووجهات نظر متنوعة. صُمم نظام التعليقات لتشجيع نقاش محترم في بيئة آمنة وشاملة للجميع.",
				},
				{ type: "h3", text: "إرشادات عامة" },
				{
					type: "ul",
					items: [
						"كن محترمًا: لا هجمات شخصية ولا مضايقة.",
						"التزم بالموضوع: اجعل التعليق ذا صلة بالمقال أو النقاش.",
						"لا رسائل مزعجة: تجنّب التكرار والإعلانات بلا سياق.",
						"لغة لائقة: يُحظر خطاب الكراهية والتمييز.",
						"احمِ الخصوصية: لا تشارك معلومات شخصية عنك أو عن الآخرين.",
					],
				},
				{ type: "h3", text: "محتوى محظور" },
				{ type: "p", text: "ستُزال التعليقات التي تتضمن:" },
				{
					type: "ul",
					items: [
						"تهديدات بالعنف أو الأذى",
						"خطاب كراهية أو تمييز",
						"مضايقة أو هجمات شخصية",
						"رسائل مزعجة أو ترويجًا تجاريًا",
						"معلومات مضللة عمدًا",
						"محتوى غير قانوني",
						"محتوى جنسي صريح أو عنفًا مصورًا",
					],
				},
				{
					type: "highlight",
					label: "مهم:",
					text: "تُراجع التعليقات وفق سياساتنا، ويحق لنا إزالة أي تعليق مخالف دون إشعار مسبق.",
				},
				{ type: "h3", text: "الردود والإبلاغ" },
				{
					type: "p",
					text: "ناقش الفكرة لا الشخص. للإبلاغ عن مخالفات راسل moderation@liberttin.blog.",
				},
			],
		},
		{
			id: "privacy",
			title: "سياسة الخصوصية",
			blocks: [
				{
					type: "p",
					text: "خصوصيتك مهمة لنا. توضح هذه السياسة كيف نجمع معلوماتك الشخصية ونستخدمها ونحميها.",
				},
				{ type: "h3", text: "المعلومات التي نجمعها" },
				{
					type: "ul",
					items: [
						"المحتوى الذي تقدمه: تعليقات ونماذج اتصال",
						"بيانات الاستخدام: الصفحات والوقت والتفاعلات",
						"بيانات تقنية: عنوان IP ونوع المتصفح والجهاز وملفات تعريف الارتباط",
					],
				},
				{ type: "h3", text: "حقوقك" },
				{
					type: "ul",
					items: [
						"الوصول إلى بياناتك الشخصية",
						"طلب تصحيح بيانات غير دقيقة",
						"طلب حذف بياناتك",
						"تقديم شكوى إلى جهة رقابية مختصة",
					],
				},
				{
					type: "box",
					title: "جهة اتصال الخصوصية",
					body: "راسلنا على privacy@liberttin.blog",
				},
			],
		},
		{
			id: "terms",
			title: "شروط الاستخدام",
			blocks: [
				{
					type: "p",
					text: "باستخدامك ليبرتّا فإنك توافق على هذه الشروط والقوانين المعمول بها.",
				},
				{ type: "h3", text: "الاستخدام المقبول" },
				{
					type: "ul",
					items: [
						"عدم انتهاك القوانين",
						"احترام حقوق الملكية الفكرية",
						"عدم إرسال برمجيات ضارة",
						"عدم محاولة الوصول غير المصرح به",
						"عدم جمع بيانات الموقع دون إذن",
					],
				},
				{
					type: "p",
					text: "يُقدَّم المحتوى «كما هو» دون ضمانات بشأن الدقة أو الاكتمال.",
				},
			],
		},
		{
			id: "content",
			title: "إرشادات المحتوى",
			blocks: [
				{
					type: "p",
					text: "نهدف إلى الإعلام والتعليم والإلهام، مع الالتزام بالدقة والإنصاف والاحترام.",
				},
				{
					type: "ul",
					items: [
						"الدقة: نتحقق من الحقائق ونصحح الأخطاء بسرعة",
						"الإنصاف: نعرض وجهات نظر متعددة",
						"الشفافية: نفصح عن تضارب المصالح",
						"الإسناد: نحترم المصادر وحقوق النشر",
					],
				},
			],
		},
		{
			id: "copyright",
			title: "حقوق النشر وDMCA",
			blocks: [
				{
					type: "p",
					text: "جميع محتويات ليبرتّا محمية بموجب قانون حقوق النشر. لإشعار DMCA راسل dmca@liberttin.blog.",
				},
			],
		},
		{
			id: "cookies",
			title: "سياسة ملفات تعريف الارتباط",
			blocks: [
				{
					type: "p",
					text: "نستخدم ملفات تعريف الارتباط لتحسين التصفح وتحليل الزيارات.",
				},
				{
					type: "box",
					title: "ملفات أساسية",
					body: "ضرورية لعمل الموقع ولا يمكن تعطيلها.",
				},
				{
					type: "box",
					title: "ملفات تحليلية",
					body: "تساعدنا على فهم تفاعل الزوار بشكل مجهول.",
				},
				{
					type: "box",
					title: "ملفات تفضيلات",
					body: "تحفظ إعداداتك مثل اختيار اللغة.",
				},
				{
					type: "highlight",
					label: "ملاحظة:",
					text: "باستمرارك في استخدام الموقع فإنك توافق على استخدام ملفات تعريف الارتباط كما هو موضح هنا.",
				},
			],
		},
	],
};

const byLocale: Partial<Record<Locale, PoliciesContent>> = { en, fr, ar };

export function getPoliciesContent(locale: Locale | string | undefined): PoliciesContent {
	const code = (locale && byLocale[locale as Locale] ? locale : DEFAULT_LOCALE) as Locale;
	return byLocale[code] ?? en;
}

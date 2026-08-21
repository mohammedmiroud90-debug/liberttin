import type { ImgHTMLAttributes } from "react";

type NextImageProps = ImgHTMLAttributes<HTMLImageElement> & {
	src: string | { src: string };
	priority?: boolean;
	fill?: boolean;
	sizes?: string;
	quality?: number;
	placeholder?: string;
	blurDataURL?: string;
	unoptimized?: boolean;
};

/** Minimal next/image stand-in for Astro + React admin islands. */
export default function Image({
	src,
	alt = "",
	width,
	height,
	className,
	style,
	fill,
	priority: _priority,
	sizes: _sizes,
	quality: _quality,
	placeholder: _placeholder,
	blurDataURL: _blur,
	unoptimized: _unoptimized,
	...rest
}: NextImageProps) {
	const resolved = typeof src === "string" ? src : src?.src;
	return (
		<img
			src={resolved}
			alt={alt}
			width={fill ? undefined : width}
			height={fill ? undefined : height}
			className={className}
			style={fill ? { ...style, objectFit: "cover", width: "100%", height: "100%" } : style}
			{...rest}
		/>
	);
}

export const determineImageSize = (height?: number, width?: number): string => {
	const validSizes = [
		"256x256",
		"512x512",
		"1024x1024",
		"1792x1024",
		"1024x1792",
	] as const;
	const defaultSize = "1024x1024";
	const requestedSize = `${height || 256}x${width || 256}`;
	return validSizes.includes(requestedSize as (typeof validSizes)[number])
		? requestedSize
		: defaultSize;
};

export type ImageSize =
	| "256x256"
	| "512x512"
	| "1024x1024"
	| "1792x1024"
	| "1024x1792";

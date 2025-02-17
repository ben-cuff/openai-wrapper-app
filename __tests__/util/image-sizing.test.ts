import { determineImageSize } from "../../src/util/image-sizing";

describe("determineImageSize", () => {
	it("should return default size when no parameters are provided", () => {
		expect(determineImageSize()).toBe("1024x1024");
	});

	it("should return valid size when correct dimensions are provided", () => {
		expect(determineImageSize(256, 256)).toBe("256x256");
		expect(determineImageSize(512, 512)).toBe("512x512");
		expect(determineImageSize(1024, 1024)).toBe("1024x1024");
		expect(determineImageSize(1792, 1024)).toBe("1792x1024");
		expect(determineImageSize(1024, 1792)).toBe("1024x1792");
	});

	it("should return default size when invalid dimensions are provided", () => {
		expect(determineImageSize(100, 100)).toBe("1024x1024");
		expect(determineImageSize(2000, 2000)).toBe("1024x1024");
		expect(determineImageSize(256, 512)).toBe("1024x1024");
	});

	it("should return default size when one dimension is undefined", () => {
		expect(determineImageSize(256, undefined)).toBe("1024x1024");
		expect(determineImageSize(undefined, 256)).toBe("1024x1024");
	});

	it("should return default size when dimensions are negative", () => {
		expect(determineImageSize(-256, -256)).toBe("1024x1024");
	});
});

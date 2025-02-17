import { reloadSession } from "../../src/util/reload-session";

describe("reloadSession", () => {
	let dispatchEventSpy: jest.SpyInstance;

	beforeEach(() => {
		dispatchEventSpy = jest.spyOn(document, "dispatchEvent");
	});

	afterEach(() => {
		dispatchEventSpy.mockRestore();
	});

	it("should dispatch a visibilitychange event", () => {
		reloadSession();

		expect(dispatchEventSpy).toHaveBeenCalledTimes(1);
		expect(dispatchEventSpy).toHaveBeenCalledWith(
			expect.objectContaining({
				type: "visibilitychange",
			})
		);
	});
});

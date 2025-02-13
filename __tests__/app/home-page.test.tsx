import HomePage from "@/app/page";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

describe("HomePage", () => {
	it("renders main heading", () => {
		render(<HomePage />);

		const heading = screen.getByRole("heading", {
			name: /Welcome to Not a ChatGPT Clone/i,
		});

		expect(heading).toBeInTheDocument();
	});

	it("renders CTA button", () => {
		render(<HomePage />);

		const buttons = screen.getAllByRole("button");
		expect(buttons).toHaveLength(3);
	});
});

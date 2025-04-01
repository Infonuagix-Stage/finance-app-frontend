import { render } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import { MemoryRouter } from "react-router-dom";
import App from "./App";

test("renders login page", () => {
  render(
    <MemoryRouter initialEntries={["/login"]}>
      <App />
    </MemoryRouter>
  );

  // Look for the Login page heading or button
  const loginHeading = screen.getByRole("heading", { name: /login/i });
  expect(loginHeading).toBeInTheDocument();
});

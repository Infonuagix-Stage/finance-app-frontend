import { render } from "@testing-library/react";
import { screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom"; // Use BrowserRouter or any other Router
import App from "./App";

test("renders login page", () => {
  render(
    <BrowserRouter> {/* Use BrowserRouter instead of MemoryRouter */}
      <App />
    </BrowserRouter>
  );

  // Look for the Login page heading or button
  const loginHeading = screen.getByRole("heading", { name: /login/i });
  expect(loginHeading).toBeInTheDocument();
});

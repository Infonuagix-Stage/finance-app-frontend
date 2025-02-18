import { render, screen } from "@testing-library/react";
import App from "./App";


test("renders login page", () => {
  render(<App />);
  // Replace the text below with something that is actually rendered by your App
  const loginElement = screen.getByText(/login/i);
  expect(loginElement).toBeInTheDocument();
});

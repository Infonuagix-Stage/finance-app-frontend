// jest-dom adds custom Jest matchers for asserting on DOM nodes.
// Allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// Learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
import ResizeObserver from "resize-observer-polyfill";

// Polyfill ResizeObserver for environments that don’t support it
if (typeof window !== "undefined" && !window.ResizeObserver) {
  window.ResizeObserver = ResizeObserver;
}

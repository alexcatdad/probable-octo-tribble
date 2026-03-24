import "@testing-library/jest-dom/vitest";

afterEach(() => {
  try {
    window.sessionStorage.clear();
  } catch {
    // Some tests deliberately replace storage with a throwing shim.
  }
});

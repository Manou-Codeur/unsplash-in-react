import React from "react";
import { render } from "@testing-library/react";
import App from "./App";

const sum = (a, b) => a + b;

describe("first test", () => {
  test("test one", () => {
    expect(true).toBe(true);
  });

  test("test two", () => {
    const result = sum(4, 2);
    expect(result).toBe(6);
  });
});

import { truncate } from "@/components/kanban/TaskCard";


describe("truncate", () => {
  it("returns text unchanged when shorter than the limit", () => {
    expect(truncate("hello", 10)).toBe("hello");
  });

  it("returns text unchanged when exactly at the limit", () => {
    expect(truncate("hello", 5)).toBe("hello");
  });

  it("cuts text to the limit and appends an ellipsis when over the limit", () => {
    expect(truncate("hello world", 5)).toBe("hello…");
  });

  it("trims trailing whitespace before the ellipsis", () => {
    expect(truncate("hello world", 6)).toBe("hello…");
  });

  it("handles an empty string", () => {
    expect(truncate("", 5)).toBe("");
  });
});
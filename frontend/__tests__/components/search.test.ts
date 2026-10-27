import { matchesSearch } from "@/components/kanban/Board";

const task = {
  title: "Research Project",
  description: "Gather requirements and create initial documentation",
};

describe("matchesSearch", () => {
  it("matches every task when the query is empty", () => {
    expect(matchesSearch(task, "")).toBe(true);
  });

  it("matches every task when the query is only whitespace", () => {
    expect(matchesSearch(task, "   ")).toBe(true);
  });

  it("matches on the title", () => {
    expect(matchesSearch(task, "research")).toBe(true);
  });

  it("matches on the description", () => {
    expect(matchesSearch(task, "documentation")).toBe(true);
  });

  it("ignores case", () => {
    expect(matchesSearch(task, "PROJECT")).toBe(true);
  });

  it("ignores leading and trailing whitespace in the query", () => {
    expect(matchesSearch(task, "  project  ")).toBe(true);
  });

  it("returns false when neither field contains the query", () => {
    expect(matchesSearch(task, "deploy")).toBe(false);
  });
});

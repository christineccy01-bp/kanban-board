import {
  API_URL,
  ApiError,
  createTask,
  deleteTask,
  getAccessToken,
  getTasks,
  TodoItemResponse,
  updateTask,
} from "../todoApi";

const row: TodoItemResponse = {
  todo_item_id: 3,
  title: "API Integration",
  description: "Implement REST endpoints",
  status: "P",
  created_at: "2026-10-20T09:30:00.000Z",
};

const mockFetch = (status: number, body?: unknown) => {
  const fetchMock = jest.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: async () => {
      if (body === undefined) throw new SyntaxError("Unexpected end of JSON");
      return body;
    },
  });
  global.fetch = fetchMock as unknown as typeof fetch;
  return fetchMock;
};

const AUTHORITY = "https://cognito-idp.ap-southeast-2.amazonaws.com/pool";
const CLIENT_ID = "client123";
const STORAGE_KEY = `oidc.user:${AUTHORITY}:${CLIENT_ID}`;

// Stores a user the same way oidc-client-ts does after sign-in
const signIn = (accessToken: string) =>
  sessionStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ access_token: accessToken, token_type: "Bearer", profile: {} }),
  );

beforeEach(() => {
  process.env.NEXT_PUBLIC_COGNITO_AUTHORITY = AUTHORITY;
  process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID = CLIENT_ID;
  sessionStorage.clear();
});

describe("todoApi", () => {
  describe("getTasks", () => {
    it("fetches all tasks and maps them to the frontend shape", async () => {
      const fetchMock = mockFetch(200, [row]);

      const tasks = await getTasks();

      expect(fetchMock).toHaveBeenCalledWith(`${API_URL}/todo_item`, {
        headers: {},
      });
      expect(tasks).toEqual([
        {
          id: "3",
          title: "API Integration",
          description: "Implement REST endpoints",
          status: "P",
          createdAt: Date.parse("2026-10-20T09:30:00.000Z"),
        },
      ]);
    });
  });

  describe("createTask", () => {
    it("POSTs the task as JSON and returns the created task", async () => {
      const fetchMock = mockFetch(201, row);
      const input = {
        title: "API Integration",
        description: "Implement REST endpoints",
        status: "P" as const,
      };

      const created = await createTask(input);

      expect(fetchMock).toHaveBeenCalledWith(`${API_URL}/todo_item`, {
        method: "POST",
        body: JSON.stringify(input),
        headers: { "Content-Type": "application/json" },
      });
      expect(created.id).toBe("3");
    });
  });

  describe("updateTask", () => {
    it("PUTs the changes to the task's URL and returns the updated task", async () => {
      const fetchMock = mockFetch(200, { ...row, status: "D" });
      const changes = {
        title: "API Integration",
        description: "Implement REST endpoints",
        status: "D" as const,
      };

      const updated = await updateTask("3", changes);

      expect(fetchMock).toHaveBeenCalledWith(`${API_URL}/todo_item/3`, {
        method: "PUT",
        body: JSON.stringify(changes),
        headers: { "Content-Type": "application/json" },
      });
      expect(updated.status).toBe("D");
    });
  });

  describe("deleteTask", () => {
    it("sends DELETE and handles the empty 204 response", async () => {
      const fetchMock = mockFetch(204);

      await expect(deleteTask("3")).resolves.toBeUndefined();

      expect(fetchMock).toHaveBeenCalledWith(`${API_URL}/todo_item/3`, {
        method: "DELETE",
        headers: {},
      });
    });
  });

  describe("errors", () => {
    it("throws an ApiError with the backend's message and status", async () => {
      mockFetch(400, { error: "Invalid status." });

      const error = await updateTask("3", { ...row, status: "P" }).catch(
        (e) => e,
      );

      expect(error).toBeInstanceOf(ApiError);
      expect(error.message).toBe("Invalid status.");
      expect(error.status).toBe(400);
    });

    it("falls back to a generic message when the error body isn't JSON", async () => {
      mockFetch(500);

      const error = await getTasks().catch((e) => e);

      expect(error).toBeInstanceOf(ApiError);
      expect(error.message).toBe("Request failed with status 500");
      expect(error.status).toBe(500);
    });

    it("returns 404 as an ApiError when deleting a missing task", async () => {
      mockFetch(404, { error: "Todo item not found." });

      await expect(deleteTask("99")).rejects.toMatchObject({
        message: "Todo item not found.",
        status: 404,
      });
    });
  });

  describe("authentication", () => {
    it("returns null when nobody is signed in", () => {
      expect(getAccessToken()).toBeNull();
    });

    it("reads the access token of the signed-in user", () => {
      signIn("abc.def.ghi");

      expect(getAccessToken()).toBe("abc.def.ghi");
    });

    it("sends the access token as a Bearer header", async () => {
      signIn("abc.def.ghi");
      const fetchMock = mockFetch(200, []);

      await getTasks();

      expect(fetchMock).toHaveBeenCalledWith(`${API_URL}/todo_item`, {
        headers: { Authorization: "Bearer abc.def.ghi" },
      });
    });

    it("sends both the token and the JSON content type with a body", async () => {
      signIn("abc.def.ghi");
      const fetchMock = mockFetch(201, row);

      await createTask({ title: "t", description: "d", status: "N" });

      expect(fetchMock).toHaveBeenCalledWith(
        `${API_URL}/todo_item`,
        expect.objectContaining({
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer abc.def.ghi",
          },
        }),
      );
    });

    it("surfaces a rejected token as a 401 ApiError", async () => {
      signIn("expired");
      mockFetch(401, { error: "Invalid or expired token" });

      await expect(getTasks()).rejects.toMatchObject({
        message: "Invalid or expired token",
        status: 401,
      });
    });
  });
});

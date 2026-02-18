import { describe, it, expect } from "vitest";
import {
  createPageSchema,
  createLinkSchema,
  emailCaptureSchema,
} from "../schemas";

describe("createPageSchema", () => {
  it("validates a correct page", () => {
    const result = createPageSchema.safeParse({
      slug: "my-page",
      title: "My Page",
      bio: "Welcome to my page",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid slug with uppercase", () => {
    const result = createPageSchema.safeParse({
      slug: "My-Page",
      title: "My Page",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid slug with spaces", () => {
    const result = createPageSchema.safeParse({
      slug: "my page",
      title: "My Page",
    });
    expect(result.success).toBe(false);
  });
});

describe("createLinkSchema", () => {
  it("validates a correct link", () => {
    const result = createLinkSchema.safeParse({
      url: "https://example.com",
      title: "My Link",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid URL", () => {
    const result = createLinkSchema.safeParse({
      url: "not-a-url",
      title: "Bad Link",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty title", () => {
    const result = createLinkSchema.safeParse({
      url: "https://example.com",
      title: "",
    });
    expect(result.success).toBe(false);
  });
});

describe("emailCaptureSchema", () => {
  it("validates a correct email capture", () => {
    const result = emailCaptureSchema.safeParse({
      email: "test@example.com",
      page_id: "123e4567-e89b-12d3-a456-426614174000",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = emailCaptureSchema.safeParse({
      email: "not-an-email",
      page_id: "123e4567-e89b-12d3-a456-426614174000",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid UUID", () => {
    const result = emailCaptureSchema.safeParse({
      email: "test@example.com",
      page_id: "not-a-uuid",
    });
    expect(result.success).toBe(false);
  });
});

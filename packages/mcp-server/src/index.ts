#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { PortaloClient } from "./api-client.js";

const baseUrl = process.env.PORTALO_BASE_URL || "https://portalo.so";
const apiKey = process.env.PORTALO_API_KEY;

if (!apiKey) {
  console.error("PORTALO_API_KEY environment variable is required");
  process.exit(1);
}

const client = new PortaloClient(baseUrl, apiKey);

const server = new McpServer({
  name: "portalo",
  version: "0.1.0",
});

// list_pages
server.tool("list_pages", "List all your Portalo pages", {}, async () => {
  const pages = await client.listPages();
  return { content: [{ type: "text", text: JSON.stringify(pages, null, 2) }] };
});

// get_page
server.tool(
  "get_page",
  "Get details of a specific page including its links",
  { page_id: z.string().uuid().describe("The page ID") },
  async ({ page_id }) => {
    const [page, links] = await Promise.all([
      client.getPage(page_id),
      client.listLinks(page_id),
    ]);
    return {
      content: [
        { type: "text", text: JSON.stringify({ ...page as object, links }, null, 2) },
      ],
    };
  }
);

// create_page
server.tool(
  "create_page",
  "Create a new Portalo page with a unique slug",
  {
    slug: z
      .string()
      .min(1)
      .max(64)
      .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, and hyphens only")
      .describe("URL slug for the page"),
    title: z.string().max(100).optional().describe("Page title"),
    bio: z.string().max(500).optional().describe("Page bio/description"),
    theme: z
      .enum(["clean", "minimal-dark", "editorial"])
      .optional()
      .describe("Theme name"),
  },
  async ({ slug, title, bio, theme }) => {
    const body: Record<string, unknown> = { slug };
    if (title !== undefined) body.title = title;
    if (bio !== undefined) body.bio = bio;
    if (theme !== undefined) body.theme = { name: theme };
    const page = await client.createPage(body);
    return { content: [{ type: "text", text: JSON.stringify(page, null, 2) }] };
  }
);

// delete_page
server.tool(
  "delete_page",
  "Permanently delete a page and all its links",
  { page_id: z.string().uuid().describe("The page ID to delete") },
  async ({ page_id }) => {
    await client.deletePage(page_id);
    return { content: [{ type: "text", text: "Page deleted successfully" }] };
  }
);

// add_link
server.tool(
  "add_link",
  "Add a new link to a page",
  {
    page_id: z.string().uuid().describe("The page ID"),
    url: z.string().url().describe("The link URL"),
    title: z.string().describe("The link title"),
    position: z.number().int().min(0).optional().describe("Position in the list"),
  },
  async ({ page_id, url, title, position }) => {
    const link = await client.addLink(page_id, { url, title, position });
    return { content: [{ type: "text", text: JSON.stringify(link, null, 2) }] };
  }
);

// update_link
server.tool(
  "update_link",
  "Update an existing link",
  {
    page_id: z.string().uuid().describe("The page ID"),
    link_id: z.string().uuid().describe("The link ID"),
    url: z.string().url().optional().describe("New URL"),
    title: z.string().optional().describe("New title"),
    visible: z.boolean().optional().describe("Whether the link is visible"),
  },
  async ({ page_id, link_id, ...updates }) => {
    const link = await client.updateLink(page_id, link_id, updates);
    return { content: [{ type: "text", text: JSON.stringify(link, null, 2) }] };
  }
);

// remove_link
server.tool(
  "remove_link",
  "Remove a link from a page",
  {
    page_id: z.string().uuid().describe("The page ID"),
    link_id: z.string().uuid().describe("The link ID"),
  },
  async ({ page_id, link_id }) => {
    await client.removeLink(page_id, link_id);
    return { content: [{ type: "text", text: "Link removed successfully" }] };
  }
);

// reorder_links
server.tool(
  "reorder_links",
  "Reorder links on a page by providing link IDs in the desired order",
  {
    page_id: z.string().uuid().describe("The page ID"),
    link_ids: z
      .array(z.string().uuid())
      .min(1)
      .describe("Link IDs in desired order"),
  },
  async ({ page_id, link_ids }) => {
    await client.reorderLinks(page_id, link_ids);
    return { content: [{ type: "text", text: "Links reordered successfully" }] };
  }
);

// get_analytics
server.tool(
  "get_analytics",
  "Get analytics overview for a page",
  {
    page_id: z.string().uuid().describe("The page ID"),
    period: z
      .enum(["7d", "30d", "90d"])
      .default("7d")
      .describe("Time period"),
  },
  async ({ page_id, period }) => {
    const analytics = await client.getAnalytics(page_id, period);
    return {
      content: [{ type: "text", text: JSON.stringify(analytics, null, 2) }],
    };
  }
);

// export_contacts
server.tool(
  "export_contacts",
  "Export email contacts collected from a page",
  { page_id: z.string().uuid().describe("The page ID") },
  async ({ page_id }) => {
    const contacts = await client.exportContacts(page_id);
    return {
      content: [{ type: "text", text: JSON.stringify(contacts, null, 2) }],
    };
  }
);

// update_page
server.tool(
  "update_page",
  "Update a page's slug, title, bio, theme, settings, or published status",
  {
    page_id: z.string().uuid().describe("The page ID"),
    slug: z
      .string()
      .min(1)
      .max(64)
      .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, and hyphens only")
      .optional()
      .describe("New URL slug"),
    title: z.string().max(100).optional().describe("New page title"),
    bio: z.string().max(500).optional().describe("New bio/description"),
    theme: z
      .enum(["clean", "minimal-dark", "editorial"])
      .optional()
      .describe("Theme name"),
    published: z.boolean().optional().describe("Whether the page is publicly visible"),
    show_email_capture: z.boolean().optional().describe("Show email capture widget"),
    show_powered_by: z.boolean().optional().describe("Show Powered by Portalo footer"),
  },
  async ({ page_id, slug, title, bio, theme, published, show_email_capture, show_powered_by }) => {
    const updates: Record<string, unknown> = {};
    if (slug !== undefined) updates.slug = slug;
    if (title !== undefined) updates.title = title;
    if (bio !== undefined) updates.bio = bio;
    if (theme !== undefined) updates.theme = { name: theme };
    if (published !== undefined) updates.published = published;
    const settings: Record<string, boolean> = {};
    if (show_email_capture !== undefined) settings.show_email_capture = show_email_capture;
    if (show_powered_by !== undefined) settings.show_powered_by = show_powered_by;
    if (Object.keys(settings).length > 0) updates.settings = settings;
    const page = await client.updatePage(page_id, updates);
    return { content: [{ type: "text", text: JSON.stringify(page, null, 2) }] };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});

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

// update_theme
server.tool(
  "update_theme",
  "Change the theme of a page",
  {
    page_id: z.string().uuid().describe("The page ID"),
    theme: z
      .enum(["clean", "minimal-dark", "editorial"])
      .describe("Theme name"),
  },
  async ({ page_id, theme }) => {
    const page = await client.updatePage(page_id, {
      theme: { name: theme },
    });
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

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
  version: "0.4.0",
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
  "Get analytics overview for a page including unique visitors, bounce rate, time-to-click, browser breakdown, hourly activity, and top links with velocity",
  {
    page_id: z.string().uuid().describe("The page ID"),
    period: z
      .enum(["7d", "30d", "90d"])
      .default("7d")
      .describe("Time period"),
    start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().describe("Custom start date (YYYY-MM-DD, Pro only)"),
    end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().describe("Custom end date (YYYY-MM-DD, Pro only)"),
  },
  async ({ page_id, period, start_date, end_date }) => {
    const [overview, breakdown, hourly, topLinks] = await Promise.all([
      client.getAnalytics(page_id, period, start_date, end_date),
      client.getAnalyticsBreakdown(page_id, period, start_date, end_date),
      client.getAnalyticsHourly(page_id, period, start_date, end_date),
      client.getAnalyticsTopLinks(page_id, period, start_date, end_date),
    ]);
    return {
      content: [{ type: "text", text: JSON.stringify({ overview, breakdown, hourly, top_links: topLinks }, null, 2) }],
    };
  }
);

// export_analytics
server.tool(
  "export_analytics",
  "Export analytics events as CSV (Pro only). Returns raw event data for a page.",
  {
    page_id: z.string().uuid().describe("The page ID"),
    period: z.enum(["7d", "30d", "90d"]).default("7d").describe("Time period"),
    start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().describe("Custom start date (YYYY-MM-DD)"),
    end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().describe("Custom end date (YYYY-MM-DD)"),
  },
  async ({ page_id, period, start_date, end_date }) => {
    const csv = await client.exportAnalytics(page_id, { period, start_date, end_date });
    return { content: [{ type: "text", text: csv }] };
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

// get_account
server.tool(
  "get_account",
  "Get your account profile and plan information",
  {},
  async () => {
    const account = await client.getAccount();
    return { content: [{ type: "text", text: JSON.stringify(account, null, 2) }] };
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

// list_domains
server.tool(
  "list_domains",
  "List all custom domains linked to your pages",
  {},
  async () => {
    const domains = await client.listDomains();
    return { content: [{ type: "text", text: JSON.stringify(domains, null, 2) }] };
  }
);

// add_domain
server.tool(
  "add_domain",
  "Add a custom domain to a page",
  {
    page_id: z.string().uuid().describe("The page to attach the domain to"),
    domain: z.string().min(1).max(253).describe("The custom domain (e.g. links.example.com)"),
  },
  async ({ page_id, domain }) => {
    const result = await client.addDomain({ page_id, domain });
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

// remove_domain
server.tool(
  "remove_domain",
  "Remove a custom domain",
  { domain_id: z.string().uuid().describe("The domain ID to remove") },
  async ({ domain_id }) => {
    await client.removeDomain(domain_id);
    return { content: [{ type: "text", text: "Domain removed successfully" }] };
  }
);

// update_design
server.tool(
  "update_design",
  "Update a page's theme and custom colors. Colors override the base theme.",
  {
    page_id: z.string().uuid().describe("The page ID"),
    theme: z.enum(["clean", "minimal-dark", "editorial"]).optional().describe("Base theme name"),
    bg: z.string().optional().describe("Background color (hex, e.g. #1a1a2e)"),
    text: z.string().optional().describe("Primary text color (hex)"),
    secondary: z.string().optional().describe("Secondary text color (hex)"),
    link_bg: z.string().optional().describe("Link background color (hex)"),
    link_text: z.string().optional().describe("Link text color (hex)"),
  },
  async ({ page_id, theme, bg, text, secondary, link_bg, link_text }) => {
    const updates: Record<string, unknown> = {};
    const themeObj: Record<string, unknown> = {};
    if (theme !== undefined) themeObj.name = theme;
    const colors: Record<string, string> = {};
    if (bg !== undefined) colors.bg = bg;
    if (text !== undefined) colors.text = text;
    if (secondary !== undefined) colors.secondary = secondary;
    if (link_bg !== undefined) colors.link_bg = link_bg;
    if (link_text !== undefined) colors.link_text = link_text;
    if (Object.keys(colors).length > 0) themeObj.colors = colors;
    if (Object.keys(themeObj).length > 0) updates.theme = themeObj;
    const page = await client.updatePage(page_id, updates);
    return { content: [{ type: "text", text: JSON.stringify(page, null, 2) }] };
  }
);

// set_layout
server.tool(
  "set_layout",
  "Set the section order and blocks for a page. Sections: header, icon-bar, links, block. Blocks: spacer, divider, text.",
  {
    page_id: z.string().uuid().describe("The page ID"),
    sections: z.array(z.object({
      type: z.enum(["header", "icon-bar", "links", "block"]).describe("Section type"),
      id: z.string().optional().describe("Block ID (only for block sections)"),
    })).min(1).describe("Ordered list of page sections"),
    blocks: z.array(z.object({
      id: z.string().describe("Unique block ID"),
      kind: z.enum(["spacer", "divider", "text"]).describe("Block type"),
      props: z.object({
        height: z.number().optional().describe("Height in px (spacer only, 8-96)"),
        text: z.string().optional().describe("Text content (text block only)"),
      }).optional().default({}),
    })).optional().default([]).describe("Block definitions"),
  },
  async ({ page_id, sections, blocks }) => {
    const layout = await client.setLayout(page_id, { sections, blocks });
    return { content: [{ type: "text", text: JSON.stringify(layout, null, 2) }] };
  }
);

// add_block
server.tool(
  "add_block",
  "Add a content block (spacer, divider, or text) to a page's layout",
  {
    page_id: z.string().uuid().describe("The page ID"),
    kind: z.enum(["spacer", "divider", "text"]).describe("Block type"),
    text: z.string().optional().describe("Text content (for text blocks)"),
    height: z.number().int().min(8).max(96).optional().describe("Height in px (for spacer blocks)"),
    after_section: z.number().int().min(0).optional().describe("Insert after this section index"),
  },
  async ({ page_id, kind, text, height, after_section }) => {
    const props: Record<string, unknown> = {};
    if (text !== undefined) props.text = text;
    if (height !== undefined) props.height = height;
    const block = await client.addBlock(page_id, { kind, props, after_section });
    return { content: [{ type: "text", text: JSON.stringify(block, null, 2) }] };
  }
);

// remove_block
server.tool(
  "remove_block",
  "Remove a content block from a page's layout",
  {
    page_id: z.string().uuid().describe("The page ID"),
    block_id: z.string().describe("The block ID to remove"),
  },
  async ({ page_id, block_id }) => {
    await client.removeBlock(page_id, block_id);
    return { content: [{ type: "text", text: "Block removed successfully" }] };
  }
);

// set_link_display
server.tool(
  "set_link_display",
  "Set a link's display mode and platform. Use icon-only for social icon bar, featured for highlighted links.",
  {
    page_id: z.string().uuid().describe("The page ID"),
    link_id: z.string().uuid().describe("The link ID"),
    display_mode: z.enum(["default", "featured", "icon-only"]).optional().describe("Display mode"),
    platform: z.enum([
      "youtube", "twitter", "instagram", "tiktok",
      "github", "linkedin", "facebook", "twitch",
      "discord", "spotify", "apple-music", "soundcloud",
      "pinterest", "snapchat", "reddit", "telegram",
      "whatsapp", "dribbble",
    ]).nullable().optional().describe("Platform override (null to clear)"),
  },
  async ({ page_id, link_id, display_mode, platform }) => {
    const updates: Record<string, unknown> = {};
    if (display_mode !== undefined) updates.display_mode = display_mode;
    if (platform !== undefined) updates.platform = platform;
    const link = await client.updateLink(page_id, link_id, updates);
    return { content: [{ type: "text", text: JSON.stringify(link, null, 2) }] };
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

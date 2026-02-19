export async function GET() {
  return Response.json({
    name: "Portalo",
    description: "Manage your link-in-bio page via AI",
    url: "https://portalo.so",
    mcp_server: {
      npm_package: "@portalo/mcp-server",
      transport: "stdio",
    },
    authentication: {
      type: "api_key",
      instructions:
        "Generate an API key at https://portalo.so/dashboard/settings/api and set PORTALO_API_KEY",
    },
    tools: [
      "list_pages",
      "get_page",
      "create_page",
      "update_page",
      "delete_page",
      "add_link",
      "update_link",
      "remove_link",
      "reorder_links",
      "get_analytics",
      "export_contacts",
      "get_account",
      "list_domains",
      "add_domain",
      "remove_domain",
      "update_design",
      "set_layout",
      "add_block",
      "remove_block",
      "set_link_display",
    ],
  });
}

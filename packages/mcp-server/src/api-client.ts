export class PortaloClient {
  private baseUrl: string;
  private apiKey: string;

  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
    this.apiKey = apiKey;
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown
  ): Promise<T> {
    const url = `${this.baseUrl}/api/v1${path}`;
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": this.apiKey,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(
        err.error?.message || `API error: ${res.status} ${res.statusText}`
      );
    }

    if (res.status === 204) return undefined as T;
    const json = await res.json();
    return json.data as T;
  }

  // Pages
  async listPages() {
    return this.request<unknown[]>("GET", "/pages");
  }

  async getPage(pageId: string) {
    return this.request<unknown>("GET", `/pages/${pageId}`);
  }

  async updatePage(pageId: string, updates: Record<string, unknown>) {
    return this.request<unknown>("PUT", `/pages/${pageId}`, updates);
  }

  // Links
  async listLinks(pageId: string) {
    return this.request<unknown[]>("GET", `/pages/${pageId}/links`);
  }

  async addLink(
    pageId: string,
    data: { url: string; title: string; position?: number }
  ) {
    return this.request<unknown>("POST", `/pages/${pageId}/links`, data);
  }

  async updateLink(
    pageId: string,
    linkId: string,
    data: Record<string, unknown>
  ) {
    return this.request<unknown>(
      "PUT",
      `/pages/${pageId}/links/${linkId}`,
      data
    );
  }

  async removeLink(pageId: string, linkId: string) {
    return this.request<void>(
      "DELETE",
      `/pages/${pageId}/links/${linkId}`
    );
  }

  async reorderLinks(pageId: string, linkIds: string[]) {
    return this.request<unknown>("PATCH", `/links/reorder`, {
      page_id: pageId,
      link_ids: linkIds,
    });
  }

  // Analytics
  async getAnalytics(
    pageId: string,
    period: "7d" | "30d" | "90d" = "7d"
  ) {
    return this.request<unknown>(
      "GET",
      `/analytics/overview?page_id=${pageId}&period=${period}`
    );
  }

  // Contacts
  async exportContacts(pageId: string) {
    return this.request<unknown[]>(
      "GET",
      `/contacts?page_id=${pageId}`
    );
  }
}

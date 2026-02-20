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

  async createPage(data: Record<string, unknown>) {
    return this.request<unknown>("POST", "/pages", data);
  }

  async updatePage(pageId: string, updates: Record<string, unknown>) {
    return this.request<unknown>("PUT", `/pages/${pageId}`, updates);
  }

  async deletePage(pageId: string) {
    return this.request<void>("DELETE", `/pages/${pageId}`);
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
    return this.request<unknown>(
      "PATCH",
      `/pages/${pageId}/links/reorder`,
      { link_ids: linkIds }
    );
  }

  // Layout
  async setLayout(pageId: string, layout: Record<string, unknown>) {
    return this.request<unknown>("PUT", `/pages/${pageId}/layout`, layout);
  }

  // Blocks
  async addBlock(pageId: string, data: Record<string, unknown>) {
    return this.request<unknown>("POST", `/pages/${pageId}/blocks`, data);
  }

  async removeBlock(pageId: string, blockId: string) {
    return this.request<void>("DELETE", `/pages/${pageId}/blocks`, { block_id: blockId });
  }

  // Account
  async getAccount() {
    return this.request<unknown>("GET", "/account");
  }

  // Domains
  async listDomains() {
    return this.request<unknown[]>("GET", "/domains");
  }

  async addDomain(data: { page_id: string; domain: string }) {
    return this.request<unknown>("POST", "/domains", data);
  }

  async removeDomain(domainId: string) {
    return this.request<void>("DELETE", `/domains/${domainId}`);
  }

  // Analytics
  private analyticsQuery(pageId: string, period: string, start?: string, end?: string) {
    const params = new URLSearchParams({ page_id: pageId, period });
    if (start) params.set("start_date", start);
    if (end) params.set("end_date", end);
    return params.toString();
  }

  async getAnalytics(pageId: string, period = "7d", startDate?: string, endDate?: string) {
    return this.request<unknown>("GET", `/analytics/overview?${this.analyticsQuery(pageId, period, startDate, endDate)}`);
  }

  async getAnalyticsBreakdown(pageId: string, period = "7d", startDate?: string, endDate?: string) {
    return this.request<unknown>("GET", `/analytics/breakdown?${this.analyticsQuery(pageId, period, startDate, endDate)}`);
  }

  async getAnalyticsHourly(pageId: string, period = "7d", startDate?: string, endDate?: string) {
    return this.request<unknown>("GET", `/analytics/hourly?${this.analyticsQuery(pageId, period, startDate, endDate)}`);
  }

  async getAnalyticsTopLinks(pageId: string, period = "7d", startDate?: string, endDate?: string) {
    return this.request<unknown>("GET", `/analytics/top-links?${this.analyticsQuery(pageId, period, startDate, endDate)}`);
  }

  // Contacts
  async exportContacts(pageId: string) {
    return this.request<unknown[]>(
      "GET",
      `/contacts?page_id=${pageId}`
    );
  }

  // Export analytics as CSV
  async exportAnalytics(
    pageId: string,
    opts?: { period?: string; start_date?: string; end_date?: string }
  ): Promise<string> {
    const params = new URLSearchParams({ page_id: pageId });
    if (opts?.period) params.set("period", opts.period);
    if (opts?.start_date) params.set("start_date", opts.start_date);
    if (opts?.end_date) params.set("end_date", opts.end_date);
    const url = `${this.baseUrl}/api/v1/analytics/export?${params}`;
    const res = await fetch(url, {
      headers: { "X-API-Key": this.apiKey },
    });
    if (!res.ok) {
      throw new Error(`Export failed: ${res.status} ${res.statusText}`);
    }
    return res.text();
  }

  // Integrations
  async updateIntegrations(pageId: string, data: Record<string, unknown>) {
    return this.request<unknown>("PUT", `/pages/${pageId}/integrations`, data);
  }

  // Share analytics
  async shareAnalytics(pageId: string, enabled: boolean) {
    return this.request<unknown>("POST", "/analytics/share", {
      page_id: pageId,
      enabled,
    });
  }
}

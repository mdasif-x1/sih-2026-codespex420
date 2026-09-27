import { Scheme, Application, AuditLog, AnalyticsSummary, UploadedDocument } from '@/types';

class PragatiApiClient {
  private baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '/api/v1';

  private isMockModeAllowed(): boolean {
    return process.env.NEXT_PUBLIC_USE_MOCK_API === 'true';
  }

  private getHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
    };
  }

  public async getSchemes(): Promise<Scheme[]> {
    const res = await fetch(`${this.baseUrl}/schemes`, {
      headers: this.getHeaders(),
      cache: 'no-store',
    });
    if (!res.ok) {
      if (this.isMockModeAllowed()) {
        const { pragatiStore } = await import('@/lib/data/storeService');
        return pragatiStore.getSchemes();
      }
      throw new Error(`API Error: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    return data.schemes || [];
  }

  public async getSchemeById(id: string): Promise<Scheme | undefined> {
    const res = await fetch(`${this.baseUrl}/schemes/${id}`, {
      headers: this.getHeaders(),
      cache: 'no-store',
    });
    if (!res.ok) {
      if (this.isMockModeAllowed()) {
        const { pragatiStore } = await import('@/lib/data/storeService');
        return pragatiStore.getSchemes().find((s) => s.id === id || s.code === id);
      }
      throw new Error(`API Error: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    return data.scheme;
  }

  public async getApplications(): Promise<Application[]> {
    const res = await fetch(`${this.baseUrl}/applications`, {
      headers: this.getHeaders(),
      cache: 'no-store',
    });
    if (!res.ok) {
      if (this.isMockModeAllowed()) {
        const { pragatiStore } = await import('@/lib/data/storeService');
        return pragatiStore.getApplications();
      }
      throw new Error(`API Error: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    return data.applications || [];
  }

  public async getApplicationById(id: string): Promise<Application | undefined> {
    const res = await fetch(`${this.baseUrl}/applications/${id}`, {
      headers: this.getHeaders(),
      cache: 'no-store',
    });
    if (!res.ok) {
      if (this.isMockModeAllowed()) {
        const { pragatiStore } = await import('@/lib/data/storeService');
        return pragatiStore.getApplicationById(id);
      }
      throw new Error(`API Error: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    return data.application;
  }

  public async submitApplication(appData: Partial<Application>): Promise<Application> {
    const res = await fetch(`${this.baseUrl}/applications`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(appData),
    });
    if (!res.ok) {
      if (this.isMockModeAllowed()) {
        const { pragatiStore } = await import('@/lib/data/storeService');
        const app = appData as Application;
        pragatiStore.updateApplication(app, 'SUBMIT_APPLICATION', 'Submitted application via mock fallback');
        return app;
      }
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `API Error: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    return data.application;
  }

  public async triggerWorkflow(
    id: string,
    action: string,
    payload: any = {}
  ): Promise<Application> {
    const res = await fetch(`${this.baseUrl}/applications/${id}/workflow`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ action, ...payload }),
    });
    if (!res.ok) {
      if (this.isMockModeAllowed()) {
        const { pragatiStore } = await import('@/lib/data/storeService');
        const app = pragatiStore.getApplicationById(id);
        if (app) {
          pragatiStore.updateApplication(app, action, `Fallback execution for ${action}`);
        }
        return app!;
      }
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `API Error: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    return data.application;
  }

  public async uploadDocument(formData: FormData): Promise<UploadedDocument> {
    const res = await fetch(`${this.baseUrl}/documents/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Upload Error: ${res.status}`);
    }
    const data = await res.json();
    return data.document;
  }

  public async getNotifications(): Promise<any[]> {
    const res = await fetch(`${this.baseUrl}/notifications`, {
      headers: this.getHeaders(),
      cache: 'no-store',
    });
    if (!res.ok) {
      if (this.isMockModeAllowed()) return [];
      throw new Error(`API Error: ${res.status}`);
    }
    const data = await res.json();
    return data.notifications || [];
  }

  public async getAuditLogs(): Promise<AuditLog[]> {
    const res = await fetch(`${this.baseUrl}/admin/audit`, {
      headers: this.getHeaders(),
      cache: 'no-store',
    });
    if (!res.ok) {
      if (this.isMockModeAllowed()) {
        const { pragatiStore } = await import('@/lib/data/storeService');
        return pragatiStore.getAuditLogs();
      }
      throw new Error(`API Error: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    return data.auditLogs || [];
  }

  public async getAnalyticsSummary(): Promise<AnalyticsSummary> {
    const res = await fetch(`${this.baseUrl}/monitoring/summary`, {
      headers: this.getHeaders(),
      cache: 'no-store',
    });
    if (!res.ok) {
      if (this.isMockModeAllowed()) {
        const { pragatiStore } = await import('@/lib/data/storeService');
        const apps = pragatiStore.getApplications();
        return {
          totalApplications: apps.length,
          pendingInstituteVerification: apps.filter((a) => a.stage === 'SUBMITTED').length,
          pendingOfficerReview: apps.filter((a) => a.stage === 'OFFICER_REVIEW').length,
          aiFlaggedCount: apps.filter((a) => a.aiFindings.length > 0).length,
          deficiencyCount: apps.filter((a) => a.stage === 'DEFICIENCY').length,
          selectedCount: apps.filter((a) => a.stage === 'SELECTED').length,
          totalDisbursedAmountCr: 14.85,
          averageProcessingTimeDays: 4.2,
          stageFunnel: [
            { stage: 'Submitted', count: apps.length },
            { stage: 'Institute Verified', count: 340 },
          ],
          deficiencyCategories: [
            { category: 'Income Certificate Variance', count: 142 },
          ],
          instituteThroughput: [
            { institute: 'IIT Kharagpur', verified: 342, pending: 18 },
          ],
        };
      }
      throw new Error(`API Error: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    return data.summary;
  }
}

export const apiClient = new PragatiApiClient();

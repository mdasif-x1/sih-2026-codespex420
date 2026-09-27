import { Scheme, Application, AuditLog, User, UserRole, AIFinding, UploadedDocument, Deficiency } from '@/types';
import { INITIAL_SCHEMES, INITIAL_APPLICATIONS, INITIAL_AUDIT_LOGS, CURRENT_USER } from './mockStore';

const STORAGE_KEYS = {
  SCHEMES: 'pragati_schemes_v1',
  APPLICATIONS: 'pragati_applications_v1',
  AUDIT_LOGS: 'pragati_audit_v1',
  USER_ROLE: 'pragati_user_role_v1',
};

class PragatiStoreService {
  private listeners: Set<() => void> = new Set();

  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  public getSchemes(): Scheme[] {
    if (!this.isBrowser()) return INITIAL_SCHEMES;
    const stored = localStorage.getItem(STORAGE_KEYS.SCHEMES);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.SCHEMES, JSON.stringify(INITIAL_SCHEMES));
      return INITIAL_SCHEMES;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return INITIAL_SCHEMES;
    }
  }

  public saveSchemes(schemes: Scheme[]): void {
    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.SCHEMES, JSON.stringify(schemes));
      this.notify();
    }
  }

  public getApplications(): Application[] {
    if (!this.isBrowser()) return INITIAL_APPLICATIONS;
    const stored = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(INITIAL_APPLICATIONS));
      return INITIAL_APPLICATIONS;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return INITIAL_APPLICATIONS;
    }
  }

  public getApplicationById(id: string): Application | undefined {
    return this.getApplications().find((a) => a.id === id);
  }

  public saveApplications(apps: Application[]): void {
    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(apps));
      this.notify();
    }
  }

  public updateApplication(updatedApp: Application, auditAction?: string, auditReason?: string): void {
    const apps = this.getApplications();
    const index = apps.findIndex((a) => a.id === updatedApp.id);
    if (index !== -1) {
      apps[index] = { ...updatedApp, updatedAt: new Date().toISOString() };
    } else {
      apps.unshift(updatedApp);
    }
    this.saveApplications(apps);

    if (auditAction) {
      this.addAuditLog({
        action: auditAction,
        resource: 'Application',
        resourceId: updatedApp.id,
        reason: auditReason || `Updated application ${updatedApp.id} status to ${updatedApp.stage}`,
      });
    }
  }

  public getAuditLogs(): AuditLog[] {
    if (!this.isBrowser()) return INITIAL_AUDIT_LOGS;
    const stored = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
      return INITIAL_AUDIT_LOGS;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return INITIAL_AUDIT_LOGS;
    }
  }

  public addAuditLog(entry: { action: string; resource: string; resourceId: string; reason: string }): void {
    const currentUser = this.getCurrentUser();
    const logs = this.getAuditLogs();
    const newLog: AuditLog = {
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: `${currentUser.name} (${currentUser.email})`,
      actorRole: currentUser.role,
      action: entry.action,
      resource: entry.resource,
      resourceId: entry.resourceId,
      reason: entry.reason,
      ipAddress: '127.0.0.1 (Local Session)',
      requestId: `REQ-UI-${Math.floor(10000 + Math.random() * 90000)}`,
    };
    logs.unshift(newLog);
    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs));
      this.notify();
    }
  }

  public getCurrentRole(): UserRole {
    if (!this.isBrowser()) return 'APPLICANT';
    const stored = localStorage.getItem(STORAGE_KEYS.USER_ROLE) as UserRole;
    return stored || 'APPLICANT';
  }

  public setCurrentRole(role: UserRole): void {
    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.USER_ROLE, role);
      this.notify();
    }
  }

  public getCurrentUser(): User {
    const role = this.getCurrentRole();
    switch (role) {
      case 'APPLICANT':
        return {
          id: 'usr_app_aarav',
          name: 'Aarav Kumar',
          email: 'aarav.st.scholar@gmail.com',
          role: 'APPLICANT',
          avatar: 'AK',
        };
      case 'INSTITUTE':
        return {
          id: 'usr_inst_iitkgp',
          name: 'Dr. S. P. Hansda',
          email: 'nodal.scholarship@iitkgp.ac.in',
          role: 'INSTITUTE',
          institution: 'IIT Kharagpur',
          avatar: 'SH',
        };
      case 'OFFICER':
        return CURRENT_USER;
      case 'MONITORING':
        return {
          id: 'usr_mon_dir',
          name: 'Sunil M. Oraon',
          email: 'monitoring.dir@tribal.gov.in',
          role: 'MONITORING',
          department: 'Directorate of Tribal Welfare Analytics',
          avatar: 'SO',
        };
      case 'ADMIN':
        return {
          id: 'usr_admin_js',
          name: 'Dr. V. K. Meena',
          email: 'js.scholarship@tribal.gov.in',
          role: 'ADMIN',
          department: 'Joint Secretary (Scholarship & Schemes)',
          avatar: 'VM',
        };
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((fn) => fn());
  }

  public resetToDefaults(): void {
    if (this.isBrowser()) {
      localStorage.removeItem(STORAGE_KEYS.SCHEMES);
      localStorage.removeItem(STORAGE_KEYS.APPLICATIONS);
      localStorage.removeItem(STORAGE_KEYS.AUDIT_LOGS);
      localStorage.removeItem(STORAGE_KEYS.USER_ROLE);
      this.notify();
    }
  }
}

export const pragatiStore = new PragatiStoreService();

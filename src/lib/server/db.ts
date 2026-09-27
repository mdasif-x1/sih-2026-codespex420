// PRAGATI Server-side Prisma PostgreSQL Persistence Engine
import { PrismaClient } from '@prisma/client';
import { Application, Scheme, AuditLog, User } from '@/types';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Application Repository Abstraction mapping to PrismaClient PostgreSQL Models
export class PragatiPostgresRepository {
  public get users() {
    return {
      findMany: async () => {
        const records = await prisma.user.findMany();
        return records.map((r) => ({
          id: r.id,
          email: r.email,
          passwordHash: r.passwordHash,
          name: r.name,
          role: r.role as any,
          institution: r.institution || undefined,
          department: r.department || undefined,
          avatar: r.avatar || undefined,
        }));
      },

      findUnique: async ({ where }: { where: { email?: string; id?: string } }) => {
        let record = null;
        if (where.email) {
          record = await prisma.user.findUnique({ where: { email: where.email.toLowerCase() } });
        } else if (where.id) {
          record = await prisma.user.findUnique({ where: { id: where.id } });
        }
        if (!record) return null;
        return {
          id: record.id,
          email: record.email,
          passwordHash: record.passwordHash,
          name: record.name,
          role: record.role as any,
          institution: record.institution || undefined,
          department: record.department || undefined,
          avatar: record.avatar || undefined,
        };
      },

      create: async ({ data }: { data: User & { passwordHash: string } }) => {
        const created = await prisma.user.create({
          data: {
            id: data.id,
            email: data.email.toLowerCase(),
            passwordHash: data.passwordHash,
            name: data.name,
            role: data.role,
            institution: data.institution,
            department: data.department,
            avatar: data.avatar,
          },
        });
        return {
          ...created,
          role: created.role as any,
          institution: created.institution || undefined,
          department: created.department || undefined,
          avatar: created.avatar || undefined,
        };
      },
    };
  }

  public get schemes() {
    return {
      findMany: async (): Promise<Scheme[]> => {
        const records = await prisma.scheme.findMany({
          include: { versions: true },
        });
        return records.map((s) => ({
          id: s.id,
          code: s.code,
          name: s.name,
          shortDescription: s.shortDescription,
          fullDescription: s.fullDescription,
          ministry: s.ministry,
          targetCategory: s.targetCategory,
          currentVersionId: s.currentVersionId,
          applicationPeriod: {
            startDate: s.startDate,
            endDate: s.endDate,
          },
          totalSeats: s.totalSeats || undefined,
          budgetAllocatedCr: s.budgetAllocatedCr || undefined,
          versions: s.versions.map((v) => ({
            versionId: v.id,
            schemeId: v.schemeId,
            versionTag: v.versionTag,
            status: v.status as any,
            publishedAt: v.publishedAt || undefined,
            publishedBy: v.publishedBy || undefined,
            effectiveFrom: v.effectiveFrom,
            effectiveTo: v.effectiveTo,
            selectionMethod: v.selectionMethod as any,
            workflowStages: JSON.parse(v.workflowStages || '[]'),
            formFields: JSON.parse(v.formFields || '[]'),
            eligibilityRules: JSON.parse(v.eligibilityRules || '[]'),
            documentRequirements: JSON.parse(v.documentRequirements || '[]'),
            minMarksPercentage: v.minMarksPercentage || undefined,
            maxFamilyIncome: v.maxFamilyIncome || undefined,
          })),
        }));
      },

      findUnique: async ({ where }: { where: { id?: string; code?: string } }): Promise<Scheme | null> => {
        let record = null;
        if (where.code) {
          record = await prisma.scheme.findUnique({
            where: { code: where.code },
            include: { versions: true },
          });
        } else if (where.id) {
          record = await prisma.scheme.findUnique({
            where: { id: where.id },
            include: { versions: true },
          });
        }
        if (!record) return null;
        return {
          id: record.id,
          code: record.code,
          name: record.name,
          shortDescription: record.shortDescription,
          fullDescription: record.fullDescription,
          ministry: record.ministry,
          targetCategory: record.targetCategory,
          currentVersionId: record.currentVersionId,
          applicationPeriod: {
            startDate: record.startDate,
            endDate: record.endDate,
          },
          totalSeats: record.totalSeats || undefined,
          budgetAllocatedCr: record.budgetAllocatedCr || undefined,
          versions: record.versions.map((v) => ({
            versionId: v.id,
            schemeId: v.schemeId,
            versionTag: v.versionTag,
            status: v.status as any,
            publishedAt: v.publishedAt || undefined,
            publishedBy: v.publishedBy || undefined,
            effectiveFrom: v.effectiveFrom,
            effectiveTo: v.effectiveTo,
            selectionMethod: v.selectionMethod as any,
            workflowStages: JSON.parse(v.workflowStages || '[]'),
            formFields: JSON.parse(v.formFields || '[]'),
            eligibilityRules: JSON.parse(v.eligibilityRules || '[]'),
            documentRequirements: JSON.parse(v.documentRequirements || '[]'),
            minMarksPercentage: v.minMarksPercentage || undefined,
            maxFamilyIncome: v.maxFamilyIncome || undefined,
          })),
        };
      },

      create: async ({ data }: { data: Scheme }): Promise<Scheme> => {
        const created = await prisma.scheme.create({
          data: {
            id: data.id,
            code: data.code,
            name: data.name,
            shortDescription: data.shortDescription,
            fullDescription: data.fullDescription,
            ministry: data.ministry,
            targetCategory: data.targetCategory,
            currentVersionId: data.currentVersionId,
            startDate: data.applicationPeriod?.startDate || new Date().toISOString(),
            endDate: data.applicationPeriod?.endDate || new Date().toISOString(),
            totalSeats: data.totalSeats,
            budgetAllocatedCr: data.budgetAllocatedCr,
          },
        });
        return {
          ...data,
          id: created.id,
        };
      },

      update: async ({ where, data }: { where: { id: string }; data: Partial<Scheme> }): Promise<Scheme> => {
        const updated = await prisma.scheme.update({
          where: { id: where.id },
          data: {
            name: data.name,
            shortDescription: data.shortDescription,
            fullDescription: data.fullDescription,
            ministry: data.ministry,
            targetCategory: data.targetCategory,
            totalSeats: data.totalSeats,
            budgetAllocatedCr: data.budgetAllocatedCr,
          },
          include: { versions: true },
        });
        return {
          id: updated.id,
          code: updated.code,
          name: updated.name,
          shortDescription: updated.shortDescription,
          fullDescription: updated.fullDescription,
          ministry: updated.ministry,
          targetCategory: updated.targetCategory,
          currentVersionId: updated.currentVersionId,
          applicationPeriod: {
            startDate: updated.startDate,
            endDate: updated.endDate,
          },
          totalSeats: updated.totalSeats || undefined,
          budgetAllocatedCr: updated.budgetAllocatedCr || undefined,
          versions: updated.versions.map((v) => ({
            versionId: v.id,
            schemeId: v.schemeId,
            versionTag: v.versionTag,
            status: v.status as any,
            publishedAt: v.publishedAt || undefined,
            publishedBy: v.publishedBy || undefined,
            effectiveFrom: v.effectiveFrom,
            effectiveTo: v.effectiveTo,
            selectionMethod: v.selectionMethod as any,
            workflowStages: JSON.parse(v.workflowStages || '[]'),
            formFields: JSON.parse(v.formFields || '[]'),
            eligibilityRules: JSON.parse(v.eligibilityRules || '[]'),
            documentRequirements: JSON.parse(v.documentRequirements || '[]'),
            minMarksPercentage: v.minMarksPercentage || undefined,
            maxFamilyIncome: v.maxFamilyIncome || undefined,
          })),
        };
      },
    };
  }

  public get applications() {
    return {
      findMany: async (): Promise<Application[]> => {
        const records = await prisma.application.findMany({
          include: {
            documents: true,
            aiFindings: true,
            deficiencies: true,
            ruleEvaluations: true,
            timeline: true,
          },
          orderBy: { createdAt: 'desc' },
        });

        return records.map((a) => this.mapApplicationToDomain(a));
      },

      findUnique: async ({ where }: { where: { id: string } }): Promise<Application | null> => {
        const record = await prisma.application.findUnique({
          where: { id: where.id },
          include: {
            documents: true,
            aiFindings: true,
            deficiencies: true,
            ruleEvaluations: true,
            timeline: true,
          },
        });
        if (!record) return null;
        return this.mapApplicationToDomain(record);
      },

      create: async ({ data }: { data: Application }): Promise<Application> => {
        return prisma.$transaction(async (tx) => {
          const created = await tx.application.create({
            data: {
              id: data.id,
              schemeId: data.schemeId,
              schemeCode: data.schemeCode,
              schemeName: data.schemeName,
              schemeVersionId: data.schemeVersionId,
              applicantId: data.applicantId,
              applicantName: data.applicantName,
              applicantEmail: data.applicantEmail,
              applicantPhone: data.applicantPhone,
              stCertificateNo: data.stCertificateNo,
              instituteName: data.instituteName,
              instituteCode: data.instituteCode,
              courseName: data.courseName,
              academicYear: data.academicYear,
              marksPercentage: data.marksPercentage,
              annualFamilyIncome: data.annualFamilyIncome,
              stage: data.stage,
              dynamicData: JSON.stringify(data.dynamicData || {}),
              compositeScore: data.compositeScore,
              rank: data.rank,
              pfmsBatchNo: data.disbursementStatus?.pfmsBatchNo,
              amountRs: data.disbursementStatus?.amountRs,
              accountLast4: data.disbursementStatus?.accountLast4,
              disbursedAt: data.disbursementStatus?.disbursedAt,
              submittedAt: data.submittedAt,
            },
          });

          if (data.timeline && data.timeline.length > 0) {
            for (const t of data.timeline) {
              await tx.timelineEvent.create({
                data: {
                  id: t.id || `tl_${Date.now()}_${Math.random()}`,
                  applicationId: created.id,
                  timestamp: t.timestamp,
                  stage: t.stage,
                  actor: t.actor,
                  actorRole: t.actorRole,
                  title: t.title,
                  description: t.description,
                  notes: t.notes,
                },
              });
            }
          }

          if (data.ruleEvaluations && data.ruleEvaluations.length > 0) {
            for (const r of data.ruleEvaluations) {
              await tx.ruleResult.create({
                data: {
                  id: `rr_${Date.now()}_${Math.random()}`,
                  applicationId: created.id,
                  ruleId: r.ruleId,
                  ruleName: r.ruleName,
                  category: r.category,
                  expectedCondition: r.expectedCondition,
                  observedValue: String(r.observedValue),
                  result: r.result,
                  notes: r.notes,
                },
              });
            }
          }

          const fullRecord = await tx.application.findUnique({
            where: { id: created.id },
            include: {
              documents: true,
              aiFindings: true,
              deficiencies: true,
              ruleEvaluations: true,
              timeline: true,
            },
          });

          return this.mapApplicationToDomain(fullRecord!);
        });
      },

      update: async ({ where, data }: { where: { id: string }; data: Partial<Application> }): Promise<Application> => {
        return prisma.$transaction(async (tx) => {
          await tx.application.update({
            where: { id: where.id },
            data: {
              stage: data.stage,
              marksPercentage: data.marksPercentage,
              annualFamilyIncome: data.annualFamilyIncome,
              compositeScore: data.compositeScore,
              rank: data.rank,
              pfmsBatchNo: data.disbursementStatus?.pfmsBatchNo,
              amountRs: data.disbursementStatus?.amountRs,
              accountLast4: data.disbursementStatus?.accountLast4,
              disbursedAt: data.disbursementStatus?.disbursedAt,
              updatedAt: new Date(),
            },
          });

          if (data.timeline && data.timeline.length > 0) {
            const latest = data.timeline[0];
            await tx.timelineEvent.create({
              data: {
                id: latest.id || `tl_${Date.now()}`,
                applicationId: where.id,
                timestamp: latest.timestamp,
                stage: latest.stage,
                actor: latest.actor,
                actorRole: latest.actorRole,
                title: latest.title,
                description: latest.description,
                notes: latest.notes,
              },
            });
          }

          const fullRecord = await tx.application.findUnique({
            where: { id: where.id },
            include: {
              documents: true,
              aiFindings: true,
              deficiencies: true,
              ruleEvaluations: true,
              timeline: true,
            },
          });

          return this.mapApplicationToDomain(fullRecord!);
        });
      },
    };
  }

  public get auditLogs() {
    return {
      findMany: async (): Promise<AuditLog[]> => {
        const records = await prisma.auditLog.findMany({
          orderBy: { timestamp: 'desc' },
        });
        return records.map((a) => ({
          id: a.id,
          timestamp: a.timestamp,
          actor: a.actor,
          actorRole: a.actorRole as any,
          action: a.action,
          resource: a.resource,
          resourceId: a.resourceId,
          reason: a.reason || undefined,
          ipAddress: a.ipAddress,
          requestId: a.requestId,
        }));
      },

      create: async ({ data }: { data: AuditLog }): Promise<AuditLog> => {
        const created = await prisma.auditLog.create({
          data: {
            id: data.id,
            timestamp: data.timestamp,
            actor: data.actor,
            actorRole: data.actorRole,
            action: data.action,
            resource: data.resource,
            resourceId: data.resourceId,
            reason: data.reason,
            ipAddress: data.ipAddress,
            requestId: data.requestId,
          },
        });
        return {
          id: created.id,
          timestamp: created.timestamp,
          actor: created.actor,
          actorRole: created.actorRole as any,
          action: created.action,
          resource: created.resource,
          resourceId: created.resourceId,
          reason: created.reason || undefined,
          ipAddress: created.ipAddress,
          requestId: created.requestId,
        };
      },
    };
  }

  private mapApplicationToDomain(record: any): Application {
    const latestDeficiency = record.deficiencies && record.deficiencies.length > 0 ? record.deficiencies[0] : undefined;

    return {
      id: record.id,
      schemeId: record.schemeId,
      schemeCode: record.schemeCode,
      schemeName: record.schemeName,
      schemeVersionId: record.schemeVersionId,
      applicantId: record.applicantId,
      applicantName: record.applicantName,
      applicantEmail: record.applicantEmail,
      applicantPhone: record.applicantPhone,
      stCertificateNo: record.stCertificateNo,
      instituteName: record.instituteName,
      instituteCode: record.instituteCode,
      courseName: record.courseName,
      academicYear: record.academicYear,
      marksPercentage: record.marksPercentage,
      annualFamilyIncome: record.annualFamilyIncome,
      stage: record.stage as any,
      dynamicData: JSON.parse(record.dynamicData || '{}'),
      documents: (record.documents || []).map((d: any) => ({
        id: d.id,
        requirementId: d.requirementId,
        documentType: d.documentType,
        fileName: d.fileName,
        fileSizeMb: d.fileSizeMb,
        fileUrl: d.fileUrl,
        uploadedAt: d.uploadedAt,
        status: d.status as any,
        extractions: JSON.parse(d.extractions || '[]'),
        findings: [],
      })),
      aiFindings: (record.aiFindings || []).map((f: any) => ({
        id: f.id,
        documentId: f.documentId,
        documentType: f.documentType,
        title: f.title,
        type: f.type as any,
        expected: f.expected,
        observed: f.observed,
        confidence: f.confidence,
        sourceDocName: f.sourceDocName,
        sourcePage: f.sourcePage || undefined,
        whyFlagged: f.whyFlagged,
        recommendedAction: f.recommendedAction as any,
        status: f.status as any,
        reviewedBy: f.reviewedBy || undefined,
        reviewedAt: f.reviewedAt || undefined,
        reviewNotes: f.reviewNotes || undefined,
      })),
      deficiency: latestDeficiency
        ? {
            id: latestDeficiency.id,
            applicationId: latestDeficiency.applicationId,
            documentType: latestDeficiency.documentType,
            documentId: latestDeficiency.documentId || undefined,
            issueType: latestDeficiency.issueType,
            problemDescription: latestDeficiency.problemDescription,
            requiredAction: latestDeficiency.requiredAction,
            deadline: latestDeficiency.deadline,
            status: latestDeficiency.status as any,
            history: JSON.parse(latestDeficiency.history || '[]'),
            createdAt: latestDeficiency.createdAt.toISOString(),
          }
        : undefined,
      ruleEvaluations: (record.ruleEvaluations || []).map((r: any) => ({
        ruleId: r.ruleId,
        ruleName: r.ruleName,
        category: r.category,
        expectedCondition: r.expectedCondition,
        observedValue: r.observedValue,
        result: r.result as any,
        notes: r.notes || undefined,
      })),
      timeline: (record.timeline || []).map((t: any) => ({
        id: t.id,
        timestamp: t.timestamp,
        stage: t.stage as any,
        actor: t.actor,
        actorRole: t.actorRole as any,
        title: t.title,
        description: t.description,
        notes: t.notes || undefined,
      })),
      compositeScore: record.compositeScore || undefined,
      rank: record.rank || undefined,
      disbursementStatus: record.amountRs
        ? {
            pfmsBatchNo: record.pfmsBatchNo || undefined,
            amountRs: record.amountRs || undefined,
            accountLast4: record.accountLast4 || undefined,
            disbursedAt: record.disbursedAt || undefined,
          }
        : undefined,
      submittedAt: record.submittedAt || undefined,
      updatedAt: record.updatedAt.toISOString(),
    };
  }
}

export const db = new PragatiPostgresRepository();

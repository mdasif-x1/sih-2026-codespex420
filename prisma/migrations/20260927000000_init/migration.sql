-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "institution" TEXT,
    "department" TEXT,
    "avatar" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Scheme" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "fullDescription" TEXT NOT NULL,
    "ministry" TEXT NOT NULL,
    "targetCategory" TEXT NOT NULL,
    "currentVersionId" TEXT NOT NULL,
    "startDate" TEXT NOT NULL,
    "endDate" TEXT NOT NULL,
    "totalSeats" INTEGER,
    "budgetAllocatedCr" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Scheme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SchemeVersion" (
    "id" TEXT NOT NULL,
    "schemeId" TEXT NOT NULL,
    "versionTag" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "publishedAt" TEXT,
    "publishedBy" TEXT,
    "effectiveFrom" TEXT NOT NULL,
    "effectiveTo" TEXT NOT NULL,
    "selectionMethod" TEXT NOT NULL,
    "workflowStages" TEXT NOT NULL,
    "formFields" TEXT NOT NULL,
    "eligibilityRules" TEXT NOT NULL,
    "documentRequirements" TEXT NOT NULL,
    "minMarksPercentage" DOUBLE PRECISION,
    "maxFamilyIncome" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SchemeVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "schemeId" TEXT NOT NULL,
    "schemeCode" TEXT NOT NULL,
    "schemeName" TEXT NOT NULL,
    "schemeVersionId" TEXT NOT NULL,
    "applicantId" TEXT NOT NULL,
    "applicantName" TEXT NOT NULL,
    "applicantEmail" TEXT NOT NULL,
    "applicantPhone" TEXT NOT NULL,
    "stCertificateNo" TEXT NOT NULL,
    "instituteName" TEXT NOT NULL,
    "instituteCode" TEXT NOT NULL,
    "courseName" TEXT NOT NULL,
    "academicYear" TEXT NOT NULL,
    "marksPercentage" DOUBLE PRECISION NOT NULL,
    "annualFamilyIncome" DOUBLE PRECISION NOT NULL,
    "stage" TEXT NOT NULL,
    "dynamicData" TEXT NOT NULL,
    "compositeScore" DOUBLE PRECISION,
    "rank" INTEGER,
    "pfmsBatchNo" TEXT,
    "amountRs" DOUBLE PRECISION,
    "accountLast4" TEXT,
    "disbursedAt" TEXT,
    "submittedAt" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "requirementId" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileSizeMb" DOUBLE PRECISION NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "uploadedAt" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "extractions" TEXT NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIFinding" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "expected" TEXT NOT NULL,
    "observed" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "sourceDocName" TEXT NOT NULL,
    "sourcePage" INTEGER,
    "whyFlagged" TEXT NOT NULL,
    "recommendedAction" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "reviewedBy" TEXT,
    "reviewedAt" TEXT,
    "reviewNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AIFinding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deficiency" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "documentId" TEXT,
    "issueType" TEXT NOT NULL,
    "problemDescription" TEXT NOT NULL,
    "requiredAction" TEXT NOT NULL,
    "deadline" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "history" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Deficiency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RuleResult" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "ruleId" TEXT NOT NULL,
    "ruleName" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "expectedCondition" TEXT NOT NULL,
    "observedValue" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RuleResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimelineEvent" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "timestamp" TEXT NOT NULL,
    "stage" TEXT NOT NULL,
    "actor" TEXT NOT NULL,
    "actorRole" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "notes" TEXT,

    CONSTRAINT "TimelineEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "timestamp" TEXT NOT NULL,
    "actor" TEXT NOT NULL,
    "actorRole" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "reason" TEXT,
    "ipAddress" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Scheme_code_key" ON "Scheme"("code");

-- CreateIndex
CREATE UNIQUE INDEX "SchemeVersion_schemeId_versionTag_key" ON "SchemeVersion"("schemeId", "versionTag");

-- CreateIndex
CREATE INDEX "Application_applicantId_idx" ON "Application"("applicantId");

-- CreateIndex
CREATE INDEX "Application_schemeId_idx" ON "Application"("schemeId");

-- CreateIndex
CREATE INDEX "Application_stage_idx" ON "Application"("stage");

-- CreateIndex
CREATE INDEX "Application_instituteCode_idx" ON "Application"("instituteCode");

-- CreateIndex
CREATE INDEX "Document_applicationId_idx" ON "Document"("applicationId");

-- CreateIndex
CREATE INDEX "AIFinding_applicationId_idx" ON "AIFinding"("applicationId");

-- CreateIndex
CREATE INDEX "AIFinding_status_idx" ON "AIFinding"("status");

-- CreateIndex
CREATE INDEX "Deficiency_applicationId_idx" ON "Deficiency"("applicationId");

-- CreateIndex
CREATE INDEX "Deficiency_status_idx" ON "Deficiency"("status");

-- CreateIndex
CREATE INDEX "RuleResult_applicationId_idx" ON "RuleResult"("applicationId");

-- CreateIndex
CREATE INDEX "TimelineEvent_applicationId_idx" ON "TimelineEvent"("applicationId");

-- CreateIndex
CREATE INDEX "AuditLog_actorRole_idx" ON "AuditLog"("actorRole");

-- CreateIndex
CREATE INDEX "AuditLog_resource_idx" ON "AuditLog"("resource");

-- CreateIndex
CREATE INDEX "AuditLog_timestamp_idx" ON "AuditLog"("timestamp");

-- AddForeignKey
ALTER TABLE "SchemeVersion" ADD CONSTRAINT "SchemeVersion_schemeId_fkey" FOREIGN KEY ("schemeId") REFERENCES "Scheme"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_schemeId_fkey" FOREIGN KEY ("schemeId") REFERENCES "Scheme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIFinding" ADD CONSTRAINT "AIFinding_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIFinding" ADD CONSTRAINT "AIFinding_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deficiency" ADD CONSTRAINT "Deficiency_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RuleResult" ADD CONSTRAINT "RuleResult_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimelineEvent" ADD CONSTRAINT "TimelineEvent_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

import { UploadedDocument } from '@/types';
import { db } from './db';
import fs from 'fs';
import path from 'path';

export interface StorageProvider {
  uploadFile(fileName: string, mimeType: string, buffer: Buffer): Promise<string>;
}

export class LocalStorageProvider implements StorageProvider {
  private uploadDir = path.join(process.cwd(), 'public', 'uploads');

  constructor() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  public async uploadFile(fileName: string, mimeType: string, buffer: Buffer): Promise<string> {
    const safeName = `${Date.now()}_${fileName.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const filePath = path.join(this.uploadDir, safeName);
    fs.writeFileSync(filePath, buffer);
    return `/uploads/${safeName}`;
  }
}

const storageProvider = new LocalStorageProvider();

const ALLOWED_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE_MB = 10;

export class DocumentService {
  /**
   * Validates document file properties and saves document metadata
   */
  public static async uploadDocument(params: {
    applicationId: string;
    requirementId: string;
    documentType: string;
    fileName: string;
    mimeType: string;
    fileSizeMb: number;
    fileBuffer?: Buffer;
  }): Promise<UploadedDocument> {
    // 1. Validate MIME Type
    if (!ALLOWED_MIME_TYPES.includes(params.mimeType.toLowerCase())) {
      throw new Error(`Invalid document type: ${params.mimeType}. Only PDF, JPEG, PNG, and WebP are allowed.`);
    }

    // 2. Validate File Size
    if (params.fileSizeMb > MAX_FILE_SIZE_MB) {
      throw new Error(`File size exceeds maximum limit of ${MAX_FILE_SIZE_MB}MB.`);
    }

    // 3. Save File via Storage Provider
    let fileUrl = `/uploads/${params.fileName}`;
    if (params.fileBuffer) {
      fileUrl = await storageProvider.uploadFile(params.fileName, params.mimeType, params.fileBuffer);
    }

    const docId = `doc_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const newDoc: UploadedDocument = {
      id: docId,
      requirementId: params.requirementId,
      documentType: params.documentType,
      fileName: params.fileName,
      fileSizeMb: params.fileSizeMb,
      fileUrl,
      uploadedAt: new Date().toISOString(),
      status: 'VERIFIED',
      extractions: [
        {
          fieldName: 'Document Type',
          extractedValue: params.documentType,
          expectedValue: params.documentType,
          matchScore: 100,
          isMatched: true,
        },
      ],
      findings: [],
    };

    // 4. Update Application Document List
    const app = await db.applications.findUnique({ where: { id: params.applicationId } });
    if (app) {
      const existingDocs = app.documents || [];
      const updatedDocs = [...existingDocs.filter((d) => d.documentType !== params.documentType), newDoc];
      await db.applications.update({
        where: { id: params.applicationId },
        data: { documents: updatedDocs, updatedAt: new Date().toISOString() },
      });
    }

    return newDoc;
  }
}

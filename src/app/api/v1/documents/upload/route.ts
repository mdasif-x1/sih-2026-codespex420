import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/server/auth';
import { DocumentService } from '@/lib/server/documentService';

export async function POST(req: NextRequest) {
  const session = getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized: Authentication required' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const applicationId = formData.get('applicationId') as string;
    const requirementId = formData.get('requirementId') as string;
    const documentType = formData.get('documentType') as string;

    if (!applicationId || !documentType) {
      return NextResponse.json({ error: 'Missing applicationId or documentType' }, { status: 400 });
    }

    let fileName = 'document.pdf';
    let mimeType = 'application/pdf';
    let fileSizeMb = 1.2;
    let buffer: Buffer | undefined = undefined;

    if (file) {
      fileName = file.name;
      mimeType = file.type || 'application/pdf';
      fileSizeMb = parseFloat((file.size / (1024 * 1024)).toFixed(2));
      const arrayBuffer = await file.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    }

    const doc = await DocumentService.uploadDocument({
      applicationId,
      requirementId: requirementId || 'req_doc',
      documentType,
      fileName,
      mimeType,
      fileSizeMb,
      fileBuffer: buffer,
    });

    return NextResponse.json({ success: true, document: doc }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Document upload failed' }, { status: 400 });
  }
}

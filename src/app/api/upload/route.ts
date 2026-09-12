import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

const NOT_CONFIGURED_MESSAGE =
  "File uploads aren't set up yet on this deployment: no Blob storage is connected. In Vercel: Project → Storage → Create Database → Blob, then connect it and redeploy. Paste a link instead in the meantime.";

// The @vercel/blob client SDK discards whatever error body a non-2xx
// response carries and always throws its own generic "failed to retrieve
// the client token" message -- so the real reason (no Blob store attached)
// never reaches the user via the upload call itself. The client checks
// this cheap GET first and shows the real message before even attempting
// an upload.
export async function GET() {
  return NextResponse.json({ configured: !!process.env.BLOB_READ_WRITE_TOKEN });
}

// Browser uploads the file straight to Vercel Blob storage (bypassing our
// serverless function's body-size limit), using a short-lived token this
// route hands out. Only the CR (admin) can request one.
export async function POST(request: Request): Promise<NextResponse> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: NOT_CONFIGURED_MESSAGE }, { status: 500 });
  }

  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        const session = await auth();
        if (!session?.user?.isAdmin) {
          throw new Error("Not authorized.");
        }
        return {
          allowedContentTypes: [
            "application/pdf",
            "application/vnd.ms-powerpoint",
            "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/zip",
            "image/png",
            "image/jpeg",
            "text/plain",
          ],
          addRandomSuffix: true,
          maximumSizeInBytes: 50 * 1024 * 1024, // 50MB, comfortable for slides
        };
      },
      onUploadCompleted: async () => {
        // no-op: the client saves the returned URL onto the Material/Task itself
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}

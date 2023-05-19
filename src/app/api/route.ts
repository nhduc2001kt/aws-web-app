import { NextRequest, NextResponse } from 'next/server';
import { WriteStream, createWriteStream } from 'fs';

const pump = async (reader: ReadableStreamDefaultReader, writableStream: WriteStream) => {
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      writableStream.write(Buffer.from(value));
    }

    writableStream.end();

    return true
  } catch (error) {
    console.error(error)

    return false
  }
};

const writeBlobToFile = async (blob: Blob, filePath: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const writableStream = createWriteStream(filePath);
    const reader = new ReadableStreamDefaultReader(blob.stream());

    pump(reader, writableStream);
  });
}

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const fileData = formData.get('file')
  const fileName = formData.get('fileName')

  if (!fileData || !fileName || typeof fileData === 'string' || typeof fileName !== 'string') {
    return new Response(undefined, {
      status: 400,
    });
  }

  writeBlobToFile(fileData, `../folder/${fileName}`)

  return NextResponse.json({ result: true });
}

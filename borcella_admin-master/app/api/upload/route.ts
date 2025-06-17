import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const mediaType = formData.get('mediaType') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!mediaType || !['image', 'video'].includes(mediaType)) {
      return NextResponse.json({ error: 'Invalid media type' }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create FormData for Cloudinary
    const cloudinaryFormData = new FormData();
    cloudinaryFormData.append('file', new Blob([buffer], { type: file.type }), file.name);
    cloudinaryFormData.append('upload_preset', 'vwfnzfpo');
    cloudinaryFormData.append('resource_type', mediaType);

    // Upload to Cloudinary
    const response = await fetch(`https://api.cloudinary.com/v1_1/drapeanddime/${mediaType}/upload`, {
      method: 'POST',
      body: cloudinaryFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Cloudinary upload failed:', errorText);
      return NextResponse.json({ error: `Upload failed: ${response.status} ${response.statusText}` }, { status: response.status });
    }

    const result = await response.json();
    
    return NextResponse.json({ 
      success: true, 
      url: result.secure_url,
      publicId: result.public_id 
    });

  } catch (error) {
    console.error('Upload API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 
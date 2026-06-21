import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME!
const UPLOAD_PRESET = 'gta6hub'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const folder = (formData.get('folder') as string) || 'posts'

    if (!file) return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 })
    if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: 'Arquivo muito grande (máx 5MB)' }, { status: 400 })

    const uploadForm = new FormData()
    uploadForm.append('file', file)
    uploadForm.append('upload_preset', UPLOAD_PRESET)
    uploadForm.append('folder', folder)

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      { method: 'POST', body: uploadForm }
    )

    const data = await res.json()
    if (!res.ok) return NextResponse.json({ error: data.error?.message ?? 'Erro no upload' }, { status: 500 })

    return NextResponse.json({ url: data.secure_url })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

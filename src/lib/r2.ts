import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
  },
})

export async function uploadFile(key: string, file: Buffer, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
    Key: key,
    Body: file,
    ContentType: contentType,
  })

  await r2Client.send(command)
  
  return `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${key}`
}

export async function deleteFile(key: string) {
  const command = new DeleteObjectCommand({
    Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
    Key: key,
  })

  await r2Client.send(command)
}

export async function getUploadUrl(key: string, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  })

  const signedUrl = await getSignedUrl(r2Client, command, { expiresIn: 3600 })
  return signedUrl
}

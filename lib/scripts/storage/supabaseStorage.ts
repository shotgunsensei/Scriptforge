import { createSupabaseServiceClient, getSupabaseConfig } from "../supabase";

export class SupabaseScriptFileStorage {
  constructor(
    private readonly bucket = getSupabaseConfig().bucket,
    private readonly supabase = createSupabaseServiceClient(),
  ) {}

  async uploadText(path: string, body: string, contentType: string) {
    const { error } = await this.supabase.storage.from(this.bucket).upload(path, body, {
      contentType,
      upsert: true,
    });

    if (error) {
      throw new Error(`Supabase Storage upload failed for ${path}: ${error.message}`);
    }

    return this.getStorageUri(path);
  }

  async uploadBytes(path: string, body: Uint8Array, contentType: string) {
    const { error } = await this.supabase.storage.from(this.bucket).upload(path, body, {
      contentType,
      upsert: true,
    });

    if (error) {
      throw new Error(`Supabase Storage upload failed for ${path}: ${error.message}`);
    }

    return this.getStorageUri(path);
  }

  getStorageUri(path: string) {
    return `supabase://${this.bucket}/${path}`;
  }
}

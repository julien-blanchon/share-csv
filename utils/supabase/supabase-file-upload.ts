import { v4 as uuidv4 } from 'uuid';
import { createClient } from '@/utils/supabase/client'

// Initialize Supabase client
const supabase = createClient();

export async function uploadFileToBucket(file: File, userId: string) {
    const fileExtension = file.name.split('.').pop();
    const uuid = uuidv4();
    const fileName = `${uuid}.${fileExtension}`;
    const filePath = `${userId}/${fileName}`;

    const { data, error } = await supabase
        .storage
        .from('files')
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
        });

    if (error) {
        console.error('Error uploading file:', error);
        return { error };
    }

    return { data, filePath, uuid };
}

import { v4 as uuidv4 } from 'uuid';
import { createClient } from '@/utils/supabase/client'
import { parseCSV } from '@/components/custom/data-table/utils';
import { getColumnTypes } from '../table/infer-table-schema';

// Initialize Supabase client
const supabase = createClient();

export async function uploadFileToBucket(file: File, userId: string) {
    const fileExtension = file.name.split('.').pop();
    const uuid = uuidv4();
    const fileName = `${uuid}.${fileExtension}`;
    const filePath = `${userId}/${fileName}`;

    // Upload file to storage
    const { data: storageData, error: storageError } = await supabase
        .storage
        .from('files')
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
        });

    if (storageError) {
        console.error('Error uploading file:', storageError);
        return { error: storageError };
    }

    const csvData = await file.text();
    const parsedData = parseCSV(csvData);

    // If new columns found, add them to columnDefinition with a default "string" type
    const schema = getColumnTypes(parsedData);

    console.log(schema)

    // Insert file information into the files table
    const { data: fileData, error: fileError } = await supabase
        .from('files')
        .insert({
            id: uuid,
            filename: file.name,
            schema: schema,
            bucket: 'files',
            blob_path: filePath,
        })
        .select()
        .single();

    if (fileError) {
        console.error('Error inserting file data:', fileError);
        return { error: fileError };
    }

    // Insert user-file relationship into the user_files table
    const { error: userFileError } = await supabase
        .from('user_files')
        .insert({
            user_id: userId,
            file_id: uuid,
            owner: true,
        });

    if (userFileError) {
        console.error('Error inserting user-file relationship:', userFileError);
        return { error: userFileError };
    }

    return { data: fileData, filePath, uuid };
}

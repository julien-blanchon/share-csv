CREATE TABLE files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    filename TEXT,
    schema JSONB,
    bucket TEXT,
    blob_path TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_files (
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    file_id UUID REFERENCES files(id) ON DELETE CASCADE,
    owner BOOLEAN,
    PRIMARY KEY (user_id, file_id)
);

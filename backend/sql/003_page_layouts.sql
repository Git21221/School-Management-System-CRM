-- Add page layout config for Super Admin dashboard editor (existing databases)
ALTER TABLE institute_settings
  ADD COLUMN page_layouts JSON NULL;

ALTER TABLE product_images MODIFY image_url TEXT;
ALTER TABLE product_images ADD COLUMN public_id VARCHAR(255) NULL;
ALTER TABLE product_images ADD COLUMN sort_order INT DEFAULT 0;

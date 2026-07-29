-- Add new fields to leadership_members table for Board Members
-- Run this script manually in your database

ALTER TABLE `leadership_members` 
ADD COLUMN `linkedin` TEXT NULL AFTER `color`,
ADD COLUMN `biography` TEXT NULL AFTER `linkedin`,
ADD COLUMN `directorship_details` TEXT NULL AFTER `biography`;


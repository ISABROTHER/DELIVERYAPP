/*
  # Remove Tasks Feature

  1. Changes
    - Drop tasks table and all associated policies
    - Remove all indexes related to tasks
  
  2. Security
    - All RLS policies will be removed along with the table
*/

DROP TABLE IF EXISTS tasks CASCADE;

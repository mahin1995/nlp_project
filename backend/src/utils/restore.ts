import mongoose, { Connection, Document } from 'mongoose';
import fs from 'fs';
import path from 'path';

const mongoURI: string = 'mongodb://127.0.0.1:27017/your_database_name';

// Define the type of the data for the collections (any type for generic document)
type CollectionData = Document[];

async function restoreAllCollections() {
  // Connect to MongoDB
  await mongoose.connect(mongoURI);

  const db: Connection = mongoose.connection.db;

  // Get the list of backup files in the 'backup' folder
  const backupDir: string = './backup';
  const files = fs.readdirSync(backupDir);

  // Loop through each file (representing a collection) and restore data
  for (let file of files) {
    const collectionName: string = path.basename(file, '.json');
    const filePath: string = path.join(backupDir, file);

    // Read the data from the backup file
    const data: CollectionData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    // Insert data into the corresponding collection
    if (data.length > 0) {
      await db.collection(collectionName).insertMany(data);
      console.log(`Restored data to collection: ${collectionName}`);
    }
  }

  // Close the connection
  mongoose.connection.close();
}

// Execute the function and handle any potential errors
restoreAllCollections().catch((err: Error) => console.error('Error:', err));

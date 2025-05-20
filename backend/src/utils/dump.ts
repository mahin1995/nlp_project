import fs from 'fs';
import mongoose, { Connection, Document } from 'mongoose';

const mongoURI: string = 'mongodb://127.0.0.1:27017/your_database_name';

// Define the type of the data for the collections (any type for generic document)
type CollectionData = Document[];

// async function dumpAllCollections() {
//   // Connect to MongoDB
//   await mongoose.connect(mongoURI);

//   const db: Connection = mongoose.connection.db;

//   // Get all collections in the database
//   const collections = await db.listCollections().toArray();

//   // Loop through each collection and dump data
//   for (let collection of collections) {
//     const collectionName: string = collection.name;
//     const data: CollectionData = await db
//       .collection(collectionName)
//       .find({})
//       .toArray();

//     // Save each collection to a separate JSON file
//     const filePath: string = `./backup/${collectionName}.json`;
//     fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

//     console.log(`Backup saved for collection: ${collectionName}`);
//   }

//   // Close the connection
//   mongoose.connection.close();
// }

// Execute the function and handle any potential errors
// dumpAllCollections().catch((err: Error) => {
//   console.error('Error during backup:', err);
//   mongoose.connection.close();
// });

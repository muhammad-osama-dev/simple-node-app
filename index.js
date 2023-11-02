const { MongoClient } = require('mongodb');
const express = require('express');
const app = express();

const WEBport = process.env.MONGODB_PORT || 3000;
const DBuser = process.env.MONGODB_USERNAME;
const DBpass = process.env.MONGODB_PASSWORD;
const DBhosts = process.env.MONGODB_HOSTNAME;
const database = process.env.MONGODB_DATABASE; // Add this line to get the database name

async function main() {
    const connectionString = `mongodb://${DBuser}:${DBpass}@${DBhosts}:${WEBport}/${database}`;
    const client = new MongoClient(connectionString, { useUnifiedTopology: true }); // You may want to add options here

    try {
        await client.connect();
        console.log('Connected to MongoDB server');
        
        let db = client.db(database); // Use the database variable
        let coll = db.collection("visits");

        let collectionExists = await coll.findOne({ id: "count" });
        if (!collectionExists) {
            await coll.insertOne({ id: "count", total: 0 });
        }

        app.get('/', async (req, res) => {
            try {
                const current = await coll.findOne({ id: "count" });
                const total = current ? current.total : 0;
                await coll.updateOne({ id: "count" }, { $set: { total: total + 1 } });
                res.send("Visits: " + (total + 1));
            } catch (error) {
                console.error("Error while processing request:", error);
                res.status(500).send("Internal Server Error");
            }
        });

        app.listen(WEBport, () => {
            console.log(`App is listening on port ${WEBport}`);
        });
    } catch (e) {
        console.error('MongoDB Connection Error:', e);
    }
}

main().catch(console.error);


import { MongoClient, ObjectId } from 'mongodb';

const uri = "mongodb+srv://admin:admin@cluster0.xgp80kf.mongodb.net/?retryWrites=true&w=majority";

//Notes:Think your Mongo Database is like multiple json files

const mongoClient = new MongoClient(uri);
let db;
const collections = {
    facts: null,
    breeds: null
}

export async function Connect() {
    // Connect to database
    await mongoClient.connect();

    // Acquire databse object
    db = mongoClient.db("catsdb");

    // Get just the existing names.
    let collNames = await db.listCollections({}, { nameOnly: true }).toArray();
    collNames = collNames.map(({name}) => name);
    // console.log(`collNames total:`, collNames);

    // Filtering by collection names could make the upcoming name check just a little bit shorter.
    collNames.filter(name => collections[name] != undefined);
    // console.log(`collNames filtered:`, collNames);

    // Go through my set of collection names
    for(const nameKey in collections) {
        // And fetch it if it already exists
        if(collNames.includes(nameKey)) {
            collections[nameKey] = await db.collection(nameKey);
        }
        // otherwise create it.
        else {
            collections[nameKey] = await db.createCollection(nameKey);
        }
    }
    // console.log(`collections:`, collections);

    console.log(`Database connected.`);
}

export async function IsObjectId(stringId) {
    return await ObjectId.isValid(stringId);
}


export async function GetBreeds() {
    return await collections.breeds.find({}).toArray();
}
// Presumes to have at least 1 entry
export async function GetRandomBreed() {
    const randBreeds = await collections.breeds.aggregate([{$sample: {size:1}}]).toArray();
    return randBreeds[0];
}
export async function GetBreed(breedStringId) {
    const objectId = new ObjectId(breedStringId);
    return await collections.breeds.findOne(objectId);
}


export async function GetFacts() {
    return await collections.facts.find({}).toArray();
}
// Presumes to have at least 1 entry
export async function GetRandomFact() {
    const randFacts = await collections.facts.aggregate([{$sample: {size:1}}]).toArray();
    return randFacts[0];
}
export async function GetFact(factStringId) {
    const objectId = new ObjectId(factStringId);
    return await collections.facts.findOne(objectId);
}
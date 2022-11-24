import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import * as db from './database.js';

// CONSTANTS ------------------------------

const port = 3000;
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// SETUP ------------------------------
//this allows you to use "res.render"

app.set('view engine', 'ejs');

// ROUTES ------------------------------

app.get('/', async (req, res) => {

    const randBreed = await db.GetRandomBreed();
    // console.log(randBreed);
    const randFact = await db.GetRandomFact();
    // console.log(randFact);

    res.render('home', {
        head: {
            title: "Home"
        },
        body: {
            randBreed: randBreed,
            randFact: randFact
        }
        
    });
});

app.get('/breeds', async (req, res) => {
  
    const catBreeds = await db.GetBreeds();
    console.log(catBreeds);
  
    res.render('breeds', {
        head: {
            title: "Breeds"
        },
        body: {
            docArr_Breeds: catBreeds
        }
        
    });
});

app.get('/breeds/:breedId', async (req, res) => {
    const isValidId = await db.IsObjectId(req.params.breedId);
    console.log(`Reached cat breeds by id route <${req.params.breedId}>, is valid object id <${isValidId}>`);

    // x I don't understand why this route will randomly be called with the breedId = "main.css" or "main.js". I can't figure out how to fix this.
    // x This is also causing the client to not have access to those files.
    if(!isValidId) {
        res.end();
        return;
    }

    const catBreed = await db.GetBreed(req.params.breedId);
    console.log(catBreed);
    
    //we're getting the "breed" file and collecting the below information
    res.render('breed', {
        head: {
            title: `Breed: ${catBreed['breed']}`
        },
        body: {
            doc_Breed: catBreed
        }
        
    });
});

app.get('/facts', async (req, res) => {

    const catFacts = await db.GetFacts();
    console.log(catFacts);

    res.render('facts', {
        head: {
            title: "Facts"
        },
        body: {
            docArr_Facts: catFacts
        }
        
    });
});

app.get('/facts/:factId', async (req, res) => {
    const isValidId = await db.IsObjectId(req.params.factId);
    console.log(`Reached cat breeds by id route <${req.params.factId}>, is valid object id <${isValidId}>`);

    // x I don't understand why this route will randomly be called with the breedId = "main.css" or "main.js". I can't figure out how to fix this.
    // x This is also causing the client to not have access to those files.
    if(!isValidId) {
        res.end();
        return;
    }

    const catFact = await db.GetFact(req.params.factId);
    console.log(catFact);
  
    res.render('fact', {
        head: {
            title: `Fact`
        },
        body: {
            doc_Fact: catFact
        }
        
    });
});

// SERVER LISTEN ------------------------------

app.listen(port, async () => {
    await db.Connect();
    console.log(`Challenge 7 app listening on port ${port}!`);
});

// SEND CLIENT FOLDER ON REQUEST ------------------------------

app.use(express.static(path.join(__dirname, 'client')));





// NOTES: EJS Basic Explanation (data injection)

// const jsonData = {
//     someString: "blahblah"
//     someNum: 111
// }''

// //This like my html
// const ejsExplanationRender = `
// Using my data: 
// string is ${jsonData.someString}, 
// number is ${jsonData.someNum}, 
// `;
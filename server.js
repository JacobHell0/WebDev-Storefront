//SERVER FOR VUE FRONT END - CURRENTLY VERY BASIC TXT RETURNS

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.get('/api/server-status', (req, res) => {
    console.log("Accessing /api/serverStatus");
    res.send("If you are seeing this, the server is working :)");
});

//Serve static files
app.use(express.static(path.join(__dirname, 'dist')));

//catch all other and return index.html
app.get(/.*/, (req, res) => 
{
    console.log("Requested URL:", req.originalUrl);
    console.log("Request not caught ... returning the index.html")
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

const port = 3000; //Launch server on port 3000
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});

const express = require('express');
const app = express();
const port = 3000;ù

app.use(express.json() );
app.use( express.urlencoded( { extended: true}));

app.get('/', (req,res) => {
    res.send('Hello world');
} );

app.post('/api/v1/authentication', async (req,res) => {
    const { username, password} =( req.body );
    const user = await User.findOne({username, password}).exec();
    if(user) {
        const token = jwt.sign({username: user.username}, 'secret'); 
        //il payload è composto solo da username
        // secret è la chiave privata per firmare il token
        res.json( {
            succes: true, 
            message: 'Authentication success',
            token: token
        } );
    } else {
        res.json( { success: false, message: 'Authentication failed'} );
    }
} );

mongoose.connect(' /*stringa di connessione*/ ') 
.then( () => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
        console.log('Example app listening at ...')
    });
} );
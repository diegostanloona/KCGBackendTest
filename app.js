const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const HttpError = require('./models/http-error');
const User = require('./models/user');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', 'https://kingscrestglobaltest.web.app');
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
	next();
});

app.get('/', (req, res, next) => {
    res.json({test: "test"});
});

app.get('/users', async (req, res, next) => {
    if(req.method === 'OPTIONS'){
        return next();
    }
    let existingUsers;
    try {
        existingUsers = await User.find().lean();
    } catch (e) {
        console.log(e);
        const error = new HttpError('Something went wrong.', 500);
        return next(error);
    }
    if (!existingUsers) {
        return next(new HttpError('No users have been found.', 404));
    }

    res.json({ users: existingUsers});
});

app.use((req, res, next) => {
	return next(new HttpError('Could not find this route.', 404));
});

app.use((err, req, res, next) => {
    console.log("TEST");
    res.status(err.code || 500).json({ message: err.message || "Error." });
});

mongoose
    .connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}/${process.env.DB_NAME}?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        const server = app.listen(process.env.PORT || 5000);
        console.log("Listening on port " + (process.env.PORT || 5000));
    })
    .catch(err => {
        console.log("ERROR!!!");
        console.log(err.message);
        console.log(err);
        console.log(process.env);
    });

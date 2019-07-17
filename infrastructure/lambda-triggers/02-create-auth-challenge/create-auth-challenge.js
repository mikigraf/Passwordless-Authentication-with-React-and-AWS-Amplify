
const mongoose = require('mongoose');

let conn = null;

module.exports.handler = async (event, context) => {
    const connectionString = process.env.DB_CONNECTION_STRING

    // Make sure to add this so you can re-use `conn` between function calls.
    // See https://www.mongodb.com/blog/post/serverless-development-with-nodejs-aws-lambda-mongodb-atlas
    context.callbackWaitsForEmptyEventLoop = false;

    // Because `conn` is in the global scope, Lambda may retain it between
    // function calls thanks to `callbackWaitsForEmptyEventLoop`.
    // This means your Lambda function doesn't have to go through the
    // potentially expensive process of connecting to MongoDB every time.
    if (conn == null) {
        conn = await mongoose.createConnection(connectionString, {
        // Buffering means mongoose will queue up operations if it gets
        // disconnected from MongoDB and send them when it reconnects.
        // With serverless, better to fail fast if not connected.
        bufferCommands: false, // Disable mongoose buffering
        bufferMaxEntries: 0 // and MongoDB driver buffering
        });
    }

    const { Schema } = mongoose;
    const userSchema = new Schema({
        username: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        }
    });

    const userModel = mongoose.model('User', userSchema);

    let password;

    if(!event.request.session || !event.request.session.length) {
        // new session, so fetch password from the db
        const username = event.request.userAttributes.email;
        const user = await userModel.findOne({ "username": username});
        password = user.password;
    } else {
        // There's an existing session. Don't generate new digits but
        // re-use the code from the current session. This allows the user to
        // make a mistake when keying in the code and to then retry, rather
        // the needing to e-mail the user an all new code again.    
        const previousChallenge = event.request.session.slice(-1)[0];
        password = previousChallenge.challengeMetadata.match(/PASSWORD-(\d*)/)[1];
    }

    // This is sent back to the client app
    event.response.publicChallengeParameters = { username: event.request.userAttributes.email };

    // Add the secret login code to the private challenge parameters
    // so it can be verified by the "Verify Auth Challenge Response" trigger
    event.response.privateChallengeParameters = { password };

    // Add the secret login code to the session so it is available
    // in a next invocation of the "Create Auth Challenge" trigger
    event.response.challengeMetadata = `PASSWORD-${password}`;

    return event;

}

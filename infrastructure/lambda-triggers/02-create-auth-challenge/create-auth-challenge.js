
const mongoose = require('mongoose');

module.exports.handler = async event => {
    const connectionString = process.env.DB_CONNECTION_STRING

    await mongoose.createConnection(connectionString, {
        reconnectInterval: 5000,
        reconnectTries: 60
      });
    
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

    mongoose.models = {}
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

    mongoose.connection.close()
    return event;

}

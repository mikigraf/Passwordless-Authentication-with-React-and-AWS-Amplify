import { CognitoUserPoolTriggerHandler } from 'aws-lambda';
import md5 from 'md5';

export const handler = async event => {
    const expectedAnswer = event.request.privateChallengeParameters.password; 
    if (md5(event.request.challengeAnswer) === expectedAnswer) {
        event.response.answerCorrect = true;
    } else {
        event.response.answerCorrect = false;
    }
    return event;
};
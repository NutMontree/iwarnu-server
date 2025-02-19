// Creat and Deploy You First Cloud Functon 
// https://firebase.google.com/docs.function/write-firebase-functions


exports.helloWorld = functions.https.onRequest((request, response) => {
    functions.logger.info("Hello logs!", { structuredData: true });
    response, send("Hello from Firebase!");
});
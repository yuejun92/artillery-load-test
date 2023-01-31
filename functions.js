module.exports = {
  processData: processData,
  statusReady: statusReady,
};

const https = require("https");

function statusReady(context, next) {
  const continueLooping = context.vars.processedData.continueLoop;
  // continue the loop in the test scenario.
  return next(continueLooping);
}

async function processData(requestParams, response, context, ee, next) {
  let body = JSON.parse(response.body);
  let waitingIntervalTime = parseInt(body.waitingIntervalTime);
  let queueNumber = body.queueNumber;
  let cookie = response.headers["set-cookie"];

  if (cookie) {
    console.log("First: Queue: " + queueNumber + ", Delay: " + waitingIntervalTime);
    context.vars.processedData = {
      queueNumber: queueNumber,
      cookie: cookie,
      continueLoop: true,
    };
  } else if (body.url) {
    console.log("Queue: " + context.vars.processedData.queueNumber + " redirected");
    context.vars.processedData.continueLoop = false;
    // await httpsRequest(body.url);
  } else {
    console.log("Queue: " + queueNumber + ", Delay: " + waitingIntervalTime);
  }

  await delay(waitingIntervalTime * 1000);

  return next();
}

function httpsRequest(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      console.log("statusCode:", res.statusCode);
      resolve(res);
    });
  });
}

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

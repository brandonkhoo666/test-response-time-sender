const express = require("express");
const { default: axios } = require("axios");
const { maxBy, minBy } = require("lodash");

const app = express();
app.use(express.json());

app.listen(2000, () => {
  console.log("App listening port 2000...");
});

async function send(url, index) {
  try {
    const start = Date.now();
    const response = await axios({
      method: "POST",
      url: url,
      params: {},
      headers: {
        "Content-Type": "application/json",
      },
      data: {},
    });
    const end = Date.now();
    console.log(`Test ${index + 1} done.`);

    return {
      alphaSendAt: start,
      alphaReceiveAt: end,
      alphaTimeTaken: response.data.receiveTime - start,
      betaReceiveAt: response.data.receiveTime,
      betaSendAt: response.data.responseTime,
      betaTimeTaken: end - response.data.responseTime,
      totalTimeTaken: end - start,
    };
  } catch (error) {
    if (error.code === "ECONNRESET") {
      console.log("Connection reset, retrying after 1 second...");
      // Retry logic
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Retry after 1 second
      return send(url, index); // Retry the request
    } else {
      console.error(error);
      throw error;
    }
  }
}

app.post("/api/sendRequest", async (req, res) => {
  const { url, limit } = req.body;
  let timestamps = [];
  const promises = [];

  for (let index = 0; index < limit; index++) {
    promises.push(send(url, index));
  }

  const results = await Promise.all(promises);
  for (let index = 0; index < results.length; index++) {
    const result = results[index];
    timestamps.push(result);
  }

  const data = {
    minAlphaTimeTaken: minBy(timestamps, "alphaTimeTaken").alphaTimeTaken,
    maxAlphaTimeTaken: maxBy(timestamps, "alphaTimeTaken").alphaTimeTaken,
    minBetaTimeTaken: minBy(timestamps, "betaTimeTaken").betaTimeTaken,
    maxBetaTimeTaken: maxBy(timestamps, "betaTimeTaken").betaTimeTaken,
    minTotalTimeTaken: minBy(timestamps, "totalTimeTaken").totalTimeTaken,
    maxTotalTimeTaken: maxBy(timestamps, "totalTimeTaken").totalTimeTaken,
  };

  res.status(200).send(data);
});

app.post("/api/receiveRequest", async (req, res) => {
  try {
    const now = Date.now();
    console.log(`Received.`);
    const data = {
      receiveTime: now,
      responseTime: Date.now(),
    };
    res.status(200).send(data);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

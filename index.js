const express = require("express");
const path = require("path");
const nunjucks = require("nunjucks");
const twilio = require("twilio");
const cors = require("cors");

const AccessToken = twilio.jwt.AccessToken;

const app = express();
const VoiceGrant = AccessToken.VoiceGrant;
const { config } = require("./.config.js");

app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(express.json());

app.use("/static", express.static(path.join(__dirname, "static")));
app.use(cors());

nunjucks.configure("templates", {
  autoescape: true,
  express: app,
  watch: true,
});

const twilioClient = new twilio(config.account_sid, config.auth_token);
app.get("/", (req, res) => {
  res.render("home.html", { title: "In browser calls" });
});

app.get("/token", (req, res) => {
  const accessToken = new AccessToken(config.account_sid, config.api_key, config.api_key_secret);
  accessToken.identity = config.twilio_number; // should be unique

  const grant = new VoiceGrant({
    outgoingApplicationSid: config.twiml_app_sid,
    incomingAllow: true,
  });
  accessToken.addGrant(grant);

  res.setHeader("Content-Type", "application/json");
  res.send(JSON.stringify({ token: accessToken.toJwt() }));
});

app.get("/handle-calls", twilio.webhook({ validate: false }), (req, res) => {
  console.log("\nhandle-calls");
  console.log("Body:", JSON.stringify(req.body));
  console.log("Params:", JSON.stringify(req.params));
  console.log("Query:", JSON.stringify(req.query));

  let callerId = config.twilio_number;
  let twiml = new twilio.twiml.VoiceResponse();

  let dial = twiml.dial({ callerId: callerId });
  if (req.query.To && req.query.To != callerId) {
    console.log("Outbound Call");
    dial.number(
      {
        statusCallbackEvent: "initiated ringing answered completed",
        statusCallback: "/callback-status",
        statusCallbackMethod: "GET",
      },
      req.query.To
    );
  } else {
    console.log("Inbound Call");
    let caller = req.query.To;
    dial.number(
      {
        statusCallbackEvent: "initiated, ringing, answered, completed",
        statusCallback: "/callback-status",
        statusCallbackMethod: "GET",
      },
      caller
    );
    dial.client(config.twilio_number);
  }
  console.log("Response Body:", twiml.toString());
  res.send(twiml.toString());
});

/**
 * key is to_number and value is string[]
 * @type {Object.<string,string[]>}
 * @constant
 * */
const eventsByNumber = {};

/** @typedef {object} CallbackEvent
 * @property {string} Called
 * @property {string} ParentCallSid
 * @property {string} ToState
 * @property {string} CallerCountry
 * @property {string} Direction
 * @property {string} Timestamp
 * @property {string} CallbackSource
 * @property {string} CallerState
 * @property {string} ToZip
 * @property {string} SequenceNumber
 * @property {string} CallSid
 * @property {string} To
 * @property {string} CallerZip
 * @property {string} ToCountry
 * @property {string} CalledZip
 * @property {string} ApiVersion
 * @property {string} CalledCity
 * @property {string} CallStatus
 * @property {string} From
 * @property {string} AccountSid
 * @property {string} CalledCountry
 * @property {string} CallerCity
 * @property {string} ToCity
 * @property {string} FromCountry
 * @property {string} Caller
 * @property {string} FromCity
 * @property {string} CalledState
 * @property {string} FromZip
 * @property {string} FromState
 */

app.get("/callback-status", (req, res) => {
  console.log("\nCallback-status");
  console.log("Body:", JSON.stringify(req.body));
  console.log("Params:", JSON.stringify(req.params));
  console.log("Query:", JSON.stringify(req.query));

  /**
   * @type {CallbackEvent}
   */
  const query = req.query;
  const key = `${query.To.slice(1)}_${query.From.slice(1)}`;

  if (eventsByNumber[key]) {
    eventsByNumber[key].push(query.CallStatus);
  } else {
    console.log("\n eventByNumber not found", Object.keys(eventsByNumber));
  }

  if (responses[key]) {
    console.log("\n response sent:", eventsByNumber[key]);
    responses[key].write(`data: ${JSON.stringify(eventsByNumber[key])} \n\n`);
  } else {
    console.log("\n Response not found", Object.keys(responses));
  }

  return res.send("<response></response>");
});

/**
 * @type {Object.<string>}
 */
const responses = {};
app.get("/getEvents", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders(); // ack

  /**
   * @type {{
   *  to: string,
   *  from: string
   * }}
   */
  const query = req.query;
  if (!query.to || !query.from) {
    res.write("event: closed\n");
    res.write("data: req query error\n\n");
    return;
  }

  const key = `${query.to.slice(1)}_${query.from.slice(1)}`;
  res.on("close", () => {
    console.log("response closed by client");
    res.end();

    // clean up
    console.log(key);
    delete responses[key];
    delete eventsByNumber[key];
  });

  if (eventsByNumber[key]) {
    eventsByNumber[key] = [];
    console.log("\n response sent:", eventsByNumber[key]);
    res.write("event: closed\n");
    res.write(`data: ${JSON.stringify(eventsByNumber[key])} \n\n`);
    return;
  } else {
    eventsByNumber[key] = [];
  }

  responses[key] = res;
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});

const express = require("express");
const path = require("path");
const nunjucks = require("nunjucks");
const twilio = require("twilio");
const cors = require("cors");
const { config } = require("./.config.js");
const { configureServerSentEvent } = require("./server_sent_event.js");
const morgan = require("morgan");
const { twiml } = require("twilio");

const app = express();

const AccessToken = twilio.jwt.AccessToken;
const VoiceGrant = AccessToken.VoiceGrant;
const logger = morgan("dev");

app.use(logger);

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
  console.log("Body:", JSON.stringify(req.body));
  console.log("Params:", JSON.stringify(req.params));
  console.log("Query:", JSON.stringify(req.query));

  let callerId = config.twilio_number;
  let twiml = new twilio.twiml.VoiceResponse();

  if (req.query.To && req.query.To != callerId) {
    console.log("Outbound Call");
    twiml.dial({ callerId: callerId }).number(
      {
        statusCallbackEvent: "queued initiated ringing in-progress completed busy failed no-answer",
        statusCallback: "/callback-status",
        statusCallbackMethod: "GET",
      },
      req.query.To
    );
  } else {
    console.log("Inbound Call");
    let caller = req.query.To;
    // .client is for dialing or transferring call to registered identity.

    // Adding Voice mail support
    twiml.dial({ callerId: callerId, timeout: 20 }).client(
      config.twilio_number
    );
    twiml.say("Your call could not be answered at the moment. Please leave a voice message.")
    twiml.record({
      maxLength: 120,
      playBeep: true,
      action: "/recording",
      method: "GET"
    })
  }
  console.log("Response Body:", twiml.toString());
  console.log("\n");
  res.send(twiml.toString());
});

app.get("/callback-status-client", (req, res) => {
  const callbackQuery = req.query;
  console.log(callbackQuery.CallStatus);
  if (callbackQuery.CallStatus === "no-answer") {
    let twiml = new twilio.twiml.VoiceResponse();
    const say = twiml.say("Your call could not be answered at the moment. Please leave a voice message.");
    console.log(twiml.toString());
    res.send(twiml.toString());
  }
});

app.get("/recording", (req, res) => {
  console.log(req.query)
  res.sendStatus(200);
});

/**
 * Configuring server sent events
 */
// configureServerSentEvent(app);

app.listen(8000, () => {
  console.log("listening on port 8000");
});

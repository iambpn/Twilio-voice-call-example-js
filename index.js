const express = require("express");
const path = require("path");
const nunjucks = require("nunjucks");
const twilio = require("twilio");
const cors = require("cors");

const AccessToken = twilio.jwt.AccessToken;

const app = express();
const VoiceGrant = AccessToken.VoiceGrant;
const { config } = require("./.config.js");

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

app.get("/callback-status", (req, res) => {
  console.log("\nCallback-status");
  console.log("Body:", JSON.stringify(req.body));
  console.log("Params:", JSON.stringify(req.params));
  console.log("Query:", JSON.stringify(req.query));

  setTimeout(() => {
    twilioClient
      .calls(req.query.ParentCallSid)
      .userDefinedMessages.create({
        content: JSON.stringify({
          key1: "Hello from the server side.",
        }),
      })
      .then((user_defined_message) => console.log(user_defined_message.sid));
  }, 5000);

  return res.send("<response></response>");
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});

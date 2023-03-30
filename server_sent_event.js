/**
 * key is to_number and value is string[]
 * @type {Object.<string,string[]>}
 * @constant
 * */
const eventsByNumber = {};

/**
 * @type {Object.<string>}
 */
const responses = {};

function configureServerSentEvent(app) {
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
}

module.exports = {
  configureServerSentEvent,
};

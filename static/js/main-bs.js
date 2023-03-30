$(function () {
  var device;
  var sse;
  var from_number = "+19049064208";
  var to_number;

  var base_url = "http://localhost:3000/api/v1/inboxes/voice-calls";
  var token = `eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImpPS2hLY3g2bUJUYUFsc1RORXF3LSJ9.eyJodHRwOi8vbG9jYWxob3N0OjMwMDAvb3JnX2lkIjp7ImlkIjoib3JnX1FrZWQ0a3FxVjltSXlDSFIiLCJkaXNwbGF5X25hbWUiOiJla2JhbmEiLCJuYW1lIjoiZWtiYW5hIn0sImlzcyI6Imh0dHBzOi8vZGV2LXlua2hrLXRpLnVzLmF1dGgwLmNvbS8iLCJzdWIiOiJhdXRoMHw2MmI5NjBjNDM5NzFhYzc1ZTI3NzFjNDMiLCJhdWQiOlsiaHR0cDovL2xvY2FsaG9zdDozMDAwL2FwaS92MSIsImh0dHBzOi8vZGV2LXlua2hrLXRpLnVzLmF1dGgwLmNvbS91c2VyaW5mbyJdLCJpYXQiOjE2Nzk5NzQ5NDMsImV4cCI6MTY4MDA2MTM0MywiYXpwIjoiOUlrR0FvcUVsdEhnaTJIOFZhS2Z0cnc1V0RhTTFZb3MiLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIiwicGVybWlzc2lvbnMiOlsiYWN0aXZpdGllczpjcmVhdGUiLCJhY3Rpdml0aWVzOmRlbGV0ZSIsImFjdGl2aXRpZXM6ZWRpdCIsImFjdGl2aXRpZXM6dmlldyIsImNhbXBhaWduczpjcmVhdGUiLCJjYW1wYWlnbnM6ZGVsZXRlIiwiY2FtcGFpZ25zOmVkaXQiLCJjYW1wYWlnbnM6dmlldyIsImNvbnRhY3RzOmFsbDpjcmVhdGUiLCJjb250YWN0czphbGw6ZGVsZXRlIiwiY29udGFjdHM6YWxsOmVkaXQiLCJjb250YWN0czphbGw6dmlldyIsImNvbnRhY3RzOm5hbWVfb3JnX2NvbnRhY3RfaW5mb19ub25fZm9sbG93ZWQ6Y3JlYXRlIiwiY29udGFjdHM6bmFtZV9vcmdfY29udGFjdF9pbmZvX25vbl9mb2xsb3dlZDpkZWxldGUiLCJjb250YWN0czpuYW1lX29yZ19jb250YWN0X2luZm9fbm9uX2ZvbGxvd2VkOmVkaXQiLCJjb250YWN0czpuYW1lX29yZ19jb250YWN0X2luZm9fbm9uX2ZvbGxvd2VkOnZpZXciLCJjb250YWN0czp1c2Vyc19hbmRfZm9sbG93ZWRfY29udGFjdHM6Y3JlYXRlIiwiY29udGFjdHM6dXNlcnNfYW5kX2ZvbGxvd2VkX2NvbnRhY3RzOmRlbGV0ZSIsImNvbnRhY3RzOnVzZXJzX2FuZF9mb2xsb3dlZF9jb250YWN0czplZGl0IiwiY29udGFjdHM6dXNlcnNfYW5kX2ZvbGxvd2VkX2NvbnRhY3RzOnZpZXciLCJkZWFsczpjcmVhdGUiLCJkZWFsczpkZWxldGUiLCJkZWFsczplZGl0IiwiZGVhbHM6dmlldyIsImZvcm1zOmNyZWF0ZSIsImZvcm1zOmRlbGV0ZSIsImZvcm1zOmVkaXQiLCJmb3Jtczp2aWV3IiwiaW5ib3hlczpzaGFyZWQ6Y3JlYXRlIiwiaW5ib3hlczpzaGFyZWQ6ZGVsZXRlIiwiaW5ib3hlczpzaGFyZWQ6ZWRpdCIsImluYm94ZXM6c2hhcmVkOnZpZXciLCJpbmJveGVzOnVzZXI6Y3JlYXRlIiwiaW5ib3hlczp1c2VyOmRlbGV0ZSIsImluYm94ZXM6dXNlcjplZGl0IiwiaW5ib3hlczp1c2VyOnZpZXciLCJwaXBlbGluZXM6YWxsOmNyZWF0ZSIsInBpcGVsaW5lczphbGw6ZGVsZXRlIiwicGlwZWxpbmVzOmFsbDplZGl0IiwicGlwZWxpbmVzOmFsbDp2aWV3IiwicGlwZWxpbmVzOmR5bmFtaWM6Y3JlYXRlIiwicGlwZWxpbmVzOmR5bmFtaWM6ZGVsZXRlIiwicGlwZWxpbmVzOmR5bmFtaWM6ZWRpdCIsInBpcGVsaW5lczpkeW5hbWljOnZpZXciLCJwcm9kdWN0c19zZXJ2aWNlczpjcmVhdGUiLCJwcm9kdWN0c19zZXJ2aWNlczpkZWxldGUiLCJwcm9kdWN0c19zZXJ2aWNlczplZGl0IiwicHJvZHVjdHNfc2VydmljZXM6dmlldyIsInF1b3Rlc19pbnZvaWNlczpjcmVhdGUiLCJxdW90ZXNfaW52b2ljZXM6ZGVsZXRlIiwicXVvdGVzX2ludm9pY2VzOmVkaXQiLCJxdW90ZXNfaW52b2ljZXM6dmlldyIsInJlcG9ydHNfYWN0aXZpdHk6dmlldyIsInJlcG9ydHNfY2FtcGFpZ25zOnZpZXciLCJyZXBvcnRzX2NvbnZlcnNhdGlvbnM6dmlldyIsInJlcG9ydHNfZm9yZWNhc3Q6dmlldyIsInJlcG9ydHNfZnVubmVsX2FuYWx5c2lzOnZpZXciLCJyZXBvcnRzX2luc2lnaHRzOnZpZXciLCJyZXBvcnRzX2tub3dsZWRnZV9iYXNlczp2aWV3IiwicmVwb3J0c19sb3NzZXM6dmlldyIsInJlcG9ydHNfbmV3X2RlYWxzOnZpZXciLCJyZXBvcnRzX3BpcGVsaW5lX3NpemU6dmlldyIsInJlcG9ydHNfcmV2aWV3czp2aWV3IiwicmVwb3J0c19zYWxlczp2aWV3IiwicmVwb3J0c19zZW50aW1lbnQ6dmlldyIsInJlcG9ydHNfc3VydmV5czp2aWV3IiwicmV2aWV3X3Byb2ZpbGVzOmNyZWF0ZSIsInJldmlld19wcm9maWxlczpkZWxldGUiLCJyZXZpZXdfcHJvZmlsZXM6ZWRpdCIsInJldmlld19wcm9maWxlczp2aWV3Iiwic2V0dGluZ3NfYWNjb3VudF9zZXR0aW5nczpjcmVhdGUiLCJzZXR0aW5nc19hY2NvdW50X3NldHRpbmdzOmRlbGV0ZSIsInNldHRpbmdzX2FjY291bnRfc2V0dGluZ3M6ZWRpdCIsInNldHRpbmdzX2FjY291bnRfc2V0dGluZ3M6dmlldyIsInNldHRpbmdzX2F1dG9tYXRpb25zOmNyZWF0ZSIsInNldHRpbmdzX2F1dG9tYXRpb25zOmRlbGV0ZSIsInNldHRpbmdzX2F1dG9tYXRpb25zOmVkaXQiLCJzZXR0aW5nc19hdXRvbWF0aW9uczp2aWV3Iiwic2V0dGluZ3NfZXhwb3J0X3VzZXJzX2RhdGE6Y3JlYXRlIiwic2V0dGluZ3NfZXhwb3J0X3VzZXJzX2RhdGE6ZGVsZXRlIiwic2V0dGluZ3NfZXhwb3J0X3VzZXJzX2RhdGE6ZWRpdCIsInNldHRpbmdzX2V4cG9ydF91c2Vyc19kYXRhOnZpZXciLCJzZXR0aW5nc19rbm93bGVkZ2VfYmFzZXM6Y3JlYXRlIiwic2V0dGluZ3Nfa25vd2xlZGdlX2Jhc2VzOmRlbGV0ZSIsInNldHRpbmdzX2tub3dsZWRnZV9iYXNlczplZGl0Iiwic2V0dGluZ3Nfa25vd2xlZGdlX2Jhc2VzOnZpZXciLCJzZXR0aW5nc19yZXZpZXdfc2V0dGluZ3M6Y3JlYXRlIiwic2V0dGluZ3NfcmV2aWV3X3NldHRpbmdzOmRlbGV0ZSIsInNldHRpbmdzX3Jldmlld19zZXR0aW5nczplZGl0Iiwic2V0dGluZ3NfcmV2aWV3X3NldHRpbmdzOnZpZXciLCJzZXR0aW5nc19zaGFyZWRfaW5ib3hfc2V0dGluZ3M6Y3JlYXRlIiwic2V0dGluZ3Nfc2hhcmVkX2luYm94X3NldHRpbmdzOmRlbGV0ZSIsInNldHRpbmdzX3NoYXJlZF9pbmJveF9zZXR0aW5nczplZGl0Iiwic2V0dGluZ3Nfc2hhcmVkX2luYm94X3NldHRpbmdzOnZpZXciLCJzZXR0aW5nc191c2VyX2FwaV9hY2Nlc3M6Y3JlYXRlIiwic2V0dGluZ3NfdXNlcl9hcGlfYWNjZXNzOmRlbGV0ZSIsInNldHRpbmdzX3VzZXJfYXBpX2FjY2VzczplZGl0Iiwic2V0dGluZ3NfdXNlcl9hcGlfYWNjZXNzOnZpZXciLCJzZXR0aW5nc191c2Vyc19pbmJveF9zZXR0aW5nczpjcmVhdGUiLCJzZXR0aW5nc191c2Vyc19pbmJveF9zZXR0aW5nczpkZWxldGUiLCJzZXR0aW5nc191c2Vyc19pbmJveF9zZXR0aW5nczplZGl0Iiwic2V0dGluZ3NfdXNlcnNfaW5ib3hfc2V0dGluZ3M6dmlldyIsInNldHRpbmdzX3VzZXJzX293bl9zZXR0aW5nczpjcmVhdGUiLCJzZXR0aW5nc191c2Vyc19vd25fc2V0dGluZ3M6ZGVsZXRlIiwic2V0dGluZ3NfdXNlcnNfb3duX3NldHRpbmdzOmVkaXQiLCJzZXR0aW5nc191c2Vyc19vd25fc2V0dGluZ3M6dmlldyIsInN1cnZleXM6Y3JlYXRlIiwic3VydmV5czpkZWxldGUiLCJzdXJ2ZXlzOmVkaXQiLCJzdXJ2ZXlzOnZpZXciLCJ0ZWFtX2NoYXRfY2hhbm5lbHM6YWxsOmNyZWF0ZSIsInRlYW1fY2hhdF9jaGFubmVsczphbGw6ZGVsZXRlIiwidGVhbV9jaGF0X2NoYW5uZWxzOmFsbDplZGl0IiwidGVhbV9jaGF0X2NoYW5uZWxzOmFsbDp2aWV3IiwidGVhbV9jaGF0X2NoYW5uZWxzOmR5bmFtaWM6Y3JlYXRlIiwidGVhbV9jaGF0X2NoYW5uZWxzOmR5bmFtaWM6ZGVsZXRlIiwidGVhbV9jaGF0X2NoYW5uZWxzOmR5bmFtaWM6ZWRpdCIsInRlYW1fY2hhdF9jaGFubmVsczpkeW5hbWljOnZpZXciXX0.NIaWF2Bj828xI05eFXQFeLVIZ6UwMuFg40yALj02Dg4iDQyc74ZHbKLBZx54ZKue99oSgBtaaWeAqn5Jbm5dE4CTe1rDDsdR9jVnvehtoQkNpfbAh7hmRuA-uIbH7gckw_H0BNvGW8DwbQdzhL2eWbztGWNOWR5rCiU8DHiffv-3_GedQA3BhQREqDM5uEVNHh9kY9Lblu1ETgKtrX1Hutdqz6LWecIHxY0Ms5m9qpvgBbUt2XOXWg8BJZhR8pyqy08bl_F3ImlsPj-vMhYiFfoSOh_7mwBY4RxG0FNr3Z0TIFe2jBZtpK2vEkyjecgxyJT7P-N8JEqzItvCop02LQ`;
  if (!base_url || !token) {
    alert("Url or Token is empty");
    return;
  }

  log("Requesting Access Token...");
  // Using a relative link to access the Voice Token function
  // Making api call
  fetch(`${base_url}/token`, {
    headers: new Headers({
      Authorization: `Bearer ${token}`,
    }),
  })
    .then(function (data) {
      return data.json();
    })
    .then(function (data) {
      log("Got a token.");
      data.token = data.token ?? data.data.token;
      console.log("Token: " + data.token);

      // Setup Twilio.Device
      device = new Twilio.Device(data.token, {
        // Set Opus as our preferred codec. Opus generally performs better, requiring less bandwidth and
        // providing better audio quality in restrained network conditions. Opus will be default in 2.0.
        codecPreferences: ["opus", "pcmu"],
        // Use fake DTMF tones client-side. Real tones are still sent to the other end of the call,
        // but the client-side DTMF tones are fake. This prevents the local mic capturing the DTMF tone
        // a second time and sending the tone twice. This will be default in 2.0.
        fakeLocalDTMF: true,
        // Use `enableRingingState` to enable the device to emit the `ringing`
        // state. The TwiML backend also needs to have the attribute
        // `answerOnBridge` also set to true in the `Dial` verb. This option
        // changes the behavior of the SDK to consider a call `ringing` starting
        // from the connection to the TwiML backend to when the recipient of
        // the `Dial` verb answers.
        enableRingingState: true,
        debug: true,
      });

      device.on("ready", function (device) {
        log("Twilio.Device Ready!");
      });

      device.on("error", function (error) {
        log("Twilio.Device Error: " + error.message);
        sse && sse.close();
      });

      device.on("connect", function (conn) {
        log("Successfully established call ! ");
        $("#modal-call-in-progress").modal("show");
      });

      device.on("disconnect", function (conn) {
        log("Call ended.");
        sse && sse.close();
        $(".modal").modal("hide");
      });

      device.on("incoming", function (conn) {
        console.log(conn.parameters);
        log("Incoming connection from " + conn.parameters.From);
        $("#callerNumber").text(conn.parameters.From);
        $("#txtPhoneNumber").text(conn.parameters.From);

        $("#modal-incomming-call").modal("show");

        $(".btnReject").bind("click", function () {
          $(".modal").modal("hide");
          log("Rejected call ...");
          conn.reject();
        });

        $(".btnAcceptCall").bind("click", function () {
          $(".modal").modal("hide");
          log("Accepted call ...");
          conn.accept();
        });
      });
    })
    .catch(function (err) {
      console.log(err);
      log("Could not get a token from server!");
      sse && sse.close();
    });

  // Bind button to make call
  $("#btnDial").bind("click", async function () {
    $("#modal-dial").modal("hide");
    to_number = document.getElementById("phoneNumber").value;

    // get the phone number to connect the call to
    var params = {
      From: from_number,
      To: to_number,
      // you can add additional data to sent to backend here
    };

    // output destination number
    $("#txtPhoneNumber").text(params.To);

    console.log("Calling " + params.To + "...");
    if (device) {
      var outgoingConnection = await device.connect(params);
      outgoingConnection.on("ringing", function () {
        log("Ringing...");
        // initiateSSE(to_number.slice(1), from_number.slice(1));
      });
    }
  });

  // Bind button to hangup call
  $(".btnHangUp").bind("click", function () {
    $(".modal").modal("hide");
    log("Hanging up...");
    if (device) {
      device.disconnectAll();
    }
  });

  // SSE - Server Sent Event
  function initiateSSE(to, from) {
    console.log(to, from);
    sse = new EventSourcePolyfill(`${base_url}/sse?To=${to}&From=${from}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    sse.addEventListener("message", function (event) {
      console.log("message", event);
      log(`server-side event: ${event.data}`);
    });

    sse.addEventListener("onStatusUpdate", function (event) {
      console.log("message", event);
      log(`server-side event: ${event.data}`);
    });

    sse.addEventListener("onInitialStatus", function (event) {
      console.log("message", event);
      log(`Initial server-side event: ${event.data}`);
    });

    sse.addEventListener("closed", (event) => {
      console.log("closed", event);
      sse.close();
      console.log("SSE connection Closed");
      log(`connection to server closed`);
    });

    sse.addEventListener("error", (error) => {
      console.log("Error", error);
      sse.close();
      console.log("SSE connection Closed on error");
    });

    console.log("Event source Initialized and started");
  }

  // Activity log
  function log(message) {
    var logDiv = document.getElementById("log");
    logDiv.innerHTML += "<p>&gt;&nbsp;" + message + "</p>";
    logDiv.scrollTop = logDiv.scrollHeight;
  }
});

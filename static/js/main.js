$(function () {
  var device;
  var sse;
  var from_number = "+19049064208";
  var to_number;

  var base_url = "http://localhost:3000/api/v1/inboxes/voice-calls";
  var token = `eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImpPS2hLY3g2bUJUYUFsc1RORXF3LSJ9.eyJodHRwOi8vbG9jYWxob3N0OjMwMDAvb3JnX2lkIjp7ImlkIjoib3JnX1FrZWQ0a3FxVjltSXlDSFIiLCJkaXNwbGF5X25hbWUiOiJFa2JhbmEgU29sdXRpb25zIiwibmFtZSI6ImVrYmFuYSJ9LCJpc3MiOiJodHRwczovL2Rldi15bmtoay10aS51cy5hdXRoMC5jb20vIiwic3ViIjoiYXV0aDB8NjJiOTYwYzQzOTcxYWM3NWUyNzcxYzQzIiwiYXVkIjpbImh0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9hcGkvdjEiLCJodHRwczovL2Rldi15bmtoay10aS51cy5hdXRoMC5jb20vdXNlcmluZm8iXSwiaWF0IjoxNjcyMDMzMDczLCJleHAiOjE2NzIxMTk0NzMsImF6cCI6IjlJa0dBb3FFbHRIZ2kySDhWYUtmdHJ3NVdEYU0xWW9zIiwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCIsInBlcm1pc3Npb25zIjpbImFjdGl2aXRpZXM6Y3JlYXRlIiwiYWN0aXZpdGllczpkZWxldGUiLCJhY3Rpdml0aWVzOmVkaXQiLCJhY3Rpdml0aWVzOnZpZXciLCJjYW1wYWlnbnM6Y3JlYXRlIiwiY2FtcGFpZ25zOmRlbGV0ZSIsImNhbXBhaWduczplZGl0IiwiY2FtcGFpZ25zOnZpZXciLCJjb250YWN0czphbGw6Y3JlYXRlIiwiY29udGFjdHM6YWxsOmRlbGV0ZSIsImNvbnRhY3RzOmFsbDplZGl0IiwiY29udGFjdHM6YWxsOnZpZXciLCJjb250YWN0czpuYW1lX29yZ19jb250YWN0X2luZm9fbm9uX2ZvbGxvd2VkOmNyZWF0ZSIsImNvbnRhY3RzOm5hbWVfb3JnX2NvbnRhY3RfaW5mb19ub25fZm9sbG93ZWQ6ZGVsZXRlIiwiY29udGFjdHM6bmFtZV9vcmdfY29udGFjdF9pbmZvX25vbl9mb2xsb3dlZDplZGl0IiwiY29udGFjdHM6bmFtZV9vcmdfY29udGFjdF9pbmZvX25vbl9mb2xsb3dlZDp2aWV3IiwiY29udGFjdHM6dXNlcnNfYW5kX2ZvbGxvd2VkX2NvbnRhY3RzOmNyZWF0ZSIsImNvbnRhY3RzOnVzZXJzX2FuZF9mb2xsb3dlZF9jb250YWN0czpkZWxldGUiLCJjb250YWN0czp1c2Vyc19hbmRfZm9sbG93ZWRfY29udGFjdHM6ZWRpdCIsImNvbnRhY3RzOnVzZXJzX2FuZF9mb2xsb3dlZF9jb250YWN0czp2aWV3IiwiZGVhbHM6Y3JlYXRlIiwiZGVhbHM6ZGVsZXRlIiwiZGVhbHM6ZWRpdCIsImRlYWxzOnZpZXciLCJmb3JtczpjcmVhdGUiLCJmb3JtczpkZWxldGUiLCJmb3JtczplZGl0IiwiZm9ybXM6dmlldyIsImluYm94ZXM6c2hhcmVkOmNyZWF0ZSIsImluYm94ZXM6c2hhcmVkOmRlbGV0ZSIsImluYm94ZXM6c2hhcmVkOmVkaXQiLCJpbmJveGVzOnNoYXJlZDp2aWV3IiwiaW5ib3hlczp1c2VyOmNyZWF0ZSIsImluYm94ZXM6dXNlcjpkZWxldGUiLCJpbmJveGVzOnVzZXI6ZWRpdCIsImluYm94ZXM6dXNlcjp2aWV3IiwicGlwZWxpbmVzOmFsbDpjcmVhdGUiLCJwaXBlbGluZXM6YWxsOmRlbGV0ZSIsInBpcGVsaW5lczphbGw6ZWRpdCIsInBpcGVsaW5lczphbGw6dmlldyIsInBpcGVsaW5lczpkeW5hbWljOmNyZWF0ZSIsInBpcGVsaW5lczpkeW5hbWljOmRlbGV0ZSIsInBpcGVsaW5lczpkeW5hbWljOmVkaXQiLCJwaXBlbGluZXM6ZHluYW1pYzp2aWV3IiwicHJvZHVjdHNfc2VydmljZXM6Y3JlYXRlIiwicHJvZHVjdHNfc2VydmljZXM6ZGVsZXRlIiwicHJvZHVjdHNfc2VydmljZXM6ZWRpdCIsInByb2R1Y3RzX3NlcnZpY2VzOnZpZXciLCJxdW90ZXNfaW52b2ljZXM6Y3JlYXRlIiwicXVvdGVzX2ludm9pY2VzOmRlbGV0ZSIsInF1b3Rlc19pbnZvaWNlczplZGl0IiwicXVvdGVzX2ludm9pY2VzOnZpZXciLCJyZXBvcnRzX2FjdGl2aXR5OnZpZXciLCJyZXBvcnRzX2NhbXBhaWduczp2aWV3IiwicmVwb3J0c19jb252ZXJzYXRpb25zOnZpZXciLCJyZXBvcnRzX2ZvcmVjYXN0OnZpZXciLCJyZXBvcnRzX2Z1bm5lbF9hbmFseXNpczp2aWV3IiwicmVwb3J0c19pbnNpZ2h0czp2aWV3IiwicmVwb3J0c19rbm93bGVkZ2VfYmFzZXM6dmlldyIsInJlcG9ydHNfbG9zc2VzOnZpZXciLCJyZXBvcnRzX25ld19kZWFsczp2aWV3IiwicmVwb3J0c19waXBlbGluZV9zaXplOnZpZXciLCJyZXBvcnRzX3Jldmlld3M6dmlldyIsInJlcG9ydHNfc2FsZXM6dmlldyIsInJlcG9ydHNfc2VudGltZW50OnZpZXciLCJyZXBvcnRzX3N1cnZleXM6dmlldyIsInJldmlld19wcm9maWxlczpjcmVhdGUiLCJyZXZpZXdfcHJvZmlsZXM6ZGVsZXRlIiwicmV2aWV3X3Byb2ZpbGVzOmVkaXQiLCJyZXZpZXdfcHJvZmlsZXM6dmlldyIsInNldHRpbmdzX2FjY291bnRfc2V0dGluZ3M6Y3JlYXRlIiwic2V0dGluZ3NfYWNjb3VudF9zZXR0aW5nczpkZWxldGUiLCJzZXR0aW5nc19hY2NvdW50X3NldHRpbmdzOmVkaXQiLCJzZXR0aW5nc19hY2NvdW50X3NldHRpbmdzOnZpZXciLCJzZXR0aW5nc19hdXRvbWF0aW9uczpjcmVhdGUiLCJzZXR0aW5nc19hdXRvbWF0aW9uczpkZWxldGUiLCJzZXR0aW5nc19hdXRvbWF0aW9uczplZGl0Iiwic2V0dGluZ3NfYXV0b21hdGlvbnM6dmlldyIsInNldHRpbmdzX2V4cG9ydF91c2Vyc19kYXRhOmNyZWF0ZSIsInNldHRpbmdzX2V4cG9ydF91c2Vyc19kYXRhOmRlbGV0ZSIsInNldHRpbmdzX2V4cG9ydF91c2Vyc19kYXRhOmVkaXQiLCJzZXR0aW5nc19leHBvcnRfdXNlcnNfZGF0YTp2aWV3Iiwic2V0dGluZ3Nfa25vd2xlZGdlX2Jhc2VzOmNyZWF0ZSIsInNldHRpbmdzX2tub3dsZWRnZV9iYXNlczpkZWxldGUiLCJzZXR0aW5nc19rbm93bGVkZ2VfYmFzZXM6ZWRpdCIsInNldHRpbmdzX2tub3dsZWRnZV9iYXNlczp2aWV3Iiwic2V0dGluZ3NfcmV2aWV3X3NldHRpbmdzOmNyZWF0ZSIsInNldHRpbmdzX3Jldmlld19zZXR0aW5nczpkZWxldGUiLCJzZXR0aW5nc19yZXZpZXdfc2V0dGluZ3M6ZWRpdCIsInNldHRpbmdzX3Jldmlld19zZXR0aW5nczp2aWV3Iiwic2V0dGluZ3Nfc2hhcmVkX2luYm94X3NldHRpbmdzOmNyZWF0ZSIsInNldHRpbmdzX3NoYXJlZF9pbmJveF9zZXR0aW5nczpkZWxldGUiLCJzZXR0aW5nc19zaGFyZWRfaW5ib3hfc2V0dGluZ3M6ZWRpdCIsInNldHRpbmdzX3NoYXJlZF9pbmJveF9zZXR0aW5nczp2aWV3Iiwic2V0dGluZ3NfdXNlcl9hcGlfYWNjZXNzOmNyZWF0ZSIsInNldHRpbmdzX3VzZXJfYXBpX2FjY2VzczpkZWxldGUiLCJzZXR0aW5nc191c2VyX2FwaV9hY2Nlc3M6ZWRpdCIsInNldHRpbmdzX3VzZXJfYXBpX2FjY2Vzczp2aWV3Iiwic2V0dGluZ3NfdXNlcnNfaW5ib3hfc2V0dGluZ3M6Y3JlYXRlIiwic2V0dGluZ3NfdXNlcnNfaW5ib3hfc2V0dGluZ3M6ZGVsZXRlIiwic2V0dGluZ3NfdXNlcnNfaW5ib3hfc2V0dGluZ3M6ZWRpdCIsInNldHRpbmdzX3VzZXJzX2luYm94X3NldHRpbmdzOnZpZXciLCJzZXR0aW5nc191c2Vyc19vd25fc2V0dGluZ3M6Y3JlYXRlIiwic2V0dGluZ3NfdXNlcnNfb3duX3NldHRpbmdzOmRlbGV0ZSIsInNldHRpbmdzX3VzZXJzX293bl9zZXR0aW5nczplZGl0Iiwic2V0dGluZ3NfdXNlcnNfb3duX3NldHRpbmdzOnZpZXciLCJzdXJ2ZXlzOmNyZWF0ZSIsInN1cnZleXM6ZGVsZXRlIiwic3VydmV5czplZGl0Iiwic3VydmV5czp2aWV3IiwidGVhbV9jaGF0X2NoYW5uZWxzOmFsbDpjcmVhdGUiLCJ0ZWFtX2NoYXRfY2hhbm5lbHM6YWxsOmRlbGV0ZSIsInRlYW1fY2hhdF9jaGFubmVsczphbGw6ZWRpdCIsInRlYW1fY2hhdF9jaGFubmVsczphbGw6dmlldyIsInRlYW1fY2hhdF9jaGFubmVsczpkeW5hbWljOmNyZWF0ZSIsInRlYW1fY2hhdF9jaGFubmVsczpkeW5hbWljOmRlbGV0ZSIsInRlYW1fY2hhdF9jaGFubmVsczpkeW5hbWljOmVkaXQiLCJ0ZWFtX2NoYXRfY2hhbm5lbHM6ZHluYW1pYzp2aWV3Il19.BnWY3QzDJ2vdPErDhsLNk3I99sgiz5u5ao3YHqB6Modj_O3WXK3Q89UMUmeXrXJaU4gvrpS5ELL_htO2_k_Ur3o4dSwkcXZEozNT1rOQiJXtHWMHFgBa56PKN5X2SYwJ8fJmbfXQR6CI9oEGTEACI9IKTxjrMWzol0RYBpUPEYdHfVi_Dw-KgXtDfxqsS5gxFXcpfqRhD4004D08LqVPXYKfQBvvWr60MV-6ohkgAkItVGU0JWQRa21KcPhYyj05qPVjFO28OwFvzIzziHCBJ20wLuuVJg5kWV8Ddp47-za0_GyFAN9n-HhSk_rjK4NGye3t6w0tlZjEjam-jMVDbw`;
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
        initiateSSE(to_number.slice(1), from_number.slice(1));
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

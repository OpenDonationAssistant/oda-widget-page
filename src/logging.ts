import pino from "pino";


// todo локально работает, надо сделать чтобы по флагу/команде включалось в проде
const send = async function (level, logEvent) {
  const url = `${process.env.REACT_APP_LOG_API_ENDPOINT}/api/v1/logstream/widgets`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: "Basic YWRtaW46YWRtaW4K",
        "Content-Type": "application/json",
        "X-P-Meta-user-id": localStorage.getItem("login"),
      },
      body: JSON.stringify([logEvent]),
    });
    console.log(response);
  } catch (Exception) {}
};

const log = pino({
  browser: {
    serialize: true,
    asObject: true,
    // transmit: {
    //   send,
    // },
  },
});
log.level = process.env.REACT_APP_PINO_LOG_LEVEL || "debug";

export { log };

import pino from "pino";


// todo локально работает, надо сделать чтобы по флагу/команде включалось в проде
const send = async function (level, logEvent) {
  const url = `${process.env.REACT_APP_LOG_API_ENDPOINT}/logs/${localStorage.getItem("login")}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
    transmit: {
      send,
    },
  },
});
log.level = process.env.REACT_APP_PINO_LOG_LEVEL || "debug";

export { log };

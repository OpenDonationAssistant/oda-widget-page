import pino from "pino";

function valueOf(level: string):number {
  switch(level){
    case 'error':
      return 0;
    case 'warn':
      return 1;
    case 'info':
      return 2;
    case 'debug':
      return 3;
    default:
      return 0;
  }
}

const send = async function (level: string, logEvent: any) {
  if (valueOf(level) > valueOf(loglevel)) {
    return;
  }
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

let loglevel = "error";

function setLoglevel(level: string){
  loglevel = level;
}

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

export { log, setLoglevel };

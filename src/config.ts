import axios from "axios";

interface Config {
  topic: {
    alerts: string;
    alertStatus: string;
    alertWidgetCommans: string;
    player: string;
    playerCommands: string;
    media: string;
    paymentWidgetCommands: string;
    mediaWidgetCommands: string;
  };
  loglevel: string;
}

async function config(recipientId: string): Promise<Config> {
  if ("unknown" === recipientId || !recipientId) {
    return new Promise((resolve) => {
      resolve({
        topic: {
          alerts: "",
          alertStatus: "",
          alertWidgetCommans: "",
          player: "",
          playerCommands: "",
          media: "",
          paymentWidgetCommands: "",
          mediaWidgetCommands: "",
        },
        loglevel: "error"
      });
    });
  }
  const config = await axios
    .get(
      `${process.env.REACT_APP_CONFIG_API_ENDPOINT}/config/widgets?ownerId=${recipientId}`,
    )
    .then((json) => {
      return json.data.value;
    });
  return config;
}

export { config, Config };

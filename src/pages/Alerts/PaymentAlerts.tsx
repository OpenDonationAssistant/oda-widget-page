import classes from "./PaymentAlerts.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { AlertController } from "./AlertController";
import { Col, Flex, Row } from "antd";
import { AlertState, AlertStateContext } from "./AlertState";
import { FontLoader } from "./sections/FontLoader/FontLoader";
import { AlertImage } from "./sections/AlertImage/AlertImage";
import { MessageTitle } from "./sections/MessageTitle/MessageTitle";
import { MessageBody } from "./sections/MessageBody/MessageBody";
import { observer } from "mobx-react-lite";
import { TokenStore } from "../../stores/TokenStore";
import { useLoaderData, useNavigate } from "react-router";
import { WidgetData } from "../../types/WidgetData";
import { useEffect } from "react";
import axios from "axios";
import { addHistoryItem } from "@opendonationassistant/history-service";
import { hashString } from "../../utils";
import { connect } from "socket.io-client";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { log } from "../../logging";
import { isFeatureEnabled, SW_DONATIONS_FEATURE } from "../../shared/features";

const memeAlertsRegexp = /купил (\d+)/;

const Alert = observer(({ state }: { state: AlertState }) => {
  const rootStyle = {
    ...state.totalBorder,
    ...state.totalWidthStyle,
    ...state.totalHeightStyle,
    ...state.totalWidth,
    ...state.totalHeight,
    ...state.totalRounding,
    ...state.totalPadding,
    ...state.totalShadow,
    ...state.totalBackgroundColor,
    ...state.totalBackgroundImage,
    ...state.totalAnimationDuration,
  };

  return (
    <>
      {"1" === state.layout.value && (
        <>
          <Flex
            vertical
            justify="flex-start"
            align="center"
            style={rootStyle}
            className={`${classes.paymentAlerts} ${state.totalClassName}`}
          >
            <AlertImage />
            <div className={classes.message}>
              <MessageTitle />
              <MessageBody />
            </div>
          </Flex>
        </>
      )}
      {"2" === state.layout.value && (
        <>
          <Flex
            vertical
            justify="flex-start"
            align="center"
            style={rootStyle}
            className={`${classes.paymentAlerts} ${state.totalClassName}`}
          >
            <div className={classes.message}>
              <MessageTitle />
            </div>
            <AlertImage />
            <div className={classes.message}>
              <MessageBody />
            </div>
          </Flex>
        </>
      )}
      {"3" === state.layout.value && (
        <>
          <Flex
            vertical
            justify="flex-start"
            align="center"
            style={rootStyle}
            className={`${classes.paymentAlerts} ${state.totalClassName}`}
          >
            <div className={classes.message}>
              <MessageTitle />
            </div>
            <div className={classes.message}>
              <MessageBody />
            </div>
            <AlertImage />
          </Flex>
        </>
      )}
      {"4" === state.layout.value && (
        <>
          <Row
            align="top"
            style={{ ...{ width: "100%", height: "100%" }, ...rootStyle }}
            className={`${classes.paymentAlerts} ${state.totalClassName}`}
          >
            <Col span={state.image ? 12 : 24}>
              <div>
                <MessageTitle />
                <MessageBody />
              </div>
            </Col>
            <Col span={12}>
              <AlertImage imageStyle={{ width: "100%", height: "unset" }} />
            </Col>
          </Row>
        </>
      )}
      {"5" === state.layout.value && (
        <>
          <Row
            align="top"
            style={{ ...{ width: "100%", height: "100%" }, ...rootStyle }}
            className={`${classes.paymentAlerts} ${state.totalClassName}`}
          >
            <Col span={state.image ? 8 : 12}>
              <MessageTitle />
            </Col>
            <Col span={8}>
              <AlertImage imageStyle={{ width: "100%", height: "unset" }} />
            </Col>
            <Col span={state.image ? 8 : 12}>
              <MessageBody />
            </Col>
          </Row>
        </>
      )}
      {"6" === state.layout.value && (
        <>
          <Row
            align="top"
            style={{ ...{ width: "100%", height: "100%" }, ...rootStyle }}
            className={`${classes.paymentAlerts} ${state.totalClassName}`}
          >
            <Col span={12}>
              <AlertImage
                imageStyle={{ width: "100%", height: "unset" }}
                style={{
                  width: "100%",
                  height: "unset",
                }}
              />
            </Col>
            <Col span={state.image ? 12 : 24}>
              <MessageTitle />
              <MessageBody />
            </Col>
          </Row>
        </>
      )}
      {"7" === state.layout.value && (
        <>
          <Row
            align="middle"
            style={{ ...{ width: "100%", height: "100%" }, ...rootStyle }}
            className={`${classes.paymentAlerts} ${state.totalClassName}`}
          >
            <Col span={state.image ? 12 : 24}>
              <MessageTitle />
              <MessageBody />
            </Col>
            {state.image && (
              <Col span={12}>
                <AlertImage
                  imageStyle={{ width: "100%", height: "unset" }}
                  style={{
                    width: "100%",
                    height: "unset",
                  }}
                />
              </Col>
            )}
          </Row>
        </>
      )}
      {"8" === state.layout.value && (
        <>
          <Row
            align="middle"
            style={{ ...{ width: "100%", height: "100%" }, ...rootStyle }}
            className={`${classes.paymentAlerts} ${state.totalClassName}`}
          >
            <Col span={state.image ? 8 : 12}>
              <MessageTitle />
            </Col>
            <Col span={8}>
              <AlertImage imageStyle={{ width: "100%", height: "unset" }} />
            </Col>
            <Col span={state.image ? 8 : 12}>
              <MessageBody />
            </Col>
          </Row>
        </>
      )}
      {"9" === state.layout.value && (
        <>
          <Row
            align="middle"
            style={{ ...{ width: "100%", height: "100%" }, ...rootStyle }}
            className={`${classes.paymentAlerts} ${state.totalClassName}`}
          >
            <Col span={12}>
              <AlertImage imageStyle={{ width: "100%", height: "unset" }} />
            </Col>
            <Col span={state.image ? 12 : 24}>
              <div>
                <MessageTitle />
                <MessageBody />
              </div>
            </Col>
          </Row>
        </>
      )}
      {"10" === state.layout.value && (
        <>
          <Row
            align="bottom"
            style={{ ...{ width: "100%", height: "100%" }, ...rootStyle }}
            className={`${classes.paymentAlerts} ${state.totalClassName}`}
          >
            <Col span={state.image ? 12 : 24}>
              <div>
                <MessageTitle />
                <MessageBody />
              </div>
            </Col>
            <Col span={12}>
              <AlertImage />
            </Col>
          </Row>
        </>
      )}
      {"11" === state.layout.value && (
        <>
          <Row
            align="bottom"
            style={{ ...{ width: "100%", height: "100%" }, ...rootStyle }}
            className={`${classes.paymentAlerts} ${state.totalClassName}`}
          >
            <Col span={state.image ? 8 : 12}>
              <MessageTitle />
            </Col>
            <Col span={8}>
              <AlertImage />
            </Col>
            <Col span={state.image ? 8 : 12}>
              <MessageBody />
            </Col>
          </Row>
        </>
      )}
      {"12" === state.layout.value && (
        <>
          <Row
            align="bottom"
            style={{ ...{ width: "100%", height: "100%" }, ...rootStyle }}
            className={`${classes.paymentAlerts} ${state.totalClassName}`}
          >
            <Col span={12}>
              <AlertImage />
            </Col>
            <Col span={state.image ? 12 : 24}>
              <MessageTitle />
              <MessageBody />
            </Col>
          </Row>
        </>
      )}
      {"13" === state.layout.value && (
        <>
          <Flex
            justify="center"
            align="flex-start"
            style={{ ...{ position: "relative" }, ...rootStyle }}
            className={`${classes.paymentAlerts} ${state.totalClassName}`}
          >
            <AlertImage
              style={{ height: "100%", width: "100%" }}
              imageStyle={{ height: "100%", width: "unset" }}
            />
            <div
              className={classes.message}
              style={{
                position: "absolute",
                display: "flex",
                height: "100%",
                width: "100%",
                top: "0px",
                left: "0px",
                flexDirection: "column",
                justifyContent: "flex-start",
              }}
            >
              <MessageTitle />
              <MessageBody />
            </div>
          </Flex>
        </>
      )}
      {"14" === state.layout.value && (
        <>
          <Flex
            justify="center"
            align="flex-start"
            style={{ ...{ position: "relative" }, ...rootStyle }}
            className={`${classes.paymentAlerts} ${state.totalClassName}`}
          >
            <AlertImage
              style={{ height: "100%", width: "100%" }}
              imageStyle={{ height: "100%", width: "unset" }}
            />
            <div
              className={classes.message}
              style={{
                position: "absolute",
                display: "flex",
                height: "100%",
                width: "100%",
                top: "0px",
                left: "0px",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <MessageTitle />
              <MessageBody />
            </div>
          </Flex>
        </>
      )}
      {"15" === state.layout.value && (
        <>
          <Flex
            justify="center"
            align="flex-start"
            style={{ ...{ position: "relative" }, ...rootStyle }}
            className={`${classes.paymentAlerts} ${state.totalClassName}`}
          >
            <AlertImage
              style={{ height: "100%", width: "100%" }}
              imageStyle={{ height: "100%", width: "unset" }}
            />
            <div
              className={classes.message}
              style={{
                position: "absolute",
                display: "flex",
                height: "100%",
                width: "100%",
                top: "0px",
                left: "0px",
                flexDirection: "column",
                justifyContent: "flex-end",
              }}
            >
              <MessageTitle />
              <MessageBody />
            </div>
          </Flex>
        </>
      )}
      {"16" === state.layout.value && (
        <div
          style={{
            ...{ width: "100%", height: "100%", position: "relative" },
            ...rootStyle,
          }}
          className={`${state.totalClassName}`}
        >
          <AlertImage
            imageStyle={{
              height: "100%",
              position: "absolute",
              top: state.layout.imageStartPoint?.y ?? "0px",
              left: state.layout.imageStartPoint?.x ?? "0px",
            }}
            style={{
              height: "100%",
              position: "absolute",
              top: state.layout.imageStartPoint?.y,
              left: state.layout.imageStartPoint?.x,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: state.layout.headerStartPoint?.y,
              left: state.layout.headerStartPoint?.x,
            }}
          >
            <MessageTitle />
          </div>
          <div
            style={{
              position: "absolute",
              top: state.layout.messageStartPoint?.y,
              left: state.layout.messageStartPoint?.x,
            }}
          >
            <MessageBody />
          </div>
        </div>
      )}
    </>
  );
});

const PaymentAlerts = observer(
  ({
    alertController,
    tokenStore,
  }: {
    alertController: AlertController;
    tokenStore: TokenStore;
  }) => {
    const { recipientId, features } = useLoaderData() as WidgetData;
    const navigate = useNavigate();
    const integrationLog = log.child({ module: "donationIntegration" });
    const odaToken = localStorage.getItem("access-token");

    useEffect(() => {
      // When SW_DONATIONS is enabled the service worker owns the donation
      // connections — skip the in-page duplicates.
      if (isFeatureEnabled(features, SW_DONATIONS_FEATURE)) return;
      const tokens = tokenStore.tokens.filter((token) => token.enabled);
      tokens
        .filter((token) => token.system === "DonationAlerts")
        .forEach((token) => {
          function connect() {
            axios
              .get("https://api.oda.digital/donationalerts", {
                headers: {
                  Authorization: `Bearer ${token.token}`,
                },
              })
              .then((response) => {
                const userId = response.data.data.id;
                const centrifugoToken =
                  response.data.data.socket_connection_token;

                const socket = new WebSocket(
                  "wss://centrifugo.donationalerts.com/connection/websocket",
                );

                socket.addEventListener("close", (event) => {
                  integrationLog.debug(
                    "Socket is closed. Reconnection attempt in 1s",
                  );
                  setTimeout(function () {
                    connect();
                  }, 1000);
                });

                socket.addEventListener("error", (event) => {
                  integrationLog.debug("error", event);
                });

                socket.addEventListener("open", (event) => {
                  integrationLog.debug("send auth request to DA");
                  socket.send(
                    JSON.stringify({
                      params: {
                        token: centrifugoToken,
                      },
                      id: 1,
                    }),
                  );
                });

                socket.addEventListener("message", (event) => {
                  const channel = `$alerts:donation_${userId}`;
                  const data = JSON.parse(event.data);
                  integrationLog.debug({ data: data }, "Message from DA ");
                  if (
                    data.result?.channel === channel &&
                    data.result?.data?.data
                  ) {
                    const payment = data.result.data.data;
                    addHistoryItem({
                      baseURL: process.env.REACT_APP_HISTORY_API_ENDPOINT,
                      headers: {
                        Authorization: `Bearer ${odaToken}`,
                      },
                      body: {
                        recipientId: recipientId,
                        amount: {
                          minor: 0,
                          major: payment.amount_in_user_currency,
                          currency: "RUB",
                        },
                        nickname: payment.username,
                        message: payment.message,
                        triggerAlert: token.settings.triggerAlerts,
                        triggerReel: token.settings.triggerReel,
                        triggerDonaton: token.settings.triggerDonaton,
                        goals: [],
                        addToTop: token.settings.countInTop,
                        addToGoal: token.settings.addToGoal,
                        paymentId: payment.id,
                        system: "DonationAlerts",
                        event: "payment",
                      },
                    });
                  }
                  if (data.id === 1) {
                    integrationLog.debug("getting centrifugo token");
                    const clientId = data.result.client;
                    axios
                      .post(
                        "https://www.donationalerts.com/api/v1/centrifuge/subscribe",
                        { channels: [channel], client: clientId },
                        {
                          headers: {
                            Authorization: `Bearer ${token.token}`,
                          },
                        },
                      )
                      .then((response) => {
                        const channelToken = response.data.channels[0].token;
                        integrationLog.debug(
                          { token: channelToken },
                          "got centrigure channel token",
                        );
                        socket.send(
                          JSON.stringify({
                            params: {
                              channel: `$alerts:donation_${userId}`,
                              token: channelToken,
                            },
                            method: 1,
                            id: 2,
                          }),
                        );
                      });
                  }
                });
              });
          }
          connect();
        });
      tokens
        .filter((token) => token.system === "DonatePay")
        .forEach((token) => {
          const id = token.settings.id;
          axios
            .post("https://donatepay.ru/api/v2/socket/token", {
              access_token: token.token,
            })
            .then((response) => response.data.token)
            .then((centrifugoToken) => {
              integrationLog.debug(
                { token: centrifugoToken },
                "Got DonatePay socket token",
              );

              const socket = new WebSocket(
                "wss://centrifugo.donatepay.ru:443/connection/websocket",
              );

              socket.addEventListener("close", (event) => {
                integrationLog.error("DonatePay closed connection", event);
                navigate(0);
              });

              socket.addEventListener("error", (event) => {
                integrationLog.error("DonatePay error", event);
                navigate(0);
              });

              socket.addEventListener("open", (event) => {
                integrationLog.debug("send auth request to DonatePay");
                socket.send(
                  JSON.stringify({
                    params: {
                      token: centrifugoToken,
                    },
                    id: 1,
                  }),
                );
              });

              socket.addEventListener("message", (event) => {
                const channel = `$public:${id}`;
                const data = JSON.parse(event.data);
                integrationLog.debug({ data: data }, "Message from DonatePay");
                if (data.id === 1) {
                  integrationLog.debug("getting centrifugo token");
                  const clientId = data.result.client;
                  axios
                    .post("https://donatepay.ru/api/v2/socket/token", {
                      access_token: token.token,
                      channels: [channel],
                      client: clientId,
                    })
                    .then((response) => {
                      const channelToken = response.data.channels[0].token;
                      integrationLog.debug(
                        { token: channelToken },
                        "got centrigure channel token",
                      );
                      socket.send(
                        JSON.stringify({
                          params: {
                            channel: channel,
                            token: channelToken,
                          },
                          method: 1,
                          id: 2,
                        }),
                      );
                    });
                }
                if (
                  data.result?.channel === channel &&
                  data.result?.data?.data?.notification
                ) {
                  const payment = data.result.data.data.notification;
                  addHistoryItem({
                    baseURL: process.env.REACT_APP_HISTORY_API_ENDPOINT,
                    headers: {
                      Authorization: `Bearer ${odaToken}`,
                    },
                    body: {
                      recipientId: recipientId,
                      amount: {
                        minor: 0,
                        major: payment.vars.sum,
                        currency: payment.vars.currency,
                      },
                      nickname: payment.vars.name,
                      message: payment.vars.comment,
                      triggerAlert: token.settings.triggerAlerts,
                      triggerReel: token.settings.triggerReel,
                      triggerDonaton: token.settings.triggerDonaton,
                      goals: [],
                      addToTop: token.settings.countInTop,
                      addToGoal: token.settings.addToGoal,
                      paymentId:
                        payment.id ??
                        hashString(
                          `${payment.vars.name}:${payment.vars.comment}`,
                        ).toString(),
                      system: "DonatePay",
                      event: "payment",
                    },
                  });
                }
              });
            });
        });
      tokens
        .filter((token) => token.system === "DonatePay.eu")
        .forEach((token) => {
          axios
            .get(`https://donatepay.eu/api/v1/user?access_token=${token.token}`)
            .then((response) => response.data.data.id)
            .then((id) => {
              integrationLog.debug("id: " + id);
              axios
                .post("https://donatepay.eu/api/v2/socket/token", {
                  access_token: token.token,
                })
                .then((response) => response.data.token)
                .then((centrifugoToken) => {
                  integrationLog.debug(
                    { token: centrifugoToken },
                    "Got DonatePay-eu socket token",
                  );

                  const socket = new WebSocket(
                    "wss://centrifugo.donatepay.eu:443/connection/websocket",
                  );

                  socket.addEventListener("close", (event) => {
                    navigate(0);
                  });

                  socket.addEventListener("error", (event) => {
                    navigate(0);
                  });

                  socket.addEventListener("open", (event) => {
                    integrationLog.debug("send auth request to DonatePay");
                    socket.send(
                      JSON.stringify({
                        params: {
                          token: centrifugoToken,
                        },
                        id: 1,
                      }),
                    );
                  });

                  socket.addEventListener("message", (event) => {
                    const channel = `$public:${id}`;
                    const data = JSON.parse(event.data);
                    if (data.id === 1) {
                      integrationLog.debug("getting centrifugo token");
                      const clientId = data.result.client;
                      axios
                        .post("https://donatepay.eu/api/v2/socket/token", {
                          access_token: token.token,
                          channels: [channel],
                          client: clientId,
                        })
                        .then((response) => {
                          const channelToken = response.data.channels[0].token;
                          integrationLog.debug(
                            { token: channelToken },
                            "got centrigure channel token",
                          );
                          socket.send(
                            JSON.stringify({
                              params: {
                                channel: channel,
                                token: channelToken,
                              },
                              method: 1,
                              id: 2,
                            }),
                          );
                        });
                    }
                    if (
                      data.result?.channel === channel &&
                      data.result?.data?.data?.notification
                    ) {
                      const payment = data.result.data.data.notification;
                      addHistoryItem({
                        baseURL: process.env.REACT_APP_HISTORY_API_ENDPOINT,
                        headers: {
                          Authorization: `Bearer ${odaToken}`,
                        },
                        body: {
                          recipientId: recipientId,
                          amount: {
                            minor: 0,
                            major: payment.vars.sum,
                            currency: payment.vars.currency,
                          },
                          nickname: payment.vars.name,
                          message: payment.vars.comment,
                          triggerAlert: token.settings.triggerAlerts,
                          triggerReel: token.settings.triggerReel,
                          triggerDonaton: token.settings.triggerDonaton,
                          goals: [],
                          addToTop: token.settings.countInTop,
                          addToGoal: token.settings.addToGoal,
                          paymentId:
                            payment.id ??
                            hashString(
                              `${payment.vars.name}:${payment.vars.comment}`,
                            ).toString(),
                          system: "DonatePay.eu",
                          event: "payment",
                        },
                      });
                    }
                  });
                });
            });
        });
      tokens
        .filter((token) => token.system === "UnofficialDonationAlerts")
        .forEach((token) => {
          const socket = connect("wss://socket.donationalerts.com/", {
            reconnection: true,
            reconnectionDelayMax: 5000,
            reconnectionDelay: 1000,
          });

          socket.on("connect", function () {
            integrationLog.debug("UnofficialDonationAlerts WS: connected");
            socket.emit("add-user", {
              token: token.token,
              type: "alert_widget",
            });
          });

          socket.on("connect_error", function (msg: string) {
            integrationLog.error(
              { msg: msg },
              "UnofficialDonationAlerts WS: connection_error",
            );
            navigate(0);
          });

          socket.on("connect_timeout", function (msg: string) {
            integrationLog.error(
              { msg: msg },
              "UnofficialDonationAlerts WS: connection_timeout",
            );
            navigate(0);
          });

          socket.on("reconnect", function (msg: string) {
            integrationLog.debug(
              { msg: msg },
              "UnofficialDonationAlerts WS: reconnect",
            );
          });

          socket.on("donation", function (msg: string) {
            const donation = JSON.parse(msg);
            integrationLog.debug({ donation: msg }, "Received DA donation");
            switch (donation.alert_type) {
              case 27:
                addHistoryItem({
                  baseURL: process.env.REACT_APP_HISTORY_API_ENDPOINT,
                  headers: {
                    Authorization: `Bearer ${odaToken}`,
                  },
                  body: {
                    recipientId: recipientId,
                    amount: {
                      minor: 0,
                      major: 0,
                      currency: "RUB",
                    },
                    nickname: donation.username,
                    message: donation.message,
                    triggerAlert: token.settings.triggerAlerts,
                    triggerReel: false,
                    triggerDonaton: false,
                    goals: [],
                    addToTop: false,
                    addToGoal: false,
                    paymentId: donation.id,
                    system: "Boosty",
                    event: "follow",
                    alertMedia: null,
                  },
                });
                break;
              case 20:
              case 28:
                addHistoryItem({
                  baseURL: process.env.REACT_APP_HISTORY_API_ENDPOINT,
                  headers: {
                    Authorization: `Bearer ${odaToken}`,
                  },
                  body: {
                    recipientId: recipientId,
                    amount: {
                      minor: 0,
                      major: donation.amount_main,
                      currency: "RUB",
                    },
                    nickname: donation.username,
                    message: donation.message,
                    triggerAlert: true,
                    triggerReel: false,
                    triggerDonaton: false,
                    goals: [],
                    addToTop: false,
                    addToGoal: false,
                    paymentId: donation.id,
                    system: "Boosty",
                    event: "subscription",
                    levelName: donation.additional_data.event_data.level_name,
                    alertMedia: null,
                  },
                });
                break;
              case 32:
                const match = memeAlertsRegexp.exec(donation.message ?? "");
                addHistoryItem({
                  baseURL: process.env.REACT_APP_HISTORY_API_ENDPOINT,
                  headers: {
                    Authorization: `Bearer ${odaToken}`,
                  },
                  body: {
                    recipientId: recipientId,
                    amount: {
                      minor: 0,
                      major: donation.amount_main,
                      currency: "RUB",
                    },
                    nickname: donation.username,
                    message: donation.message,
                    triggerAlert: true,
                    triggerReel: false,
                    triggerDonaton: false,
                    goals: [],
                    addToTop: false,
                    addToGoal: false,
                    paymentId: donation.id,
                    system: "MemeAlerts",
                    event: "payment",
                    count: Number(match?.[1]),
                    externalId: donation.id,
                    alertMedia: donation.tts_url
                      ? {
                          url: donation.tts_url.replace(
                            "files.donationalerts.com",
                            "widgets.oda.digital",
                          ),
                        }
                      : null,
                  },
                });
                break;
              case 1:
                addHistoryItem({
                  baseURL: process.env.REACT_APP_HISTORY_API_ENDPOINT,
                  headers: {
                    Authorization: `Bearer ${odaToken}`,
                  },
                  body: {
                    recipientId: recipientId,
                    amount: {
                      minor: 0,
                      major: donation.amount_main,
                      currency: "RUB",
                    },
                    nickname: donation.username,
                    message: donation.message,
                    triggerAlert: token.settings.triggerAlerts,
                    triggerReel: token.settings.triggerReel,
                    triggerDonaton: token.settings.triggerDonaton,
                    goals: [],
                    addToTop: token.settings.countInTop,
                    addToGoal: token.settings.addToGoal,
                    paymentId: donation.id,
                    system: "DonationAlerts",
                    event: "payment",
                    alertMedia: donation.tts_url
                      ? {
                          url: donation.tts_url.replace(
                            "files.donationalerts.com",
                            "widgets.oda.digital",
                          ),
                        }
                      : null,
                  },
                });
                break;
              default:
                break;
            }
          });
        });
      tokens
        .filter((token) => token.system === "DonateX")
        .forEach((token) => {
          const connection = new HubConnectionBuilder()
            .withUrl(
              `https://donatex.gg/api/public-donations-hub?access_token=${encodeURIComponent(token.token)}`,
            )
            .withAutomaticReconnect()
            .configureLogging(LogLevel.Information)
            .build();
          connection.on("DonationCreated", (donation) => {
            integrationLog.debug({ donation: donation }, "New donation");
            addHistoryItem({
              baseURL: process.env.REACT_APP_HISTORY_API_ENDPOINT,
              headers: {
                Authorization: `Bearer ${odaToken}`,
              },
              body: {
                recipientId: recipientId,
                amount: {
                  minor: 0,
                  major: donation.amountInRub,
                  currency: "RUB",
                },
                nickname: donation.username,
                message: donation.message,
                triggerAlert: token.settings.triggerAlerts,
                triggerReel: token.settings.triggerReel,
                triggerDonaton: token.settings.triggerDonaton,
                goals: [],
                addToTop: token.settings.countInTop,
                addToGoal: token.settings.addToGoal,
                paymentId: donation.id,
                system: "DonateX",
                event: "payment",
                alertMedia: {
                  url: donation.voiceFilePath,
                },
              },
            });
          });
          connection.start();
        });
    }, [alertController, tokenStore.tokens, recipientId, navigate, features]);

    return (
      <AlertStateContext.Provider value={alertController.state}>
        <FontLoader state={alertController.state} />
        <Alert state={alertController.state} />
      </AlertStateContext.Provider>
    );
  },
);

export default PaymentAlerts;

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
import { useEffect } from "react";
import { log } from "../../logging";
import axios from "axios";
import { DefaultApiFactory as HistoryService } from "@opendonationassistant/oda-history-service-client";
import { DefaultApiFactory as RecipientService } from "@opendonationassistant/oda-recipient-service-client";
import { WidgetData } from "../../types/WidgetData";
import { useLoaderData, useNavigate } from "react-router";
import { uuidv7 } from "uuidv7";

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

function PaymentAlerts({
  alertController,
}: {
  alertController: AlertController;
}) {
  const { recipientId, conf, widgetId } = useLoaderData() as WidgetData;
  const navigate = useNavigate();

  useEffect(() => {
    RecipientService(undefined, process.env.REACT_APP_HISTORY_API_ENDPOINT)
      .listTokens({})
      .then((tokens) => tokens.data.filter((token) => token.enabled))
      .then((tokens) => {
        tokens
          .filter((token) => token.system === "DonationAlerts")
          .forEach((token) => {
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
                  navigate(0);
                });

                socket.addEventListener("error", (event) => {
                  navigate(0);
                });

                socket.addEventListener("open", (event) => {
                  log.debug("send auth request to DA");
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
                  console.log({ data: data }, "Message from DA ");
                  if (
                    data.result?.channel === channel &&
                    data.result?.data?.data
                  ) {
                    const payment = data.result.data.data;
                    HistoryService(
                      undefined,
                      process.env.REACT_APP_HISTORY_API_ENDPOINT,
                    ).addHistoryItem(
                      {
                        recipientId: recipientId,
                        amount: {
                          minor: 0,
                          major: payment.amount_in_user_currency,
                          currency: "RUB",
                        },
                        nickname: payment.username,
                        message: payment.message,
                        triggerAlert: true,
                        triggerReel: false,
                        goals: [],
                        addToTop: true,
                        addToGoal: false,
                        id: uuidv7(),
                        paymentId: uuidv7(),
                        system: "DonationAlerts",
                        externalId: payment.id,
                      },
                      {},
                    );
                  }
                  if (data.id === 1) {
                    log.debug("getting centrifugo token");
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
                        log.debug(
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
          });
        tokens
          .filter((token) => token.system === "DonatePay")
          .forEach((token) => {
            axios
              .get(
                `https://donatepay.ru/api/v1/user?access_token=${token.token}`,
              )
              .then((response) => response.data.data.id)
              .then((id) => {
                log.debug("id: " + id);
                axios
                  .post("https://donatepay.ru/api/v2/socket/token", {
                    access_token: token.token,
                  })
                  .then((response) => response.data.token)
                  .then((centrifugoToken) => {
                    log.debug(
                      { token: centrifugoToken },
                      "Got DonatePay socket token",
                    );

                    const socket = new WebSocket(
                      "wss://centrifugo.donatepay.ru:443/connection/websocket",
                    );

                    socket.addEventListener("close", (event) => {
                      navigate(0);
                    });

                    socket.addEventListener("error", (event) => {
                      navigate(0);
                    });

                    socket.addEventListener("open", (event) => {
                      log.debug("send auth request to DonatePay");
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
                      console.log({ data: data }, "Message from DonatePay");
                      if (data.id === 1) {
                        log.debug("getting centrifugo token");
                        const clientId = data.result.client;
                        axios
                          .post("https://donatepay.ru/api/v2/socket/token", {
                            access_token: token.token,
                            channels: [channel],
                            client: clientId,
                          })
                          .then((response) => {
                            const channelToken =
                              response.data.channels[0].token;
                            log.debug(
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
                        HistoryService(
                          undefined,
                          process.env.REACT_APP_HISTORY_API_ENDPOINT,
                        ).addHistoryItem(
                          {
                            recipientId: recipientId,
                            amount: {
                              minor: 0,
                              major: payment.vars.sum,
                              currency: payment.vars.currency,
                            },
                            nickname: payment.vars.name,
                            message: payment.vars.comment,
                            triggerAlert: true,
                            triggerReel: false,
                            goals: [],
                            addToTop: true,
                            addToGoal: false,
                            id: uuidv7(),
                            paymentId: uuidv7(),
                            system: "DonatePay",
                            externalId: payment.id,
                          },
                          {},
                        );
                      }
                    });
                  });
              });
          });
        tokens
          .filter((token) => token.system === "DonatePay.eu")
          .forEach((token) => {
            axios
              .get(
                `https://donatepay.eu/api/v1/user?access_token=${token.token}`,
              )
              .then((response) => response.data.data.id)
              .then((id) => {
                log.debug("id: " + id);
                axios
                  .post("https://donatepay.eu/api/v2/socket/token", {
                    access_token: token.token,
                  })
                  .then((response) => response.data.token)
                  .then((centrifugoToken) => {
                    log.debug(
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
                      log.debug("send auth request to DonatePay");
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
                        log.debug("getting centrifugo token");
                        const clientId = data.result.client;
                        axios
                          .post("https://donatepay.eu/api/v2/socket/token", {
                            access_token: token.token,
                            channels: [channel],
                            client: clientId,
                          })
                          .then((response) => {
                            const channelToken =
                              response.data.channels[0].token;
                            log.debug(
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
                        HistoryService(
                          undefined,
                          process.env.REACT_APP_HISTORY_API_ENDPOINT,
                        ).addHistoryItem(
                          {
                            recipientId: recipientId,
                            amount: {
                              minor: 0,
                              major: payment.vars.sum,
                              currency: payment.vars.currency,
                            },
                            nickname: payment.vars.name,
                            message: payment.vars.comment,
                            triggerAlert: true,
                            triggerReel: false,
                            goals: [],
                            addToTop: true,
                            addToGoal: false,
                            id: uuidv7(),
                            paymentId: uuidv7(),
                            system: "DonatePay.eu",
                            externalId: payment.id,
                          },
                          {},
                        );
                      }
                    });
                  });
              });
          });
      });
  }, [alertController]);

  return (
    <AlertStateContext.Provider value={alertController.state}>
      <FontLoader state={alertController.state} />
      <Alert state={alertController.state} />
    </AlertStateContext.Provider>
  );
}

export default PaymentAlerts;

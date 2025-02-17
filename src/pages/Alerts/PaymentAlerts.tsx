import { useEffect } from "react";
import classes from "./PaymentAlerts.module.css";
import { useLoaderData } from "react-router";
import "bootstrap/dist/css/bootstrap.min.css";
import { log } from "../../logging";
import { subscribe } from "../../socket";
import { AlertController } from "./AlertController";
import { WidgetData } from "../../types/WidgetData";
import { Col, Flex, Row } from "antd";
import { AlertState, AlertStateContext } from "./AlertState";
import FontLoader from "./sections/FontLoader/FontLoader";
import { AlertImage } from "./sections/AlertImage/AlertImage";
import { MessageTitle } from "./sections/MessageTitle/MessageTitle";
import { MessageBody } from "./sections/MessageBody/MessageBody";
import { observer } from "mobx-react-lite";

const Alert = observer(({ state }: { state: AlertState }) => {
  log.debug(
    { state: state, layout: state.layout, check: "3" === state.layout.value },
    "layout for alert",
  );

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
            className={`${classes.paymentAlerts}`}
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
            className={`${classes.paymentAlerts}`}
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
            className={`${classes.paymentAlerts}`}
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
            className={`${classes.paymentAlerts}`}
          >
            <Col span={12}>
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
            className={`${classes.paymentAlerts}`}
          >
            <Col span={8}>
              <MessageTitle />
            </Col>
            <Col span={8}>
              <AlertImage imageStyle={{ width: "100%", height: "unset" }} />
            </Col>
            <Col span={8}>
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
            className={`${classes.paymentAlerts}`}
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
            <Col span={12}>
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
            className={`${classes.paymentAlerts}`}
          >
            <Col span={12}>
              <MessageTitle />
              <MessageBody />
            </Col>
            <Col span={12}>
              <AlertImage
                imageStyle={{ width: "100%", height: "unset" }}
                style={{
                  width: "100%",
                  height: "unset",
                }}
              />
            </Col>
          </Row>
        </>
      )}
      {"8" === state.layout.value && (
        <>
          <Row
            align="middle"
            style={{ ...{ width: "100%", height: "100%" }, ...rootStyle }}
            className={`${classes.paymentAlerts}`}
          >
            <Col span={8}>
              <MessageTitle />
            </Col>
            <Col span={8}>
              <AlertImage imageStyle={{ width: "100%", height: "unset" }} />
            </Col>
            <Col span={8}>
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
            className={`${classes.paymentAlerts}`}
          >
            <Col span={12}>
              <AlertImage imageStyle={{ width: "100%", height: "unset" }} />
            </Col>
            <Col span={12}>
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
            className={`${classes.paymentAlerts}`}
          >
            <Col span={12}>
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
            className={`${classes.paymentAlerts}`}
          >
            <Col span={8}>
              <MessageTitle />
            </Col>
            <Col span={8}>
              <AlertImage/>
            </Col>
            <Col span={8}>
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
            className={`${classes.paymentAlerts}`}
          >
            <Col span={12}>
              <AlertImage />
            </Col>
            <Col span={12}>
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
            className={`${classes.paymentAlerts}`}
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
            className={`${classes.paymentAlerts}`}
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
      {"14" === state.layout.value && (
        <>
          <Flex
            justify="center"
            align="flex-start"
            style={{ ...{ position: "relative" }, ...rootStyle }}
            className={`${classes.paymentAlerts}`}
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
      {"8" === state.layout.value && (
        <div
          style={{
            ...{ width: "100%", height: "100%", position: "relative" },
            ...rootStyle,
          }}
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
  const { conf, widgetId } = useLoaderData() as WidgetData;

  useEffect(() => {
    alertController.listen(widgetId, conf);
  }, [alertController]);

  useEffect(() => {
    subscribe(widgetId, conf.topic.alertWidgetCommans, (message) => {
      log.info(`Alerts command: ${message.body}`);
      let json = JSON.parse(message.body);
      if (json.command === "interrupt") {
        alertController.interrupt();
      }
      message.ack();
    });
  }, [widgetId]);

  return (
    <AlertStateContext.Provider value={alertController.state}>
      <FontLoader />
      <Alert state={alertController.state} />
    </AlertStateContext.Provider>
  );
}

export default PaymentAlerts;

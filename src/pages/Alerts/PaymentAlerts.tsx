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
  return (
    <AlertStateContext.Provider value={alertController.state}>
      <FontLoader state={alertController.state} />
      <Alert state={alertController.state} />
    </AlertStateContext.Provider>
  );
}

export default PaymentAlerts;

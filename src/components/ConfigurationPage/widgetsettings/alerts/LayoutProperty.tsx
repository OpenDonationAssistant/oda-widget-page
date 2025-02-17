import { ReactNode } from "react";
import { DefaultWidgetProperty } from "../../widgetproperties/WidgetProperty";
import { observer } from "mobx-react-lite";
import { toJS } from "mobx";
import { Flex } from "antd";
import classes from "./LayoutProperty.module.css";
import { produce } from "immer";
import LabeledContainer from "../../../LabeledContainer/LabeledContainer";
import InputNumber from "../../components/InputNumber";

const LayoutPropertyComponent = observer(
  ({ property }: { property: LayoutProperty }) => {
    return (
      <div className={`settings-item ${classes.container}`}>
        <Flex
          align="center"
          wrap
          gap={20}
          className={`${classes.previews}`}
          justify="center"
          style={{ margin: "0px auto" }}
        >
          <Flex
            vertical
            justify="center"
            align="center"
            className={`${classes.layout} ${"1" === property.value.value && classes.selected}`}
            onClick={() => {
              property.value = produce(toJS(property.value), (draft) => {
                draft.value = "1";
              });
            }}
          >
            <img src="/icons/picture.png" />
            <div>Заголовок</div>
            <div>Сообщение</div>
          </Flex>
          <Flex
            vertical
            justify="center"
            align="center"
            className={`${classes.layout} ${"2" === property.value.value && classes.selected}`}
            onClick={() => {
              property.value = produce(toJS(property.value), (draft) => {
                draft.value = "2";
              });
            }}
          >
            <div>Заголовок</div>
            <img src="/icons/picture.png" />
            <div>Сообщение</div>
          </Flex>
          <Flex
            vertical
            justify="center"
            align="center"
            className={`${classes.layout} ${"3" === property.value.value && classes.selected}`}
            onClick={() => {
              property.value = produce(toJS(property.value), (draft) => {
                draft.value = "3";
              });
            }}
          >
            <div>Заголовок</div>
            <div>Сообщение</div>
            <img src="/icons/picture.png" />
          </Flex>
          <Flex
            justify="center"
            align="flex-start"
            className={`${classes.layout} ${"4" === property.value.value && classes.selected}`}
            onClick={() => {
              property.value = produce(toJS(property.value), (draft) => {
                draft.value = "4";
              });
            }}
          >
            <Flex vertical justify="flex-start">
              <div>Заголовок</div>
              <div>Сообщение</div>
            </Flex>
            <img src="/icons/picture.png" />
          </Flex>
          <Flex
            justify="center"
            align="flex-start"
            className={`${classes.layout} ${"5" === property.value.value && classes.selected}`}
            onClick={() => {
              property.value = produce(toJS(property.value), (draft) => {
                draft.value = "5";
              });
            }}
          >
            <div style={{ width: "50px", wordBreak: "break-all" }}>
              Заголовок
            </div>
            <img src="/icons/picture.png" />
            <div style={{ width: "50px", wordBreak: "break-all" }}>
              Сообщение
            </div>
          </Flex>
          <Flex
            justify="center"
            align="flex-start"
            className={`${classes.layout} ${"6" === property.value.value && classes.selected}`}
            onClick={() => {
              property.value = produce(toJS(property.value), (draft) => {
                draft.value = "6";
              });
            }}
          >
            <img src="/icons/picture.png" />
            <Flex vertical justify="flex-start">
              <div>Заголовок</div>
              <div>Сообщение</div>
            </Flex>
          </Flex>
          <Flex
            justify="center"
            align="center"
            className={`${classes.layout} ${"7" === property.value.value && classes.selected}`}
            onClick={() => {
              property.value = produce(toJS(property.value), (draft) => {
                draft.value = "7";
              });
            }}
          >
            <div>
              <div>Заголовок</div>
              <div>Сообщение</div>
            </div>
            <img src="/icons/picture.png" />
          </Flex>
          <Flex
            justify="center"
            align="center"
            className={`${classes.layout} ${"8" === property.value.value && classes.selected}`}
            onClick={() => {
              property.value = produce(toJS(property.value), (draft) => {
                draft.value = "8";
              });
            }}
          >
            <div style={{ width: "50px", wordBreak: "break-all" }}>
              Заголовок
            </div>
            <img src="/icons/picture.png" />
            <div style={{ width: "50px", wordBreak: "break-all" }}>
              Сообщение
            </div>
          </Flex>
          <Flex
            justify="center"
            align="center"
            className={`${classes.layout} ${"9" === property.value.value && classes.selected}`}
            onClick={() => {
              property.value = produce(toJS(property.value), (draft) => {
                draft.value = "9";
              });
            }}
          >
            <img src="/icons/picture.png" />
            <div>
              <div>Заголовок</div>
              <div>Сообщение</div>
            </div>
          </Flex>
          <Flex
            justify="center"
            align="flex-end"
            className={`${classes.layout} ${"10" === property.value.value && classes.selected}`}
            onClick={() => {
              property.value = produce(toJS(property.value), (draft) => {
                draft.value = "10";
              });
            }}
          >
            <Flex vertical justify="flex-end">
              <div>Заголовок</div>
              <div>Сообщение</div>
            </Flex>
            <img src="/icons/picture.png" />
          </Flex>
          <Flex
            justify="center"
            align="flex-end"
            className={`${classes.layout} ${"11" === property.value.value && classes.selected}`}
            onClick={() => {
              property.value = produce(toJS(property.value), (draft) => {
                draft.value = "11";
              });
            }}
          >
            <div style={{ width: "50px", wordBreak: "break-all" }}>
              Заголовок
            </div>
            <img src="/icons/picture.png" />
            <div style={{ width: "50px", wordBreak: "break-all" }}>
              Сообщение
            </div>
          </Flex>
          <Flex
            justify="center"
            align="flex-end"
            className={`${classes.layout} ${"12" === property.value.value && classes.selected}`}
            onClick={() => {
              property.value = produce(toJS(property.value), (draft) => {
                draft.value = "12";
              });
            }}
          >
            <img src="/icons/picture.png" />
            <Flex vertical justify="flex-end">
              <div>Заголовок</div>
              <div>Сообщение</div>
            </Flex>
          </Flex>
          <Flex
            justify="center"
            align="center"
            className={`${classes.layout} ${"13" === property.value.value && classes.selected}`}
            onClick={() => {
              property.value = produce(toJS(property.value), (draft) => {
                draft.value = "13";
              });
            }}
          >
            <div
              style={{ position: "relative", width: "100%", height: "100%" }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "10%",
                  left: "50%",
                  transform: "translate(-50%, 0%)",
                }}
              >
                <div>Заголовок</div>
                <div>Сообщение</div>
              </div>
              <img
                style={{ width: "100%", height: "100%" }}
                src="/icons/picture.png"
              />
            </div>
          </Flex>
          <Flex
            justify="center"
            align="center"
            className={`${classes.layout} ${"14" === property.value.value && classes.selected}`}
            onClick={() => {
              property.value = produce(toJS(property.value), (draft) => {
                draft.value = "14";
              });
            }}
          >
            <div
              style={{ position: "relative", width: "100%", height: "100%" }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div>Заголовок</div>
                <div>Сообщение</div>
              </div>
              <img
                src="/icons/picture.png"
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          </Flex>
          <Flex
            justify="center"
            align="center"
            className={`${classes.layout} ${"15" === property.value.value && classes.selected}`}
            onClick={() => {
              property.value = produce(toJS(property.value), (draft) => {
                draft.value = "15";
              });
            }}
          >
            <div
              style={{ position: "relative", width: "100%", height: "100%" }}
            >
              <div
                style={{
                  position: "absolute",
                  bottom: "0%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div>Заголовок</div>
                <div>Сообщение</div>
              </div>
              <img
                src="/icons/picture.png"
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          </Flex>
          <Flex
            justify="center"
            align="center"
            className={`${classes.layout} ${"16" === property.value.value && classes.selected}`}
            onClick={() => {
              property.value = produce(toJS(property.value), (draft) => {
                draft.value = "16";
              });
            }}
          >
            <div>Фиксированные координаты</div>
          </Flex>
        </Flex>
        {"16" === property.value.value && (
          <>
            <LabeledContainer displayName="widget-alert-image-start-point-x">
              <InputNumber
                value={property.value.imageStartPoint?.x ?? 0}
                addon="px"
                onChange={(update) => {
                  property.value = produce(toJS(property.value), (draft) => {
                    draft.imageStartPoint = {
                      x: update,
                      y: property.value.imageStartPoint?.y ?? 0,
                    };
                  });
                }}
              />
            </LabeledContainer>
            <LabeledContainer displayName="widget-alert-image-start-point-y">
              <InputNumber
                value={property.value.imageStartPoint?.y ?? 0}
                addon="px"
                onChange={(update) => {
                  property.value = produce(toJS(property.value), (draft) => {
                    draft.imageStartPoint = {
                      y: update,
                      x: property.value.imageStartPoint?.x ?? 0,
                    };
                  });
                }}
              />
            </LabeledContainer>
            <LabeledContainer displayName="widget-alert-header-start-point-x">
              <InputNumber
                value={property.value.headerStartPoint?.x ?? 0}
                addon="px"
                onChange={(update) => {
                  property.value = produce(toJS(property.value), (draft) => {
                    draft.headerStartPoint = {
                      x: update,
                      y: property.value.headerStartPoint?.y ?? 0,
                    };
                  });
                }}
              />
            </LabeledContainer>
            <LabeledContainer displayName="widget-alert-header-start-point-y">
              <InputNumber
                value={property.value.headerStartPoint?.y ?? 0}
                addon="px"
                onChange={(update) => {
                  property.value = produce(toJS(property.value), (draft) => {
                    draft.headerStartPoint = {
                      y: update,
                      x: property.value.headerStartPoint?.x ?? 0,
                    };
                  });
                }}
              />
            </LabeledContainer>
            <LabeledContainer displayName="widget-alert-message-start-point-x">
              <InputNumber
                value={property.value.messageStartPoint?.x ?? 0}
                addon="px"
                onChange={(update) => {
                  property.value = produce(toJS(property.value), (draft) => {
                    draft.messageStartPoint = {
                      x: update,
                      y: property.value.messageStartPoint?.y ?? 0,
                    };
                  });
                }}
              />
            </LabeledContainer>
            <LabeledContainer displayName="widget-alert-message-start-point-y">
              <InputNumber
                value={property.value.messageStartPoint?.y ?? 0}
                addon="px"
                onChange={(update) => {
                  property.value = produce(toJS(property.value), (draft) => {
                    draft.messageStartPoint = {
                      y: update,
                      x: property.value.messageStartPoint?.x ?? 0,
                    };
                  });
                }}
              />
            </LabeledContainer>
          </>
        )}
      </div>
    );
  },
);

export interface Point {
  x: number;
  y: number;
}

export interface LayoutPropertyValue {
  value:
    | "1"
    | "2"
    | "3"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9"
    | "10"
    | "11"
    | "12"
    | "13"
    | "14"
    | "15"
    | "16";
  imageStartPoint: Point | null;
  headerStartPoint: Point | null;
  messageStartPoint: Point | null;
}

export class LayoutProperty extends DefaultWidgetProperty<LayoutPropertyValue> {
  constructor() {
    super({
      name: "layout",
      value: {
        value: "1",
        imageStartPoint: null,
        headerStartPoint: null,
        messageStartPoint: null,
      },
      displayName: "layout",
    });
  }

  markup(): ReactNode {
    return <LayoutPropertyComponent property={this} />;
  }
}

import { ReactNode } from "react";
import { DefaultWidgetProperty } from "../../widgetproperties/WidgetProperty";
import { observer } from "mobx-react-lite";
import { toJS } from "mobx";
import { Flex } from "antd";
import classes from "./LayoutProperty.module.css";
import { produce } from "immer";
import LabeledContainer from "../../../LabeledContainer/LabeledContainer";
import InputNumber from "../../components/InputNumber";
import { Card } from "../../../Cards/CardsComponent";
import PictureIcon from "../../../../icons/PictureIcon";

const LayoutPropertyComponent = observer(
  ({ property }: { property: LayoutProperty }) => {
    return (
      <>
        <div className={`${classes.previews}`}>
          <Card
            selected={"1" === property.value.value}
            onClick={() => {
              property.value = produce(toJS(property.value), (draft) => {
                draft.value = "1";
              });
            }}
          >
            <Flex
              vertical
              align="center"
              justify="center"
              style={{ height: "100%" }}
            >
              <PictureIcon />
              <div>Заголовок</div>
              <div>Сообщение</div>
            </Flex>
          </Card>
          <Card
            selected={"2" === property.value.value}
            onClick={() => {
              property.value = produce(toJS(property.value), (draft) => {
                draft.value = "2";
              });
            }}
          >
            <Flex
              vertical
              align="center"
              justify="center"
              style={{ height: "100%" }}
            >
              <div>Заголовок</div>
              <PictureIcon />
              <div>Сообщение</div>
            </Flex>
          </Card>
          <Card
            selected={"3" === property.value.value}
            onClick={() => {
              property.value = produce(toJS(property.value), (draft) => {
                draft.value = "3";
              });
            }}
          >
            <Flex
              vertical
              align="center"
              justify="center"
              style={{ height: "100%" }}
            >
              <div>Заголовок</div>
              <div>Сообщение</div>
              <PictureIcon />
            </Flex>
          </Card>
          <Card
            selected={"4" === property.value.value}
            onClick={() => {
              property.value = produce(toJS(property.value), (draft) => {
                draft.value = "4";
              });
            }}
          >
            <Flex align="top" justify="center" style={{ height: "100%" }}>
              <Flex vertical>
                <div>Заголовок</div>
                <div>Сообщение</div>
              </Flex>
              <PictureIcon />
            </Flex>
          </Card>
          <Card
            selected={"5" === property.value.value}
            onClick={() => {
              property.value = produce(toJS(property.value), (draft) => {
                draft.value = "5";
              });
            }}
          >
            <Flex
              align="top"
              justify="center"
              style={{ height: "100%", width: "100%" }}
            >
              <div style={{ wordBreak: "break-all" }}>Заголовок</div>
              <PictureIcon />
              <div style={{ wordBreak: "break-all" }}>Сообщение</div>
            </Flex>
          </Card>
          <Card
            selected={"6" === property.value.value}
            onClick={() => {
              property.value = produce(toJS(property.value), (draft) => {
                draft.value = "6";
              });
            }}
          >
            <Flex
              align="top"
              justify="center"
              style={{ height: "100%", width: "100%" }}
            >
              <PictureIcon />
              <Flex vertical justify="flex-start">
                <div>Заголовок</div>
                <div>Сообщение</div>
              </Flex>
            </Flex>
          </Card>
          <Card
            selected={"7" === property.value.value}
            onClick={() => {
              property.value = produce(toJS(property.value), (draft) => {
                draft.value = "7";
              });
            }}
          >
            <Flex
              align="center"
              justify="center"
              style={{ height: "100%", width: "100%" }}
            >
              <div>
                <div>Заголовок</div>
                <div>Сообщение</div>
              </div>
              <PictureIcon />
            </Flex>
          </Card>
          <Card
            selected={"8" === property.value.value}
            onClick={() => {
              property.value = produce(toJS(property.value), (draft) => {
                draft.value = "8";
              });
            }}
          >
            <Flex
              align="center"
              justify="center"
              style={{ height: "100%", width: "100%" }}
            >
              <div style={{ width: "50px", wordBreak: "break-all" }}>
                Заголовок
              </div>
              <PictureIcon />
              <div style={{ width: "50px", wordBreak: "break-all" }}>
                Сообщение
              </div>
            </Flex>
          </Card>
          <Card
            selected={"9" === property.value.value}
            onClick={() => {
              property.value = produce(toJS(property.value), (draft) => {
                draft.value = "9";
              });
            }}
          >
            <Flex
              align="center"
              justify="center"
              style={{ height: "100%", width: "100%" }}
            >
              <PictureIcon />
              <div>
                <div>Заголовок</div>
                <div>Сообщение</div>
              </div>
            </Flex>
          </Card>
          <Card
            selected={"10" === property.value.value}
            onClick={() => {
              property.value = produce(toJS(property.value), (draft) => {
                draft.value = "10";
              });
            }}
          >
            <Flex align="flex-end" justify="center" style={{ height: "100%" }}>
              <Flex vertical justify="flex-end">
                <div>Заголовок</div>
                <div>Сообщение</div>
              </Flex>
              <PictureIcon />
            </Flex>
          </Card>
          <Card
            selected={"11" === property.value.value}
            onClick={() => {
              property.value = produce(toJS(property.value), (draft) => {
                draft.value = "11";
              });
            }}
          >
            <Flex align="flex-end" justify="center" style={{ height: "100%" }}>
              <div style={{ wordBreak: "break-all" }}>Заголовок</div>
              <PictureIcon />
              <div style={{ wordBreak: "break-all" }}>Сообщение</div>
            </Flex>
          </Card>
          <Card
            selected={"12" === property.value.value}
            onClick={() => {
              property.value = produce(toJS(property.value), (draft) => {
                draft.value = "12";
              });
            }}
          >
            <Flex align="flex-end" justify="center" style={{ height: "100%" }}>
              <PictureIcon />
              <Flex vertical justify="flex-end">
                <div>Заголовок</div>
                <div>Сообщение</div>
              </Flex>
            </Flex>
          </Card>
          <Card
            selected={"13" === property.value.value}
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
              <PictureIcon style={{ width: "100%", height: "100%" }} />
            </div>
          </Card>
          <Card
            selected={"14" === property.value.value}
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
              <PictureIcon style={{ width: "100%", height: "100%" }} />
            </div>
          </Card>
          <Card
            selected={"15" === property.value.value}
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
              <PictureIcon style={{ width: "100%", height: "100%" }} />
            </div>
          </Card>
          <Card
            selected={"16" === property.value.value}
            onClick={() => {
              property.value = produce(toJS(property.value), (draft) => {
                draft.value = "16";
              });
            }}
          >
            <div>Фиксированные координаты</div>
          </Card>
        </div>
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
      </>
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

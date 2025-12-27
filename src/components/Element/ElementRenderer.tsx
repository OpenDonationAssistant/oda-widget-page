import { observer } from "mobx-react-lite";
import { LabelElementRenderer } from "./LabelElement/LabelElementRenderer";
import { MediaElementRenderer } from "./MediaElement/MediaElementRenderer";
import { ContainerElementRenderer } from "./ContainerElement/ContainerElementRenderer";
import { Element } from "./Element";
import { MarqueeElementRenderer } from "./MarqueeElement/MarqueeElementRenderer";
import { SlideShowElementRenderer } from "./SlideShowElement/SlideShowElementRenderer";
import { QRElementRenderer } from "./QRElement/QRElementRenderer";

export const ElementRenderer = observer(
  ({ element }: { element: Element<any> }) => {
    if (element.data.type === "label") {
      return <LabelElementRenderer settings={element.data.settings} />;
    }
    if (element.data.type === "media") {
      return <MediaElementRenderer settings={element.data.settings} />;
    }
    if (element.data.type === "container") {
      return (
        <ContainerElementRenderer settings={element.data.settings}>
          {element.children.map((child) => (
            <ElementRenderer key={child.data.id} element={child} />
          ))}
        </ContainerElementRenderer>
      );
    }
    if (element.data.type === "marquee") {
      return (
        <MarqueeElementRenderer settings={element.data.settings}>
          {element.children.map((child) => (
            <ElementRenderer key={child.data.id} element={child} />
          ))}
        </MarqueeElementRenderer>
      );
    }
    if (element.data.type === "slideshow") {
      return (
        <SlideShowElementRenderer settings={element.data.settings}>
          {element.children.map((child) => (
            <ElementRenderer key={child.data.id} element={child} />
          ))}
        </SlideShowElementRenderer>
      );
    }
    if (element.data.type === "qrcode") {
      return (
        <QRElementRenderer settings={element.data.settings}/>
      );
    }
    return <></>;
  },
);

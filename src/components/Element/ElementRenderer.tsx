import { observer } from "mobx-react-lite";
import { LabelElementRenderer } from "./LabelElement/LabelElementRenderer";
import { MediaElementRenderer } from "./MediaElement/MediaElementRenderer";
import { ContainerElementRenderer } from "./ContainerElement/ContainerElementRenderer";
import { Element } from "./Element";

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
    return <></>;
  },
);

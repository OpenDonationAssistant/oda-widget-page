import { observer } from "mobx-react-lite";
import { WheelElementSettings } from "./WheelElement";
import { Wheel } from "spin-wheel";
import { useContext, useEffect, useRef, useState } from "react";
import { fullUri } from "../../../utils";
import { log } from "../../../logging";
import { ReelStoreContext } from "../../../stores/ReelStore";

const pointer = new Image(100, 100);
pointer.src =
  "https://oda-shared-static-1.hb.ru-msk.vkcloud-storage.ru/images/arrow-3.png";

const props = {
  radius: 1,
  itemLabelFont: "Mulish Variable",
  isInteractive: false,
  overlayImage: pointer,
  items: [
    {
      label: "Час супер седюсера",
    },
    {
      label: "Кусок из детского видео",
    },
    {
      label: "Какой-то вопрос",
    },
  ],
};

export const WheelElementRenderer = observer(
  ({ settings }: { settings: WheelElementSettings }) => {
    const spinRef = useRef<HTMLDivElement | null>(null);
    const [wheel, setWheel] = useState<any | null>(null);
    const [items, setItems] = useState<any>([]);
    const store = useContext(ReelStoreContext);

    useEffect(() => {
      if (!store){
        return;
      }
      Promise.all(
        store.items.map((item: any) => {
          return fullUri(item.data.backgroundImage.url).then((url) => {
            const image = new Image(500, 500);
            if (item.data.backgroundImage.url) {
              image.src = url;
            }
            const wheelItem = {
              label: item.data.name,
              labelColor: "black",
              image: url ? image : null,
              imageOpacity: 0.5,
            };
            log.debug(
              {
                origin: item.data.backgroundImage.url,
                url: url,
                wheelItem: wheelItem,
              },
              "wheelItem",
            );
            return wheelItem;
          });
        }),
      ).then((items) => {
        setItems(items);
      });
    }, [store?.items]);

    useEffect(() => {
      log.debug({ items: items }, "creating wheel");
      if (!items || items.length === 0) {
        return;
      }
      if (!store){
        return;
      }
      props.items = items;
      const wheel = new Wheel(spinRef.current, props);
      setWheel(wheel);
      if (store.items && store.selection) {
        const index = store.items.findIndex(
          (option) => option.data.name === store.selection,
        );
        log.debug(
          { index: index, selection: store.selection },
          "spinning to index",
        );
        wheel.spinToItem(index, 20000);
      }
      return () => wheel.remove();
    }, [spinRef.current, items]);

    useEffect(() => {
      if (!store){
        return;
      }
      log.debug(
        { selection: store.selection, options: store.items },
        "selection changed",
      );
      if (!store.selection && wheel) {
        wheel.stop();
        return;
      }
      if (!store.items) {
        return;
      }
      if (!wheel) {
        return;
      }
      const index = store.items.findIndex(
        (option) => option.data.name === store.selection,
      );
      wheel.spinToItem(index, 20000);
    }, [wheel, store?.selection]);

    return (
      <>
        <div ref={spinRef} style={{ width: "100%", height: "100%" }} />
      </>
    );
  },
);

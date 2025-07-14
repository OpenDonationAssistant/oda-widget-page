import { useEffect, useRef } from "react";
import { RouletteWidgetSettings } from "./RouletteWidgetSettings";
import { Wheel } from "spin-wheel";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";

const props = {
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

export default function RouletteWidget({
  settings,
}: {
  settings: RouletteWidgetSettings;
}) {
  const spinRef = useRef<HTMLDivElement | null>(null);
  const wheel = useRef<any>(null);

  useEffect(() => {
    const wheel = new Wheel(spinRef.current, props);
    return () => wheel.remove();
  }, [spinRef.current]);

  const spin = () => {
    wheel.current.spinToItem(1, 5000);
  };

  return (
    <>
      <div ref={spinRef} />
      <PrimaryButton onClick={spin}>Spin</PrimaryButton>
    </>
  );
}

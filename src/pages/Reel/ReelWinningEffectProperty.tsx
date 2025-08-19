import { observer } from "mobx-react-lite";
import { DefaultWidgetProperty } from "../../components/ConfigurationPage/widgetproperties/WidgetProperty";
import { ReactNode } from "react";
import { Flex, Segmented } from "antd";
import LabeledContainer from "../../components/LabeledContainer/LabeledContainer";
import { useTranslation } from "react-i18next";

const ReelWinningEffectPropertyComponent = observer(
  ({ property }: { property: ReelWinningEffectProperty }) => {
    const { t } = useTranslation();

    return (
      <Flex gap={12} className={`full-width`} wrap>
        <LabeledContainer displayName="Эффект для выигравшей карточки">
          <Segmented
            options={[
              { label: t("none"), value: "none" },
              { label: t("blink"), value: "blink" },
            ]}
            className="full-width"
            value={property.value.id ?? "blink"}
            onChange={(value) => (property.value = { id: value })}
          />
        </LabeledContainer>
      </Flex>
    );
  },
);

interface ReelWinningEffect {
  id: string;
}

export class ReelWinningEffectProperty extends DefaultWidgetProperty<ReelWinningEffect> {
  constructor() {
    super({
      name: "reelWinningEffect",
      value: { id: "blink" },
      displayName: "Эффект для выигравшей карточки",
    });
  }

  public copy() {
    return new ReelWinningEffectProperty();
  }

  markup(): ReactNode {
    return <ReelWinningEffectPropertyComponent property={this} />;
  }
}

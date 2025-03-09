import { Alert, FixedDonationAmountTrigger, RangeDonationAmountTrigger, UnknownTrigger } from "./Alerts";
import { Trans, useTranslation } from "react-i18next";
import { Tabs as AntTabs, Flex, Select } from "antd";
import { observer } from "mobx-react-lite";
import { log } from "../../../../logging";
import { toJS } from "mobx";
import ImageTab from "./ImageTab";
import GeneralTab from "./GeneralTab";
import { HeaderTab } from "./HeaderTab";
import { MessageTab } from "./MessageTab";
import { SoundTab } from "./SoundTab";
import { VoiceTab } from "./VoiceTab";
import PresetTab from "./PresetTab";
import { LayoutTab } from "./LayoutTab";
import { useEffect, useState } from "react";
import LabeledContainer from "../../../LabeledContainer/LabeledContainer";
import InputNumber from "../../components/InputNumber";

export const AlertComponent = observer(({ alert }: { alert: Alert }) => {
  const { t } = useTranslation();
  log.debug({ alert: toJS(alert) }, "render alert");
  const [image, setImage] = useState<string | null>(null);
  const [video, setVideo] = useState<string | null>(null);
  const [amount, setAmount] = useState<number>(() => {
    if (alert.triggers.at(0)?.type === "fixed-donation-amount") {
      return alert.triggers.at(0).amount;
    }
    if (alert.triggers.at(0)?.type === "at-least-donation-amount") {
      return alert.triggers.at(0).min;
    }
    return 0;
  });
  const updateAmount = (amount: number) => {
    log.debug({ triggers: alert.triggers }, "set amount");
    if (alert.triggers.at(0)?.type === "fixed-donation-amount") {
      alert.triggers.at(0).amount = amount;
    }
    if (alert.triggers.at(0)?.type === "at-least-donation-amount") {
      alert.triggers.at(0).min = amount;
    }
    setAmount(amount);
  };

  useEffect(() => {
    if (alert.image) {
      fetch(`${process.env.REACT_APP_FILE_API_ENDPOINT}/files/${alert.image}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access-token")}`,
        },
      })
        .then((res) => res.blob())
        .then((blob) => URL.createObjectURL(blob))
        .then((url) => {
          setImage((old) => url);
        });
    } else {
      setImage(null);
    }
    if (alert.video) {
      fetch(`${process.env.REACT_APP_FILE_API_ENDPOINT}/files/${alert.video}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access-token")}`,
        },
      })
        .then((res) => res.blob())
        .then((blob) => URL.createObjectURL(blob))
        .then((url) => {
          setVideo((old) => url);
        });
    } else {
      setVideo(null);
    }
  }, [alert.image, alert.video]);

  return (
    <div key={alert.id} className="payment-alerts-previews-item">
      <div className="settings-item">
        <LabeledContainer displayName="tab-alert-trigger">
          <Select
            value={alert.triggers.at(0)?.type}
            className="full-width"
            onChange={(e) => {
              switch (e) {
                case "fixed-donation-amount":
                  alert.triggers.splice(
                    0,
                    1,
                    new FixedDonationAmountTrigger({ amount: amount }),
                  );
                  break;
                case "at-least-donation-amount":
                  alert.triggers.splice(
                    0,
                    1,
                    new RangeDonationAmountTrigger({ min: amount, max: null }),
                  );
                  break;
                default:
                  alert.triggers.splice(0, 1, new UnknownTrigger());
                  break;
              }
            }}
            options={[
              {
                value: "fixed-donation-amount",
                label: <Trans i18nKey={"когда сумма доната равна"} />,
              },
              {
                value: "at-least-donation-amount",
                label: <Trans i18nKey={"когда сумма доната больше"} />,
              },
              {
                value: "never",
                label: <Trans i18nKey={"никогда"} />,
              },
            ]}
          />
        </LabeledContainer>
      </div>
      {alert.triggers.at(0)?.type === "fixed-donation-amount" && (
        <LabeledContainer displayName="">
          <InputNumber
            value={alert.triggers.at(0)?.amount}
            addon="руб."
            onChange={(newAmount) => {
              if (!newAmount) {
                return;
              }
              updateAmount(newAmount);
            }}
          />
        </LabeledContainer>
      )}
      {alert.triggers.at(0)?.type === "at-least-donation-amount" && (
        <LabeledContainer displayName="">
          <InputNumber
            value={alert.triggers.at(0)?.min}
            addon="руб."
            onChange={(newAmount) => {
              if (!newAmount) {
                return;
              }
              updateAmount(newAmount);
            }}
          />
        </LabeledContainer>
      )}
      <AntTabs
        type="card"
        tabPosition="top"
        items={[
          {
            key: "preset",
            label: "Готовые шаблоны",
            children: [<PresetTab alert={alert} />],
          },
          {
            key: "trigger",
            label: t("General"),
            children: [<GeneralTab alert={alert} />],
          },
          {
            key: "layout",
            label: t("Layout"),
            children: [<LayoutTab alert={alert} />],
          },
          {
            key: "sound",
            label: t("tab-alert-audio"),
            children: [<SoundTab alert={alert} />],
          },
          {
            key: "image",
            label: t("tab-alert-image"),
            children: [<ImageTab alert={alert} />],
          },
          {
            key: "header",
            label: t("tab-alert-title"),
            children: [<HeaderTab alert={alert} />],
          },
          {
            key: "message",
            label: t("tab-alert-message"),
            children: [<MessageTab alert={alert} />],
          },
          {
            key: "voice",
            label: t("tab-alert-voice"),
            children: [<VoiceTab alert={alert} />],
          },
        ]}
      />
    </div>
  );
});

import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Flex } from "antd";
import classes from "./ConnectedServices.module.css";
import TwitchIcon from "../../icons/TwitchIcon";
import VKLiveIcon from "../../icons/VKLiveIcon";
import KickIcon from "../../icons/KickIcon";
import DonationAlertsIcon from "../../icons/DonationAlertsIcon";
import DonatePayIcon from "../../icons/DonatePayIcon";
import DonateXIcon from "../../icons/DonateXIcon";
import { DefaultWorkersStore, WorkersStore } from "../../stores/WorkersStore";
import ODAIcon from "../../icons/ODAIcon";
import { useAuth } from "../../contexts/AuthContext";
import { sendMessageToSW } from "../../utils";
import { NotBorderedIconButton } from "../IconButton/IconButton";

const serviceIcons: Record<string, JSX.Element> = {
  ODA: <ODAIcon color="var(--oda-primary-color)" />,
  Twitch: <TwitchIcon />,
  VKLive: <VKLiveIcon />,
  Kick: <KickIcon />,
  DonationAlerts: <DonationAlertsIcon color="var(--oda-primary-color)" />,
  UnofficialDonationAlerts: (
    <DonationAlertsIcon color="var(--oda-primary-color)" />
  ),
  DonatePay: <DonatePayIcon color="var(--oda-primary-color)" />,
  "DonatePay.eu": <DonatePayIcon color="var(--oda-primary-color)" />,
  DonateX: <DonateXIcon color="var(--oda-primary-color)" />,
  StreamElements: <span className="material-symbols-sharp">stream</span>,
};

export default observer(function ConnectedServices() {
  const [store] = useState<WorkersStore>(() => new DefaultWorkersStore());
  const { accessToken } = useAuth();

  useEffect(() => () => store.dispose(), [store]);

  return (
    <Flex align="center" className={classes.container}>
      <span className={classes.services}>
        {store.connected.map((handler) => (
          <span className={classes.icon} key={handler} title={handler}>
            {serviceIcons[handler]}
          </span>
        ))}
      </span>
      <NotBorderedIconButton
        className={classes.reloadbutton}
        onClick={() => sendMessageToSW({ type: "Reload", token: accessToken })}
      >
        <span className="material-symbols-sharp">replay</span>
      </NotBorderedIconButton>
    </Flex>
  );
});

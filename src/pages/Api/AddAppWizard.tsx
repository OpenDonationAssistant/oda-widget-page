import { observer } from "mobx-react-lite";
import { useContext, useEffect, useState } from "react";
import {
  Wizard,
  WizardConfigurationStore,
} from "../../components/Wizard/WizardComponent";
import { CardButton } from "../../components/Cards/CardsComponent";
import { AppStore, UserApp } from "../../stores/AppStore";
import { Flex, Input } from "antd";
import Textarea from "../../components/Textarea/Textarea";
import { makeAutoObservable, reaction } from "mobx";
import classes from "./AddAppWizard.module.css";

class UserAppInfo {
  name: string;
  description: string;

  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
    makeAutoObservable(this);
  }
}

const AppInfoStep = observer(({ app }: { app: UserAppInfo }) => {
  return (
    <Flex vertical className="full-width" gap={21}>
      <Flex vertical className="full-width">
        <h3 className={`${classes.sectionname}`}>Название приложения</h3>
        <Input
          value={app.name ?? ""}
          onChange={(e) => (app.name = String(e.target.value))}
        />
      </Flex>
      <Flex vertical className="full-width">
        <h3 className={`${classes.sectionname}`}>Описание приложения</h3>
        <Textarea
          value={app.description ?? ""}
          onChange={(e) => (app.description = String(e))}
        />
      </Flex>
    </Flex>
  );
});

export const AddAppWizard = observer(({ appStore }: { appStore: AppStore }) => {
  const [app, setApp] = useState<UserAppInfo>(() => new UserAppInfo("", ""));
  const [wizardConfiguration] = useState<WizardConfigurationStore>(
    new WizardConfigurationStore({
      steps: [
        {
          title: "Добавить приложение",
          subtitle: "",
          content: <AppInfoStep app={app} />,
          handler: async () => {
            await appStore.addApp(app.name, app.description);
            return true;
          },
        },
      ],
      dynamicStepAmount: false,
      reset: () => {
        setApp(new UserAppInfo("", ""));
      },
    }),
  );

  useEffect(() => {
    reaction(
      () => app.name + app.description,
      () => {
        console.log("Checking in reaction can continue");
        wizardConfiguration.canContinue =
          app.name !== null &&
          app.name.trim() !== "" &&
          app.description !== null &&
          app.description.trim() !== "";
      },
    );
  }, [wizardConfiguration]);

  // useEffect(() => {
  //   reaction(
  //     () => selection.chat,
  //     () => {
  //       wizardConfiguration.canContinue = !!selection.chat;
  //     },
  //   );
  // }, [wizardConfiguration]);

  return (
    <>
      <Wizard configurationStore={wizardConfiguration} />
      <CardButton onClick={() => wizardConfiguration.next()} />
    </>
  );
});

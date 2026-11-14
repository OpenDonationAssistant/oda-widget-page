import { observer } from "mobx-react-lite";
import {
  Card,
  CardButton,
  CardList,
  CardSectionTitle,
  CardTitle,
} from "../../components/Cards/CardsComponent";
import { createContext, useContext, useEffect, useState } from "react";
import { GamesStoreContext } from "../../stores/GamesStore";
import {
  Wizard,
  WizardConfigurationStore,
} from "../../components/Wizard/WizardComponent";
import { makeAutoObservable, reaction } from "mobx";
import { Flex, Input, Switch } from "antd";
import CloseIcon from "../../icons/CloseIcon";
import { BorderedIconButton } from "../../components/IconButton/IconButton";
import SubActionButton from "../../components/Button/SubActionButton";
import CopyIcon from "../../icons/CopyIcon";
import classes from "./GamesSection.module.css";
import { useTranslation } from "react-i18next";

class GameSelection {
  private _game: string | null = null;
  constructor() {
    makeAutoObservable(this);
  }
  public set game(game: string | null) {
    this._game = game;
  }
  public get game(): string | null {
    return this._game;
  }
}

const GameSelectionContext = createContext<GameSelection>(new GameSelection());

const GamesList = observer(({}) => {
  const gamesStore = useContext(GamesStoreContext);
  const gamesWizardStore = useContext(GameSelectionContext);
  return (
    <CardList>
      {gamesStore.all.map((game) => (
        <Card
          key={game.id}
          selected={gamesWizardStore.game === game.id}
          onClick={() => {
            gamesWizardStore.game = game.id;
          }}
        >
          <CardTitle>{game.name}</CardTitle>
        </Card>
      ))}
    </CardList>
  );
});

const DonationListenerInstruction = observer(({}) => {
  const { t } = useTranslation();
  const data = localStorage.getItem("access-token") ?? "";

  return (
    <Flex vertical gap={20} className="full-width">
      <div className={`${classes.instructionline}`}>
        {t("integration-games-token-hint")}
      </div>
      <Flex gap={3} className="full-width" vertical align="flex-end">
        <Input className={`${classes.token}`} value={data} />
        <SubActionButton onClick={() => navigator.clipboard.writeText(data)} icon={<CopyIcon />}>
          <span>{t("integration-copy")}</span>
        </SubActionButton>
      </Flex>
    </Flex>
  );
});

export const GamesSection = observer(({}) => {
  const { t } = useTranslation();
  const gamesStore = useContext(GamesStoreContext);
  const gameSelection = useContext(GameSelectionContext);

  const [wizardConfiguration] = useState<WizardConfigurationStore>(
    new WizardConfigurationStore({
      steps: [
        {
          title: "integration-add",
          subtitle: "integration-choose-what",
          content: <GamesList />,
          condition: () => {
            return Promise.resolve(true);
          },
          handler: () => {
            return Promise.resolve(true);
          },
        },
        {
          title: "integration-add",
          subtitle: "",
          content: <DonationListenerInstruction />,
          condition: () => {
            return Promise.resolve(true);
          },
          handler: () => {
            return Promise.resolve(true);
          },
        },
      ],
      dynamicStepAmount: false,
      reset: () => {
        gameSelection.game = null;
      },
    }),
  );

  useEffect(() => {
    reaction(
      () => gameSelection.game,
      () => {
        wizardConfiguration.canContinue = !!gameSelection.game;
      },
    );
  }, [gameSelection.game, wizardConfiguration]);

  return (
    <>
      <Wizard configurationStore={wizardConfiguration} />
      <CardSectionTitle>{t("integration-games")}</CardSectionTitle>
      <CardList>
        {gamesStore.added.map((game) => (
          <Card key={game.id}>
            <CardTitle>
              <Flex className="full-width" justify="space-between">
                <Flex gap={9} align="center">
                  <div>{game.name}</div>
                  <Switch value={game.enabled} onChange={() => {}} />
                </Flex>
                <BorderedIconButton onClick={() => {}}>
                  <CloseIcon color="#FF8888" />
                </BorderedIconButton>
              </Flex>
            </CardTitle>
          </Card>
        ))}
        <CardButton
          onClick={() => {
            wizardConfiguration.next();
          }}
        />
      </CardList>
    </>
  );
});

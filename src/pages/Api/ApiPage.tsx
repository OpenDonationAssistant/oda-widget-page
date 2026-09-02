import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import classes from "./ApiPage.module.css";
import {
  Card,
  CardList,
  CardTitle,
} from "../../components/Cards/CardsComponent";
import { AddAppWizard } from "./AddAppWizard";
import { AppStore, DefaultAppStore, UserApp } from "../../stores/AppStore";
import { useContext, useState } from "react";
import {
  BorderedIconButton,
  NotBorderedIconButton,
} from "../../components/IconButton/IconButton";
import { Flex, Input } from "antd";
import CloseIcon from "../../icons/CloseIcon";
import CopyIcon from "../../icons/CopyIcon";
import {
  ModalState,
  ModalStateContext,
  Overlay,
  Panel as OverlayPanel,
  Title,
  Warning,
} from "../../components/Overlay/Overlay";
import Textarea from "../../components/Textarea/Textarea";
import PrimaryButton from "../../components/Button/PrimaryButton";
import SecondaryButton from "../../components/Button/SecondaryButton";
import { AddListItemButton } from "../../components/List/List";
import SmallLabeledContainer from "../../components/SmallLabeledContainer/SmallLabeledContainer";
import LabeledContainer from "../../components/LabeledContainer/LabeledContainer";
import Panel from "../../components/Panel/Panel";

const EditAppSettingsForm = observer(
  ({
    app,
    store,
    dialogState,
  }: {
    app: UserApp;
    store: AppStore;
    dialogState: ModalState;
  }) => {
    const [name, setName] = useState(app.name ?? "");
    const [description, setDescription] = useState(app.description ?? "");
    const [redirectUris, setRedirectUris] = useState<string[]>(
      app.redirectUris ?? [],
    );
    const [generatedSecret, setGeneratedSecret] = useState<string | null>(null);

    const updateRedirectUri = (index: number, value: string) => {
      setRedirectUris((uris) =>
        uris.map((uri, i) => (i === index ? value : uri)),
      );
    };

    const removeRedirectUri = (index: number) => {
      setRedirectUris((uris) => uris.filter((_, i) => i !== index));
    };

    const addRedirectUri = () => {
      setRedirectUris((uris) => [...uris, ""]);
    };

    const secret = generatedSecret ?? app.clientSecret ?? "";
    const showFullSecret = generatedSecret !== null;

    return (
      <Flex vertical gap={21} className="full-width">
        <Panel>
          <h4 className={`${classes.sectionname}`}>Общее</h4>
          <SmallLabeledContainer displayName="Название приложения">
            <Input
              value={name}
              onChange={(e) => setName(String(e.target.value))}
            />
          </SmallLabeledContainer>
          <SmallLabeledContainer displayName="Описание приложения">
            <Textarea value={description} onChange={setDescription} />
          </SmallLabeledContainer>
        </Panel>
        <Panel>
          <h4 className={`${classes.sectionname}`}>Настройки OpenID Connect</h4>
          <SmallLabeledContainer displayName="Client ID">
            <Input readOnly value={app.clientId} />
          </SmallLabeledContainer>
          <SmallLabeledContainer displayName="Client Secret">
            <Input
              readOnly
              value={
                showFullSecret
                  ? secret
                  : `************************************${secret}`
              }
            />
            {showFullSecret && (
              <NotBorderedIconButton
                onClick={() => navigator.clipboard.writeText(secret)}
                title="Скопировать"
              >
                <CopyIcon />
              </NotBorderedIconButton>
            )}
            <SecondaryButton
              onClick={async () => {
                const newSecret = await store.refreshClientSecret(app);
                setGeneratedSecret(newSecret);
              }}
            >
              Обновить
            </SecondaryButton>
          </SmallLabeledContainer>
          <SmallLabeledContainer displayName="Redirect URIs">
            <Flex vertical gap={6} className="full-width">
              {redirectUris.map((uri, index) => (
                <Flex key={index} gap={6} align="center" className="full-width">
                  <Input
                    value={uri}
                    onChange={(e) =>
                      updateRedirectUri(index, String(e.target.value))
                    }
                  />
                  <NotBorderedIconButton
                    onClick={() => removeRedirectUri(index)}
                  >
                    <CloseIcon color="var(--oda-color-700)" />
                  </NotBorderedIconButton>
                </Flex>
              ))}
            </Flex>
          </SmallLabeledContainer>
          <AddListItemButton label="Добавить" onClick={addRedirectUri} />
        </Panel>
        <Flex justify="flex-end" gap={9} className="full-width">
          <SecondaryButton onClick={() => (dialogState.show = false)}>
            Отменить
          </SecondaryButton>
          <PrimaryButton
            onClick={async () => {
              await store.changeAppSettings(
                app,
                name,
                description,
                redirectUris,
              );
              dialogState.show = false;
            }}
          >
            Сохранить
          </PrimaryButton>
        </Flex>
      </Flex>
    );
  },
);

const AppCard = observer(
  ({ store, app }: { store: AppStore; app: UserApp }) => {
    const parentModalState = useContext(ModalStateContext);
    const [editDialogState] = useState<ModalState>(
      () => new ModalState(parentModalState),
    );
    const [deleteDialogState] = useState<ModalState>(
      () => new ModalState(editDialogState),
    );

    return (
      <ModalStateContext.Provider value={editDialogState}>
        <Overlay>
          <OverlayPanel>
            <Title>Настройки приложения</Title>
            <EditAppSettingsForm
              app={app}
              store={store}
              dialogState={editDialogState}
            />
          </OverlayPanel>
        </Overlay>
        <ModalStateContext.Provider value={deleteDialogState}>
          <Overlay>
            <Warning
              action={async () => {
                await store.removeApp(app);
                deleteDialogState.show = false;
              }}
            >
              Вы действительно хотите удалить приложение «{app.name}»?
            </Warning>
          </Overlay>
          <Card onClick={() => (editDialogState.show = true)}>
            <Flex vertical gap={9}>
              <Flex justify="space-between">
                <CardTitle>{app.name}</CardTitle>
                <BorderedIconButton
                  onClick={() => (deleteDialogState.show = true)}
                >
                  <CloseIcon color="#FF8888" />
                </BorderedIconButton>
              </Flex>
              <div>{app.description}</div>
            </Flex>
          </Card>
        </ModalStateContext.Provider>
      </ModalStateContext.Provider>
    );
  },
);

export const ApiPage = observer(() => {
  const { t } = useTranslation();
  const [store] = useState<AppStore>(
    new DefaultAppStore(localStorage.getItem("access-token") ?? ""),
  );

  return (
    <>
      <h1>{t("menu-api")}</h1>
      <div className={`${classes.section}`}>
        <h3>Документация</h3>
        <a
          className={`${classes.href}`}
          href="https://opendonationassistant.mintlify.app/"
        >
          Описание API
        </a>
        <a
          className={`${classes.href}`}
          href="https://github.com/opendonationassistant"
        >
          GitHub
        </a>
      </div>
      <div className={`${classes.section}`}>
        <h3>Мои приложения</h3>
        <CardList>
          {store.apps.map((app) => (
            <AppCard key={app.clientId} app={app} store={store} />
          ))}
          <AddAppWizard appStore={store} />
        </CardList>
      </div>
    </>
  );
});


import { observer } from "mobx-react-lite";
import { useContext, useState } from "react";
import { Flex } from "antd";
import {
  ModalState,
  ModalStateContext,
  Dialog,
  Title,
  Overlay,
} from "../../components/Overlay/Overlay";
import { BorderedIconButton } from "../../components/IconButton/IconButton";
import AddIcon from "../../icons/AddIcon";
import CloseIcon from "../../icons/CloseIcon";
import PrimaryButton from "../../components/Button/PrimaryButton";
import SecondaryButton from "../../components/Button/SecondaryButton";
import classes from "./WordBlacklistDialog.module.css";
import { useWordBlacklistStore } from "./WordBlacklistStore";

const WordBlacklistDialogInner = observer(() => {
  const { store } = useWordBlacklistStore();
  const dialogState = useContext(ModalStateContext);
  const [input, setInput] = useState("");

  const handleAdd = () => {
    if (input.trim()) {
      store.addWord(input);
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <Dialog>
      <Title>Черный список слов</Title>
      <Flex className={classes.inputRow}>
        <input
          className={classes.input}
          placeholder="Введите слово..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <BorderedIconButton onClick={handleAdd}>
          <AddIcon color="var(--oda-primary-color)" />
        </BorderedIconButton>
      </Flex>
      <Flex className={classes.wordList}>
        {store.words.map((word) => (
          <Flex
            key={word}
            className={classes.wordItem}
            justify="space-between"
            align="center"
          >
            <span>{word}</span>
            <BorderedIconButton onClick={() => store.removeWord(word)}>
              <CloseIcon color="var(--oda-color-950)" />
            </BorderedIconButton>
          </Flex>
        ))}
      </Flex>
      <Flex gap={6} justify="flex-end">
        <SecondaryButton onClick={() => (dialogState.show = false)}>
          Отменить
        </SecondaryButton>
        <PrimaryButton
          onClick={() => {
            store.save();
            dialogState.show = false;
          }}
        >
          Сохранить
        </PrimaryButton>
      </Flex>
    </Dialog>
  );
});

export default function WordBlacklistDialog() {
  const parentModalState = useContext(ModalStateContext);
  const [dialogState] = useState<ModalState>(
    () => new ModalState(parentModalState),
  );
  const { store } = useWordBlacklistStore();

  return (
    <ModalStateContext.Provider value={dialogState}>
      <Overlay>
        <WordBlacklistDialogInner />
      </Overlay>
      <button
        className="oda-btn-default"
        onClick={() => {
          store.load();
          dialogState.open();
        }}
      >
        Настроить чёрный список
      </button>
    </ModalStateContext.Provider>
  );
}
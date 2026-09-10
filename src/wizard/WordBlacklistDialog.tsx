import { observer } from "mobx-react-lite";
import { useContext, useState } from "react";
import { Flex } from "antd";
import {
  ModalState,
  ModalStateContext,
  Dialog,
  Title,
  Overlay,
} from "../components/Overlay/Overlay";
import { WordBlacklistStore, WordBlacklistStoreContext } from "../wizards/wordBlacklistStoreistStore";
import classes from "./WordBlacklistDialog.module.css";

const WordBlacklistDialogInner = observer(() => {
  const store = useContext(WordBlacklistStoreContext)!;
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
        <button className="oda-btn-default" onClick={handleAdd}>
          +
        </button>
      </Flex>
      <Flex className={classes.wordList}>
        {store.words.map((word) => (
          <Flex key={word} className={classes.wordItem} justify="space-between" align="center">
            <span>{word}</span>
            <button
              className={classes.removeButton}
              onClick={() => store.removeWord(word)}
            >
              x
            </button>
          </Flex>
        ))}
      </Flex>
    </Dialog>
  );
});

export default function WordBlacklistDialog() {
  const parentModalState = useContext(ModalStateContext);
  const [dialogState] = useState<ModalState>(
    () => new ModalState(parentModalState),
  );
  const [store] = useState(() => new WordBlacklistStore());

  return (
    <WordBlacklistStoreContext.Provider value={store}>
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
    </WordBlacklistStoreContext.Provider>
  );
}

import { observer } from "mobx-react-lite";
import { useContext, useRef, useState } from "react";
import { Flex } from "antd";
import {
  ModalState,
  ModalStateContext,
  Dialog,
  Title,
  Overlay,
} from "../../components/Overlay/Overlay";
import {
  BorderedIconButton,
  NotBorderedIconButton,
} from "../../components/IconButton/IconButton";
import AddIcon from "../../icons/AddIcon";
import CloseIcon from "../../icons/CloseIcon";
import PrimaryButton from "../../components/Button/PrimaryButton";
import SecondaryButton from "../../components/Button/SecondaryButton";
import classes from "./WordBlacklistDialog.module.css";
import { useWordBlacklistStore } from "./WordBlacklistStore";
import { ErrorStoreContext } from "../../stores/ErrorStore";
import { log } from "../../logging";

const MAX_FILE_SIZE = 1024 * 1024;

const decodeText = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  if (bytes[0] === 0xff && bytes[1] === 0xfe) {
    return new TextDecoder("utf-16le").decode(bytes.subarray(2));
  }
  if (bytes[0] === 0xfe && bytes[1] === 0xff) {
    return new TextDecoder("utf-16be").decode(bytes.subarray(2));
  }
  const offset =
    bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf ? 3 : 0;
  const data = bytes.subarray(offset);
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(data);
  } catch {
    return new TextDecoder("windows-1251").decode(data);
  }
};

const WordBlacklistDialogInner = observer(() => {
  const { store } = useWordBlacklistStore();
  const dialogState = useContext(ModalStateContext);
  const errorStore = useContext(ErrorStoreContext);
  const [input, setInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) {
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      errorStore.setError(
        `Файл «${file.name}» больше ${MAX_FILE_SIZE / (1024 * 1024)} МБ. Загрузите файл меньшего размера.`,
      );
      return;
    }
    try {
      const content = decodeText(await file.arrayBuffer());
      const words = content
        .split(/[\r\n,;]+/)
        .map((word) => word.trim())
        .filter((word) => word.length > 0);
      if (words.length === 0) {
        errorStore.setError("В файле не найдено ни одного слова");
        return;
      }
      words.forEach((word) => store.addWord(word));
    } catch (error) {
      log.error(error, "failed to read word blacklist file");
      errorStore.setError("Не удалось прочитать файл с чёрным списком");
    }
  };

  return (
    <Dialog>
      <Title>Черный список слов</Title>
      <Flex gap={12} vertical>
        <Flex align="center" className={classes.inputRow}>
          <input
            className={classes.input}
            placeholder="Введите слово..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <NotBorderedIconButton onClick={handleAdd}>
            <AddIcon color="var(--oda-primary-color)" />
          </NotBorderedIconButton>
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
                <CloseIcon color="#FF8888" />
              </BorderedIconButton>
            </Flex>
          ))}
        </Flex>
        <Flex className="full-width" justify="space-between">
          <Flex>
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,text/plain"
              className={classes.fileInput}
              onChange={handleFileChange}
            />
            <Flex justify="flex-start">
              <SecondaryButton onClick={() => fileInputRef.current?.click()}>
                Загрузить из файла
              </SecondaryButton>
            </Flex>
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
        </Flex>
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

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
import StringListEditor from "../../components/StringListEditor/StringListEditor";
import PrimaryButton from "../../components/Button/PrimaryButton";
import SecondaryButton from "../../components/Button/SecondaryButton";
import classes from "./WordBlacklistDialog.module.css";
import { useWordBlacklistStore } from "./WordBlacklistStore";
import { ErrorStoreContext } from "../../stores/ErrorStore";
import { log } from "../../logging";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const { store } = useWordBlacklistStore();
  const dialogState = useContext(ModalStateContext);
  const errorStore = useContext(ErrorStoreContext);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) {
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      errorStore.setError(
        t("word-blacklist-file-too-large", {
          name: file.name,
          size: MAX_FILE_SIZE / (1024 * 1024),
        }),
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
        errorStore.setError(t("word-blacklist-empty-file"));
        return;
      }
      words.forEach((word) => store.addWord(word));
    } catch (error) {
      log.error(error, "failed to read word blacklist file");
      errorStore.setError(t("word-blacklist-read-failed"));
    }
  };

  return (
    <Dialog>
      <Title>{t("word-blacklist-title")}</Title>
      <Flex gap={12} vertical>
        <StringListEditor
          items={store.words}
          placeholder={t("word-blacklist-placeholder")}
          onAdd={(word) => store.addWord(word)}
          onRemove={(word) => store.removeWord(word)}
        />
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
                {t("word-blacklist-upload-file")}
              </SecondaryButton>
            </Flex>
          </Flex>
          <Flex gap={6} justify="flex-end">
            <SecondaryButton onClick={() => (dialogState.show = false)}>
              {t("button-cancel")}
            </SecondaryButton>
            <PrimaryButton
              onClick={() => {
                store.save();
                dialogState.show = false;
              }}
            >
              {t("button-save")}
            </PrimaryButton>
          </Flex>
        </Flex>
      </Flex>
    </Dialog>
  );
});

export default function WordBlacklistDialog() {
  const { t } = useTranslation();
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
        {t("word-blacklist-configure")}
      </button>
    </ModalStateContext.Provider>
  );
}

import { Flex } from "antd";
import { KeyboardEvent, useState } from "react";
import {
  BorderedIconButton,
  NotBorderedIconButton,
} from "../IconButton/IconButton";
import AddIcon from "../../icons/AddIcon";
import CloseIcon from "../../icons/CloseIcon";
import { useTranslation } from "react-i18next";
import classes from "./StringListEditor.module.css";

export default function StringListEditor({
  items,
  placeholder,
  addTitle,
  onAdd,
  onRemove,
  className,
}: {
  items: string[];
  placeholder?: string;
  addTitle?: string;
  onAdd: (value: string) => void;
  onRemove: (value: string, index: number) => void;
  className?: string;
}) {
  const { t } = useTranslation();
  const [input, setInput] = useState("");

  const handleAdd = () => {
    const value = input.trim();
    if (value.length === 0) {
      return;
    }
    onAdd(value);
    setInput("");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAdd();
    }
  };

  return (
    <Flex gap={12} vertical className={`${classes.editor} ${className ?? ""}`}>
      <Flex align="center" className={classes.inputRow}>
        <input
          className={classes.input}
          placeholder={placeholder}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleKeyDown}
        />
        <NotBorderedIconButton onClick={handleAdd} title={addTitle ?? t("common-add")}>
          <AddIcon color="var(--oda-primary-color)" />
        </NotBorderedIconButton>
      </Flex>
      <Flex className={classes.list}>
        {items.map((item, index) => (
          <Flex
            key={`${item}-${index}`}
            className={classes.item}
            justify="space-between"
            align="center"
          >
            <span>{item}</span>
            <BorderedIconButton onClick={() => onRemove(item, index)}>
              <CloseIcon color="#FF8888" />
            </BorderedIconButton>
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
}

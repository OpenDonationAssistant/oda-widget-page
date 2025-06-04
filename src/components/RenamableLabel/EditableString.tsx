import { Flex, Input } from "antd";
import { MouseEventHandler, useState } from "react";
import classes from "./EditableString.module.css";
import { observer } from "mobx-react-lite";
import EditIcon from "../../icons/EditIcon";
import { NotBorderedIconButton } from "../IconButton/IconButton";
import CheckIcon from "../../icons/CheckIcon";

export const EditableString = observer(
  ({
    label,
    placeholder,
    onChange,
    onClick
  }: {
    label: string;
    placeholder?: string;
    onChange: (newValue: string) => void;
    onClick?: MouseEventHandler<HTMLDivElement>
  }) => {
    const [edit, setEdit] = useState<boolean>(false);
    const [value, setValue] = useState<string>();

    return (
      <>
        {!edit && (
          <Flex justify="center" align="center">
            <div className={`${classes.variablename}`} onClick={onClick}>
              {label === null || label === undefined || label === ""
                ? placeholder
                : label}
            </div>
            <NotBorderedIconButton
              onClick={() => {
                setValue(label);
                setEdit(true);
              }}
            >
              <EditIcon />
            </NotBorderedIconButton>
          </Flex>
        )}
        {edit && (
          <Flex align="center" gap={6}>
            <Input
              style={{ height: "38px" }}
              value={value}
              onChange={(value) => {
                setValue((old) => value.target.value);
              }}
            />
            <NotBorderedIconButton
              onClick={() => {
                onChange(value ?? "");
                setEdit(false);
              }}
            >
              <CheckIcon color="var(--oda-color-1000)"/>
            </NotBorderedIconButton>
          </Flex>
        )}
      </>
    );
  },
);

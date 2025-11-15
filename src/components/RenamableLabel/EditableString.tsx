import { Flex, Input } from "antd";
import { MouseEventHandler, useState } from "react";
import classes from "./EditableString.module.css";
import { observer } from "mobx-react-lite";
import EditIcon from "../../icons/EditIcon";
import { NotBorderedIconButton } from "../IconButton/IconButton";
import CheckIcon from "../../icons/CheckIcon";

export const BaseEditableString = observer(
  ({
    label,
    placeholder,
    onChange,
    onClick,
    className,
    size,
  }: {
    label: string;
    placeholder?: string;
    onChange: (newValue: string) => void;
    onClick?: MouseEventHandler<HTMLDivElement>;
    className?: string;
    size: "small" | "normal";
  }) => {
    const [edit, setEdit] = useState<boolean>(false);
    const [value, setValue] = useState<string>();

    return (
      <>
        {!edit && (
          <Flex justify="center" align="center" className={className}>
            <div className={`${size === "normal" ? classes.variablename : classes.smallvariablename}`} onClick={onClick}>
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
          <Flex align="center" gap={6} className={className}>
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
              <CheckIcon color="var(--oda-color-1000)" />
            </NotBorderedIconButton>
          </Flex>
        )}
      </>
    );
  },
);

export const EditableString = observer(
  ({
    label,
    placeholder,
    onChange,
    onClick,
    className,
  }: {
    label: string;
    placeholder?: string;
    onChange: (newValue: string) => void;
    onClick?: MouseEventHandler<HTMLDivElement>;
    className?: string;
  }) => {
    return (
      <BaseEditableString
        label={label}
        placeholder={placeholder}
        onChange={onChange}
        onClick={onClick}
        className={className}
        size="normal"
      />
    );
  },
);

export const SmallEditableString = observer(
  ({
    label,
    placeholder,
    onChange,
    onClick,
    className,
  }: {
    label: string;
    placeholder?: string;
    onChange: (newValue: string) => void;
    onClick?: MouseEventHandler<HTMLDivElement>;
    className?: string;
  }) => {
    return (
      <BaseEditableString
        label={label}
        placeholder={placeholder}
        onChange={onChange}
        onClick={onClick}
        className={className}
        size="small"
      />
    );
  },
);

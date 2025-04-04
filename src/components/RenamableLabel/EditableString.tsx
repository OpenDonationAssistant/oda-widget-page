import { Button, Flex, Input } from "antd";
import { useState } from "react";
import classes from "./EditableString.module.css";
import { observer } from "mobx-react-lite";
import EditIcon from "../../icons/EditIcon";

export const EditableString = observer(
  ({
    label,
    placeholder,
    onChange,
  }: {
    label: string;
    placeholder?: string;
    onChange: (newValue: string) => void;
  }) => {
    const [edit, setEdit] = useState<boolean>(false);
    const [value, setValue] = useState<string>();

    return (
      <>
        {!edit && (
          <Flex justify="center" align="center">
            <div className={`${classes.variablename}`}>
              {label === null || label === undefined || label === ""
                ? placeholder
                : label}
            </div>
            <Button
              className={`${classes.rename} oda-icon-button`}
              onClick={() => {
                setValue(label);
                setEdit(true);
              }}
            >
              <EditIcon />
            </Button>
          </Flex>
        )}
        {edit && (
          <Flex align="center">
            <Input
              value={value}
              onChange={(value) => {
                setValue((old) => value.target.value);
              }}
            />
            <Button
              className={`${classes.rename} oda-icon-button`}
              onClick={() => {
                onChange(value ?? "");
                setEdit(false);
              }}
            >
              <span className="material-symbols-sharp">done_outline</span>
            </Button>
          </Flex>
        )}
      </>
    );
  },
);

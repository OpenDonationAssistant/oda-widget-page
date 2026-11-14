import { Button, Flex, Input, Select, Switch } from "antd";
import { useState } from "react";
import { produce } from "immer";
import { makeAutoObservable, toJS } from "mobx";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { Renderable } from "../../../utils";
import { AutomationAction } from "../AutomationState";
import LabeledContainer from "../../../components/LabeledContainer/LabeledContainer";
import Textarea from "../../../components/Textarea/Textarea";
import CloseIcon from "../../../icons/CloseIcon";

type RestMethod = "GET" | "POST" | "PUT";

export interface RestCallActionValue {
  url: string;
  method: RestMethod;
  payload: string;
  headers: Record<string, string>;
  onServer: boolean;
}

interface HeaderRow {
  name: string;
  value: string;
}

const METHODS: { label: RestMethod; value: RestMethod }[] = [
  { label: "GET", value: "GET" },
  { label: "POST", value: "POST" },
  { label: "PUT", value: "PUT" },
];

const rowsFromHeaders = (
  headers: RestCallActionValue["headers"],
): HeaderRow[] => {
  if (!headers || typeof headers !== "object" || Array.isArray(headers)) {
    return [];
  }
  return Object.entries(headers).map(([name, value]) => ({
    name,
    value: String(value),
  }));
};

const RestCallActionComponent = observer(
  ({ action }: { action: RestCallAction }) => {
    const { t } = useTranslation();
    const [rows, setRows] = useState<HeaderRow[]>(() =>
      rowsFromHeaders(action.value.headers),
    );

    const applyRows = (next: HeaderRow[]) => {
      setRows(next);
      action.value = produce(action.value, (draft) => {
        draft.headers = Object.fromEntries(
          next
            .filter((row) => row.name.trim() !== "")
            .map((row) => [row.name.trim(), row.value]),
        );
      });
    };

    return (
      <Flex vertical gap={9}>
        <LabeledContainer
          displayName="automation-rest-run-on-server"
          help={t("automation-rest-server-only-help")}
        >
          <Switch checked disabled />
        </LabeledContainer>
        <LabeledContainer displayName="automation-rest-method">
          <Select
            className="full-width"
            value={action.value.method ?? "GET"}
            options={METHODS}
            onChange={(method: RestMethod) => {
              action.value = produce(toJS(action.value), (draft) => {
                draft.method = method;
              });
            }}
          />
        </LabeledContainer>
        <LabeledContainer displayName="URL">
          <Flex vertical gap={4}>
            <Input
              value={action.value.url ?? ""}
              placeholder="https://example.com/webhook"
              onChange={(e) => {
                action.value = produce(toJS(action.value), (draft) => {
                  draft.url = e.target.value;
                });
              }}
            />
            <span
              style={{
                fontSize: 12,
                color: "var(--oda-secondary-text-color)",
              }}
            >
              {t("automation-rest-variables-hint")}
            </span>
          </Flex>
        </LabeledContainer>
        {(action.value.method ?? "GET") !== "GET" && (
          <LabeledContainer displayName="automation-rest-body">
            <Textarea
              value={action.value.payload ?? ""}
              onChange={(payload) => {
                action.value = produce(toJS(action.value), (draft) => {
                  draft.payload = payload;
                });
              }}
            />
          </LabeledContainer>
        )}
        <LabeledContainer displayName="automation-rest-headers">
          <Flex vertical gap={6} className="full-width">
            {rows.map((row, index) => (
              <Flex key={index} gap={6} align="center" className="full-width">
                <Input
                  placeholder={t("common-name")}
                  value={row.name}
                  onChange={(e) => {
                    applyRows(
                      rows.map((item, itemIndex) =>
                        itemIndex === index
                          ? { ...item, name: e.target.value }
                          : item,
                      ),
                    );
                  }}
                />
                <Input
                  placeholder={t("common-value")}
                  value={row.value}
                  onChange={(e) => {
                    applyRows(
                      rows.map((item, itemIndex) =>
                        itemIndex === index
                          ? { ...item, value: e.target.value }
                          : item,
                      ),
                    );
                  }}
                />
                <Button
                  className="oda-icon-button"
                  onClick={() =>
                    applyRows(
                      rows.filter((_, itemIndex) => itemIndex !== index),
                    )
                  }
                >
                  <CloseIcon color="#FF8888" />
                </Button>
              </Flex>
            ))}
            <Button
              onClick={() => applyRows([...rows, { name: "", value: "" }])}
            >
              {t("automation-rest-add-header")}
            </Button>
          </Flex>
        </LabeledContainer>
      </Flex>
    );
  },
);

export class RestCallAction implements AutomationAction, Renderable {
  private _value: RestCallActionValue = {
    url: "",
    method: "GET",
    payload: "",
    headers: {},
    onServer: true,
  };

  constructor() {
    makeAutoObservable(this);
  }

  public set value(value: RestCallActionValue) {
    this._value = { ...this._value, ...(value ?? {}), onServer: true };
  }

  public get value() {
    return this._value;
  }

  public get id() {
    return "rest-call";
  }

  public get name() {
    return "automation-action-rest-call";
  }

  public get markup() {
    return <RestCallActionComponent action={this} />;
  }
}

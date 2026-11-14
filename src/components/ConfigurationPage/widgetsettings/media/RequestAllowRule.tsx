import { observer } from "mobx-react-lite";
import { ReactNode } from "react";
import { Checkbox, Flex, Segmented, Typography } from "antd";
import { toJS } from "mobx";
import { DefaultWidgetProperty } from "../../widgetproperties/WidgetProperty";
import LabeledContainer from "../../../LabeledContainer/LabeledContainer";
import SmallLabeledContainer from "../../../SmallLabeledContainer/SmallLabeledContainer";
import StringListEditor from "../../../StringListEditor/StringListEditor";
import classes from "./RequestAllowRule.module.css";

export type RequestAllowMode = "all" | "selected";

export interface RequestAllowRuleValue {
  mode: RequestAllowMode;
  roles: string[];
  users: string[];
  excludedUsers: string[];
}

const roleLabels: Record<string, string> = {
  broadcaster: "Стример",
  moderator: "Модератор",
  vip: "VIP",
  subscriber: "Подписчик",
};

function normalizeNickname(nickname: string): string {
  const trimmed = nickname.trim();
  const withoutAt = trimmed.startsWith("@") ? trimmed.slice(1) : trimmed;
  return withoutAt.trim();
}

function withNickname(entries: string[], nickname: string): string[] {
  const normalized = normalizeNickname(nickname);
  if (normalized.length === 0) {
    return entries;
  }
  if (
    entries.some((entry) => entry.toLowerCase() === normalized.toLowerCase())
  ) {
    return entries;
  }
  return [...entries, normalized];
}

function NicknameList({
  displayName,
  placeholder,
  entries,
  onChange,
}: {
  displayName: string;
  placeholder: string;
  entries: string[];
  onChange: (entries: string[]) => void;
}) {
  const addNickname = (nickname: string) => {
    const updated = withNickname(entries, nickname);
    if (updated !== entries) {
      onChange(updated);
    }
  };

  return (
    <SmallLabeledContainer displayName={displayName}>
      <StringListEditor
        className={classes.paddingleft}
        items={entries}
        placeholder={placeholder}
        onAdd={addNickname}
        onRemove={(_, index) => {
          onChange(entries.filter((_, position) => position !== index));
        }}
      />
    </SmallLabeledContainer>
  );
}

const RequestAllowRuleComponent = observer(
  ({ property }: { property: RequestAllowRule }) => {
    const value = property.value;
    const nobodyAllowed = value.roles.length === 0 && value.users.length === 0;

    return (
      <LabeledContainer displayName="Кто может заказать">
        <Flex vertical gap={8} className="full-width">
          <Segmented
            className="full-width"
            options={[
              { label: "Все", value: "all" },
              { label: "Выбранные", value: "selected" },
            ]}
            value={value.mode}
            onChange={(mode) => {
              property.update({ mode: mode as RequestAllowMode });
            }}
          />
          {value.mode === "selected" && (
            <>
              <SmallLabeledContainer displayName="Роли">
                <Checkbox.Group
                  options={property.roleIds.map((roleId) => {
                    return { label: roleLabels[roleId], value: roleId };
                  })}
                  className={classes.paddingleft}
                  value={value.roles}
                  onChange={(roles) => {
                    property.update({ roles: roles as string[] });
                  }}
                />
              </SmallLabeledContainer>
              <NicknameList
                displayName="Разрешённые зрители"
                placeholder="Ник зрителя"
                entries={value.users}
                onChange={(users) => {
                  property.update({ users: users });
                }}
              />
              <NicknameList
                displayName="Запрещённые зрители"
                placeholder="Ник запрещённого зрителя"
                entries={value.excludedUsers}
                onChange={(excludedUsers) => {
                  property.update({ excludedUsers: excludedUsers });
                }}
              />
              {nobodyAllowed && (
                <Typography.Text type="secondary">
                  Никто не сможет активировать награду, пока не выбрана хотя бы
                  одна роль или не добавлен хотя бы один разрешённый зритель.
                </Typography.Text>
              )}
            </>
          )}
        </Flex>
      </LabeledContainer>
    );
  },
);

export class RequestAllowRule extends DefaultWidgetProperty<RequestAllowRuleValue> {
  private _roleIds: string[];

  constructor({ name, roleIds }: { name: string; roleIds: string[] }) {
    super({
      name: name,
      value: {
        mode: "all",
        roles: [],
        users: [],
        excludedUsers: [],
      },
      displayName: "Кто может заказать",
    });
    this._roleIds = roleIds;
  }

  public get roleIds(): string[] {
    return this._roleIds;
  }

  public update(change: Partial<RequestAllowRuleValue>): void {
    this.value = { ...toJS(this.value), ...change };
  }

  public copy(): RequestAllowRule {
    const copy = new RequestAllowRule({
      name: this.name,
      roleIds: this._roleIds,
    });
    copy.value = toJS(this.value);
    return copy;
  }

  markup(): ReactNode {
    return <RequestAllowRuleComponent property={this} />;
  }
}

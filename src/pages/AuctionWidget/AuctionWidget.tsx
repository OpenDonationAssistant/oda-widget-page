import { useMemo } from "react";
import type { CSSProperties } from "react";
import { AuctionWidgetSettings } from "./AuctionWidgetSettings";
import { AuctionWidgetStore } from "./AuctionWidgetStore";
import classes from "./AuctionWidget.module.css";

type Game = {
  key: string;
  title: string;
  amount: number;
};

export function AuctionWidget({ settings, store }: { settings: AuctionWidgetSettings; store: AuctionWidgetStore }) {
  const games = useMemo(() => aggregateGames(store.donations), [store.donations]);

  return (
    <div className={classes.auction}>
      <div className={classes.header}>
        <span>Аукцион игр</span>
        <strong>{settings.goalTitle || "Все цели"}</strong>
      </div>
      <div className={classes.wheel}>
        {games.map((game, index) => (
          <div
            key={game.key}
            className={classes.segment}
            style={{
              "--segment-color": COLORS[index % COLORS.length],
              "--segment-grow": String(1 / Math.max(1, game.amount)),
            } as CSSProperties}
          >
            <span>{game.title}</span>
            <b>{Math.round(game.amount).toLocaleString("ru-RU")} ₽</b>
          </div>
        ))}
      </div>
    </div>
  );
}

const COLORS = ["#ef3e5c", "#2ec4b6", "#f7c948", "#4d96ff", "#9b5de5", "#f15bb5"];

function aggregateGames(rows: AuctionWidgetStore["donations"]): Game[] {
  const games = new Map<string, Game>();

  for (const row of rows) {
    const title = row.text.trim();
    if (!title) continue;
    const key = title.toLocaleLowerCase("ru-RU");
    const game = games.get(key) || { key, title, amount: 0 };
    game.amount += row.amount;
    games.set(key, game);
  }

  // Тут пока без ручных правок названий: в ODA надо решить, где хранить такое состояние.
  return [...games.values()].sort((a, b) => b.amount - a.amount);
}

import { useLoaderData } from "react-router";
import { Widget } from "../../types/Widget";
import { WidgetData } from "../../types/WidgetData";
import { AuctionWidgetSettings } from "./AuctionWidgetSettings";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import classes from "./AuctionPage.module.css";

const PALETTE = ["#ef3e5c", "#2ec4b6", "#f7c948", "#4d96ff", "#9b5de5", "#f15bb5", "#00bbf9", "#8ac926"];


function formatRub(value) {
  return `${Math.round(value).toLocaleString("ru-RU")} ₽`;
}

function formatTimer(timerEndAt, now) {
  if (!timerEndAt) return "--:--";
  const left = Math.max(0, timerEndAt - now);
  const totalSeconds = Math.ceil(left / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function parseManualRows(text, fallbackNickname: string) {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const match = line.match(
        /^(\S+)\s+([\d\s.,]+)\s*(?:₽|руб\.?|rub)?\s+(.+)$/i,
      );
      if (!match) return null;

      return normalizeDonation(
        {
          id: `manual-${crypto.randomUUID()}`,
          nickname: match[1],
          amount: Number(match[2].replace(/\s/g, "").replace(",", ".")) || 0,
          text: match[3].trim(),
          source: "manual",
        },
        fallbackNickname,
      );
    })
    .filter(Boolean);
}

function DonationsTable({ rows, onDelete }) {
  const { t } = useTranslation();

  return (
    <div className="table-scroll tab-view active">
      <table>
        <thead>
          <tr>
            <th>{t("common-nickname")}</th>
            <th>{t("common-amount")}</th>
            <th>{t("auction-col-game")}</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{row.nickname}</td>
              <td>{formatRub(row.amount)}</td>
              <td>{row.text}</td>
              <td>
                <button
                  className="icon-danger"
                  onClick={() => onDelete(row.id)}
                  title={t("button-delete")}
                >
                  ×
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EditsTable({ rawGames, overrides, onChange, onDelete }) {
  const { t } = useTranslation();

  return (
    <div className="table-scroll tab-view active">
      <table>
        <thead>
          <tr>
            <th>{t("auction-col-source-title")}</th>
            <th>{t("auction-col-wheel-title")}</th>
            <th>{t("common-amount")}</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {[...rawGames.values()]
            .sort((a, b) => b.amount - a.amount)
            .map((game) => {
              const override = overrides[game.key] || {};
              return (
                <tr key={game.key}>
                  <td>
                    <strong>{game.title}</strong>
                    <br />
                    <small>
                      {t("auction-edit-meta", {
                        donations: game.donations,
                        amount: formatRub(game.amount),
                      })}
                    </small>
                  </td>
                  <td>
                    <input
                      value={override.title ?? game.title}
                      onChange={(event) =>
                        onChange(game.key, { title: event.target.value })
                      }
                    />
                  </td>
                  <td>
                    <input
                      value={override.amount ?? game.amount}
                      onChange={(event) =>
                        onChange(game.key, { amount: event.target.value })
                      }
                      type="number"
                      min="0"
                      step="1"
                    />
                  </td>
                  <td>
                    <button
                      className="icon-danger"
                      onClick={() => onDelete(game.key)}
                      title={t("button-delete")}
                    >
                      ×
                    </button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}

export function aggregateRawGames(rows) {
  const games = new Map();

  for (const row of rows) {
    const title = String(row.text || "").trim();
    if (!title) continue;

    const key = title.toLocaleLowerCase("ru-RU");
    const game = games.get(key) || {
      key,
      title,
      amount: 0,
      donors: new Map(),
      donations: 0,
    };

    game.amount += row.amount;
    game.donations += 1;
    game.donors.set(
      row.nickname,
      (game.donors.get(row.nickname) || 0) + row.amount,
    );
    games.set(key, game);
  }

  return games;
}

function normalizeDonation(row, fallbackNickname: string) {
  return {
    id: row.id || crypto.randomUUID(),
    nickname: row.nickname || fallbackNickname,
    amount: Number(row.amount || 0),
    currency: row.currency || "RUB",
    text: String(row.text || "").trim(),
    timestamp: row.timestamp || new Date().toISOString(),
    source: row.source || "manual",
    goals: row.goals || [],
  };
}

export function parseAmountOverride(value, fallback) {
  const amount = Number(value);
  return Number.isFinite(amount) && amount >= 0 ? amount : fallback;
}

function aggregateGames(rows, overrides) {
  const rawGames = aggregateRawGames(rows);
  const games = new Map();

  for (const rawGame of rawGames.values()) {
    const override = overrides[rawGame.key] || {};
    const title =
      String(override.title || rawGame.title).trim() || rawGame.title;
    const amount = parseAmountOverride(override.amount, rawGame.amount);
    const key = title.toLocaleLowerCase("ru-RU");
    const game = games.get(key) || {
      key,
      title,
      amount: 0,
      donors: new Map(),
      donations: 0,
      sourceKeys: [],
    };

    game.amount += amount;
    game.donations += rawGame.donations;
    game.sourceKeys.push(rawGame.key);

    for (const [nickname, donorAmount] of rawGame.donors.entries()) {
      const adjustedAmount =
        rawGame.amount > 0
          ? donorAmount * (amount / rawGame.amount)
          : donorAmount;
      game.donors.set(
        nickname,
        (game.donors.get(nickname) || 0) + adjustedAmount,
      );
    }

    games.set(key, game);
  }

  return games;
}

function getActiveGames(games, eliminated) {
  return [...games.values()].filter((game) => !eliminated.has(game.key));
}

function normalizeTurns(value) {
  return ((value % 1) + 1) % 1;
}

function pickWeightedSegment(segments) {
  const totalWeight = segments.reduce((sum, item) => sum + item.weight, 0);
  const pick = Math.random() * totalWeight;
  let cursor = 0;
  let start = 0;

  for (const segment of segments) {
    const size = segment.weight / totalWeight;
    if (pick >= cursor && pick < cursor + segment.weight) {
      return { segment, start, size };
    }
    cursor += segment.weight;
    start += size;
  }

  const fallback = segments.at(-1);
  return {
    segment: fallback,
    start: Math.max(0, 1 - fallback.weight / totalWeight),
    size: fallback.weight / totalWeight,
  };
}

export function getWeightedSegments(games, eliminated) {
  return getActiveGames(games, eliminated).map((game) => ({
    ...game,
    weight: 1 / Math.max(1, game.amount),
  }));
}

export default function AuctionPage() {
  const { t } = useTranslation();
  const { settings, widgetId, conf } = useLoaderData() as WidgetData;
  const widgetSettings = Widget.configFromJson(
    settings,
  ) as AuctionWidgetSettings;

  const [status, setStatus] = useState(t("auction-status-ready"));
  const [chaos, setChaos] = useState(false);
  const [goalFilter, setGoalFilter] = useState("");
  const [todayOnly, setTodayOnly] = useState(true);
  const [timerMinutes, setTimerMinutes] = useState(10);
  const [rubPerMinute, setRubPerMinute] = useState(100);
  const [manualInput, setManualInput] = useState("");
  const canvasRef = useRef(null);
  const [timerEndAt, setTimerEndAt] = useState<number | null>(null);
  const [now, setNow] = useState(Date.now());
  const timerExpired = Boolean(timerEndAt && now >= timerEndAt);
  const [timerAppliedDonationIds, setTimerAppliedDonationIds] = useState(
    new Set(),
  );
  const [currentPick, setCurrentPick] = useState("-");
  const [loadedAt, setLoadedAt] = useState("-");
  const [donations, setDonations] = useState([]);
  const [eliminated, setEliminated] = useState(new Set());
  const [gameOverrides, setGameOverrides] = useState({});
  const [rotation, setRotation] = useState(0);
  const [donationSort, setDonationSort] = useState("latest");
  const [bottomTab, setBottomTab] = useState("donations");

  const games = useMemo(
    () => aggregateGames(donations, gameOverrides),
    [donations, gameOverrides],
  );
  const rawGames = useMemo(() => aggregateRawGames(donations), [donations]);
  const gamesList = useMemo(
    () => [...games.values()].sort((a, b) => b.amount - a.amount),
    [games],
  );
  const activeGames = useMemo(
    () => getActiveGames(games, eliminated),
    [games, eliminated],
  );
  const weightedSegments = useMemo(
    () => getWeightedSegments(games, eliminated),
    [games, eliminated],
  );
  const totalAmount = donations.reduce((sum, row) => sum + row.amount, 0);

  const [spinning, setSpinning] = useState(false);
  const finalText =
    activeGames.length === 1
      ? t("auction-final-winner", { title: activeGames[0].title })
      : activeGames.length === 0
        ? t("auction-final-empty")
        : t("auction-final-remaining", { remaining: activeGames.length - 1 });

  const spinWheel = useCallback(
    (mode) => {
      if (spinning || weightedSegments.length <= 1) return;

      const selection = pickWeightedSegment(weightedSegments);
      const selectedPoint =
        selection.start +
        selection.size *
          (mode === "windmill"
            ? 0.08 + Math.random() * 0.84
            : 0.2 + Math.random() * 0.6);
      const currentTurns = normalizeTurns(rotation / 360);
      const desiredTurns = normalizeTurns(-selectedPoint);
      const turns =
        mode === "windmill"
          ? 28 + Math.floor(Math.random() * 20)
          : 5 + Math.floor(Math.random() * 3);
      const nextRotation =
        rotation + (turns + normalizeTurns(desiredTurns - currentTurns)) * 360;

      setSpinning(true);
      setChaos(mode === "windmill");
      setCurrentPick(
        mode === "windmill"
          ? t("auction-spinning-windmill")
          : t("auction-spinning"),
      );
      setRotation(nextRotation);

      window.setTimeout(() => {
        setEliminated(
          (current) => new Set([...current, selection.segment.key]),
        );
        setCurrentPick(selection.segment.title);
        setSpinning(false);
        setChaos(false);
        setStatus(
          mode === "windmill"
            ? t("auction-status-windmill-eliminated", {
                title: selection.segment.title,
              })
            : t("auction-status-eliminated", {
                title: selection.segment.title,
              }),
        );
      }, 5300);
    },
    [rotation, spinning, t, weightedSegments],
  );

  function resetTournament() {
    setDonations([]);
    setEliminated(new Set());
    setGameOverrides({});
    setTimerAppliedDonationIds(new Set());
    setRotation(0);
    setCurrentPick("-");
    setStatus(t("auction-status-tournament-reset"));
  }

  function startAuctionTimer() {
    const minutes = Math.max(1, Number(timerMinutes) || 10);
    setTimerEndAt(Date.now() + minutes * 60_000);
    setStatus(t("auction-status-timer-started", { minutes }));
  }

  function resetAuctionTimer() {
    setTimerEndAt(null);
    setTimerAppliedDonationIds(new Set());
    setStatus(t("auction-status-timer-reset"));
  }

  const sortedDonations = useMemo(
    () =>
      donations.slice().sort((a, b) => {
        if (donationSort === "amount")
          return (
            b.amount - a.amount || new Date(b.timestamp) - new Date(a.timestamp)
          );
        return new Date(b.timestamp) - new Date(a.timestamp);
      }),
    [donationSort, donations],
  );

  const isAuctionExpired = useCallback(
    () => Boolean(timerEndAt && Date.now() >= timerEndAt),
    [timerEndAt],
  );

  function deleteDonation(id) {
    setDonations((current) => current.filter((row) => row.id !== id));
    setTimerAppliedDonationIds((current) => {
      const next = new Set(current);
      next.delete(id);
      return next;
    });
    setStatus(t("auction-status-donation-deleted"));
  }

  function deleteGame(key) {
    const removed = donations.filter(
      (row) => row.text.trim().toLocaleLowerCase("ru-RU") === key,
    );
    setDonations((current) =>
      current.filter(
        (row) => row.text.trim().toLocaleLowerCase("ru-RU") !== key,
      ),
    );
    setGameOverrides((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });
    setTimerAppliedDonationIds((current) => {
      const next = new Set(current);
      for (const row of removed) next.delete(row.id);
      return next;
    });
    setStatus(t("auction-status-game-deleted"));
  }

  const extendTimerForDonations = useCallback(
    (rows, endAt = timerEndAt, appliedIds = timerAppliedDonationIds) => {
      if (!endAt || Date.now() >= endAt) return { endAt, appliedIds };

      const nextAppliedIds = new Set(appliedIds);
      const rubRate = Math.max(1, Number(rubPerMinute) || 100);
      let addedMs = 0;

      for (const row of rows) {
        if (nextAppliedIds.has(row.id)) continue;
        nextAppliedIds.add(row.id);
        addedMs += (row.amount / rubRate) * 60_000;
      }

      return {
        endAt: addedMs > 0 ? endAt + addedMs : endAt,
        appliedIds: nextAppliedIds,
      };
    },
    [rubPerMinute, timerAppliedDonationIds, timerEndAt],
  );

  function updateOverride(key, patch) {
    const rawGame = rawGames.get(key);
    if (!rawGame) return;

    setGameOverrides((current) => {
      const next = { ...current };
      const value = { ...(next[key] || {}) };

      if (Object.hasOwn(patch, "title")) {
        const title = String(patch.title).trim();
        if (title && title !== rawGame.title) value.title = title;
        else delete value.title;
      }

      if (Object.hasOwn(patch, "amount")) {
        const amount = Number(patch.amount);
        if (Number.isFinite(amount) && amount >= 0 && amount !== rawGame.amount)
          value.amount = amount;
        else delete value.amount;
      }

      if (value.title || value.amount !== undefined) next[key] = value;
      else delete next[key];
      return next;
    });
    setStatus(t("auction-status-edits-applied"));
  }

  const addDonations = useCallback(
    (rows, announce = true) => {
      const normalizedRows = rows
        .map(normalizeDonation)
        .filter((row) => row.text);
      const existingIds = new Set(donations.map((row) => row.id));
      const acceptedRows = [];
      const rejectedRows = [];

      for (const row of normalizedRows) {
        if (existingIds.has(row.id)) continue;
        if (isAuctionExpired()) {
          rejectedRows.push(row);
          continue;
        }
        existingIds.add(row.id);
        acceptedRows.push(row);
      }

      if (!acceptedRows.length && !rejectedRows.length) return;

      const timerResult = extendTimerForDonations(acceptedRows);
      setDonations((current) => [...current, ...acceptedRows]);
      setTimerEndAt(timerResult.endAt);
      setTimerAppliedDonationIds(timerResult.appliedIds);

      if (announce) {
        setStatus(
          rejectedRows.length
            ? t("auction-status-added-rejected", {
                accepted: acceptedRows.length,
                rejected: rejectedRows.length,
              })
            : t("auction-status-added", { accepted: acceptedRows.length }),
        );
      }
    },
    [donations, extendTimerForDonations, isAuctionExpired, t],
  );

  function drawWheel(canvas, segments, waitingLabel: string) {
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const center = width / 2;
    const radius = width * 0.47;
    ctx.clearRect(0, 0, width, width);

    if (!segments.length) {
      ctx.beginPath();
      ctx.arc(center, center, radius, 0, Math.PI * 2);
      ctx.fillStyle = "#20232a";
      ctx.fill();
      ctx.strokeStyle = "#30343d";
      ctx.lineWidth = 5;
      ctx.stroke();
      ctx.fillStyle = "#a8adb7";
      ctx.font = "700 36px Segoe UI, Arial";
      ctx.textAlign = "center";
      ctx.fillText(waitingLabel, center, center);
      return;
    }

    const totalWeight = segments.reduce((sum, item) => sum + item.weight, 0);
    let start = -Math.PI / 2;

    segments.forEach((segment, index) => {
      const angle = (segment.weight / totalWeight) * Math.PI * 2;
      const end = start + angle;

      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, start, end);
      ctx.closePath();
      ctx.fillStyle = PALETTE[index % PALETTE.length];
      ctx.fill();
      ctx.strokeStyle = "#101114";
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(start + angle / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "#101114";
      ctx.font = "800 25px Segoe UI, Arial";
      const label =
        segment.title.length > 24
          ? `${segment.title.slice(0, 23)}...`
          : segment.title;
      ctx.fillText(label, radius - 24, 8);
      ctx.restore();

      start = end;
    });

    ctx.beginPath();
    ctx.arc(center, center, radius * 0.18, 0, Math.PI * 2);
    ctx.fillStyle = "#101114";
    ctx.fill();
    ctx.strokeStyle = "#f4f1ea";
    ctx.lineWidth = 5;
    ctx.stroke();
  }

  useEffect(() => {
    drawWheel(canvasRef.current, weightedSegments, t("auction-wheel-waiting"));
  }, [t, weightedSegments]);

  return (
    <main className={`${classes.app}${chaos ? " shaking chaos" : ""}`}>
      <section className={`${classes.panel} ${classes.controls}`}>
        <div className={`${classes.brand}`}>
          <div>
            <h1>{t("auction-title")}</h1>
          </div>
          <div className={`${classes.status}`}>
            {status.length > 80 ? `${status.slice(0, 77)}...` : status}
          </div>
        </div>

        <label className={`${classes.field}`}>
          <span>{t("auction-goal-title")}</span>
          <input
            value={goalFilter}
            onChange={(event) => setGoalFilter(event.target.value)}
            type="text"
            placeholder={t("auction-goal-filter-placeholder")}
          />
        </label>

        <label className={`${classes.checkfield}`}>
          <input
            checked={todayOnly}
            onChange={(event) => setTodayOnly(event.target.checked)}
            type="checkbox"
          />
          <span>{t("auction-today-only")}</span>
        </label>

        <div className={`${classes.timersettings}`}>
          <label className={`${classes.field}`}>
            <span>{t("auction-timer-minutes")}</span>
            <input
              value={timerMinutes}
              onChange={(event) => setTimerMinutes(Number(event.target.value))}
              type="number"
              min="1"
              step="1"
            />
          </label>
          <label className={`${classes.field}`}>
            <span>{t("auction-rub-per-minute")}</span>
            <input
              value={rubPerMinute}
              onChange={(event) => setRubPerMinute(Number(event.target.value))}
              type="number"
              min="1"
              step="1"
            />
          </label>
        </div>

        <div className={`${classes.buttonrow}`}>
          <button onClick={startAuctionTimer} className={`${classes.ghost}`}>
            {t("auction-start-timer")}
          </button>
          <button onClick={resetAuctionTimer} className={`${classes.ghost}`}>
            {t("auction-reset-timer")}
          </button>
        </div>

        <label className={`${classes.field}`}>
          <span>{t("auction-manual-input")}</span>
          <textarea
            value={manualInput}
            onChange={(event) => setManualInput(event.target.value)}
            rows={4}
            placeholder={t("auction-manual-placeholder")}
          />
        </label>

        <div className={`${classes.buttonrow}`}>
          <button
            onClick={() => {
              const rows = parseManualRows(
                manualInput,
                t("auction-no-nickname"),
              );
              if (!rows.length) {
                setStatus(t("auction-manual-invalid"));
                return;
              }
              addDonations(rows);
              setManualInput("");
            }}
            className="ghost"
          >
            {t("auction-add-rows")}
          </button>
          <button onClick={resetTournament} className={`${classes.danger}`}>
            {t("auction-reset-tournament")}
          </button>
        </div>
      </section>

      <section className={`${classes.wheelwrap}`}>
        <canvas
          ref={canvasRef}
          width="900"
          height="900"
          style={{ transform: `rotate(${rotation}deg)` }}
        />
        <div className={`${classes.pointer}`} />
        <div className={`${classes.auctiontimer}`}>
          <span>{t("auction-until-end")}</span>
          <strong className={timerExpired ? classes.expired : ""}>
            {formatTimer(timerEndAt, now)}
          </strong>
        </div>
        <div className={`${classes.winner}`}>
          <span>{t("auction-eliminated")}</span>
          <strong>{currentPick}</strong>
        </div>
      </section>

      <section className={`${classes.panel} ${classes.spinpanel}`}>
        <div className={`${classes.metricgrid}`}>
          <div>
            <span>{t("auction-games-in-wheel")}</span>
            <strong>{activeGames.length}</strong>
          </div>
          <div>
            <span>{t("auction-donations-count")}</span>
            <strong>{donations.length}</strong>
          </div>
          <div>
            <span>{t("auction-fund")}</span>
            <strong>{formatRub(totalAmount)}</strong>
          </div>
        </div>
        <button
          onClick={() => spinWheel("normal")}
          disabled={activeGames.length <= 1 || spinning}
          className={`${classes.spin}`}
        >
          {t("button-spin")}
        </button>
        <button
          onClick={() => spinWheel("windmill")}
          disabled={activeGames.length <= 1 || spinning}
          className={`${classes.windmill}`}
        >
          {t("auction-spin-windmill")}
        </button>
        <div className={`${classes.final}`}>{finalText}</div>
      </section>

      <section className={`${classes.panel} ${classes.tablepanel}`}>
        <div className={`${classes.sectiontitle}`}>
          <div
            className={`${classes.paneltabs}`}
            role="tablist"
            aria-label={t("auction-bottom-panel")}
          >
            <button
              className={`${classes.tabbutton} ${bottomTab === "donations" ? classes.active : ""}`}
              onClick={() => setBottomTab("donations")}
              type="button"
            >
              {t("auction-tab-donations")}
            </button>
            <button
              className={`${classes.tabbutton} ${bottomTab === "edits" ? classes.active : ""}`}
              onClick={() => setBottomTab("edits")}
              type="button"
            >
              {t("auction-tab-edits")}
            </button>
          </div>
          <div className={`${classes.tabletools}`}>
            <label>
              <span>{t("auction-sort")}</span>
              <select
                value={donationSort}
                onChange={(event) => setDonationSort(event.target.value)}
              >
                <option value="latest">{t("auction-sort-latest")}</option>
                <option value="amount">{t("auction-sort-expensive")}</option>
              </select>
            </label>
            <span>{loadedAt}</span>
          </div>
        </div>

        {bottomTab === "donations" ? (
          <DonationsTable rows={sortedDonations} onDelete={deleteDonation} />
        ) : (
          <EditsTable
            rawGames={rawGames}
            overrides={gameOverrides}
            onChange={updateOverride}
            onDelete={deleteGame}
          />
        )}
      </section>

      <section className={`${classes.panel} ${classes.gamespanel}`}>
        <div className={`${classes.sectiontitle}`}>
          <h2>{t("auction-games")}</h2>
          <span>{t("auction-games-hint")}</span>
        </div>
        <div className={`${classes.gameslist}`}>
          {gamesList.map((game) => (
            <div
              key={game.key}
              className={`${classes.gamerow} ${eliminated.has(game.key) ? classes.eliminated : ""}`}
            >
              <div>
                <strong>{game.title}</strong>
                <br />
                <small>
                  {[...game.donors.entries()]
                    .map(([name, amount]) => `${name}: ${formatRub(amount)}`)
                    .join(", ")}
                </small>
              </div>
              <span>{formatRub(game.amount)}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

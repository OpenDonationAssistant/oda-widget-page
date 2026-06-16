# Borsquad Auction ODA widget draft

Эта папка - заготовка под перенос в репозиторий `oda-widget-page`.

По документации ODA виджет нужно разложить так:

- `AuctionWidgetSettings.tsx` - настройки, которые стример видит в UI.
- `AuctionWidget.tsx` - сам React-виджет для OBS.
- `AuctionWidgetPage.tsx` - страница роутера.
- `AuctionWidgetStore.ts` - место, где потом подключается реальная ODA-шина донатов.
- `AuctionWidgetDemoStore.ts` - мок для предпросмотра в настройках.

Локальная версия проекта сейчас уже переписана на React в `src/auction`.
Эту папку надо будет адаптировать под реальные импорты ODA, когда stCarolas даст скелет или доступ к репозиторию.

import { observer } from "mobx-react-lite";

export const GuidesPage = observer(({}) => {
  return (
    <>
      <div style={{ color: "white" }}>
        Раздел в разработке, в скором времени появится!
      </div>
      <div style={{ color: "white" }}>
        Пожелания и идеи, что бы вы хотели или ожидали увидеть в гайдах по ОДА, можно предлагать в личку @stCarolas или в нашей группе в{" "}
        <a
          style={{
            textDecoration: "underline",
            color: "var(--oda-primary-color)",
          }}
          onClick={() => {
            window.open("https://t.me/opendonationassistant");
          }}
        >
          телеграмме
        </a>
      </div>
    </>
  );
});

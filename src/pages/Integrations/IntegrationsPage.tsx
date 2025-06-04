export default function IntegrationsPage({}) {
  return (
    <>
      <div style={{ color: "white" }}>
        Раздел в разработке, в скором времени появится!
      </div>
      <div style={{ color: "white" }}>
        Пожелания и идеи по поводу интеграций можно предлагать в личку @stCarolas или в нашей группе в{" "}
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
}

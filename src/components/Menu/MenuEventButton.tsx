export default function MenuEventButton({
  event,
  text,
}: {
  event: string;
  text: string;
}) {
  return (
    <button
      className="btn btn-dark"
      onClick={() => {
        document.dispatchEvent(new CustomEvent(event));
      }}
    >
      {text}
    </button>
  );
}

import { observer } from "mobx-react-lite";

const TwitchIcon = observer(({}) => {
  return (
    <>
      <svg
        width="16"
        height="19"
        viewBox="0 0 16 19"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M3.2547 0H15.5799V9.12383L9.74631 14.9574H7.16745L3.89497 18.2299V14.9574H0V3.27248L3.2547 0ZM3.89502 1.29883H14.2994V8.4485L11.6672 11.0807H9.1061L6.84737 13.3394V11.0807H3.89502V1.29883Z"
          fill="var(--oda-control-color)"
        />
        <rect
          x="7.46985"
          y="3.59302"
          width="1.31611"
          height="3.91275"
          fill="var(--oda-control-color)"
        />
        <rect
          x="11.0268"
          y="3.59302"
          width="1.31611"
          height="3.91275"
          fill="var(--oda-control-color)"
        />
      </svg>
    </>
  );
});

export default TwitchIcon;

import React, { useEffect } from "react";
import { useState } from "react";

export default function RequestsDisabledWarning({}: {}) {
  const [requestsEnabled, setRequestsEnabled] = useState(true);

  useEffect(() => {
    function toggle(event) {
      setRequestsEnabled(event.detail);
    }
    document.addEventListener("toggleMediaRequests", toggle);
    return () => document.removeEventListener("toggleMediaRequests", toggle);
  }, [requestsEnabled]);

  return (
    <>
      {!requestsEnabled && (
        <div className="disabled-media-warning">
          <span className="material-symbols-sharp">priority_high</span>
          requests disabled
        </div>
      )}
    </>
  );
}

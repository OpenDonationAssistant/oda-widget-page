import React, { useEffect } from "react";
import { useState } from "react";
import { log } from "../../logging";

export default function RequestsDisabledWarning() {
  const [requestsEnabled, setRequestsEnabled] = useState(true);

  useEffect(() => {
    function toggle(event) {
      log.debug(`toggle requests: ${event.detail}`);
      setRequestsEnabled(event.detail);
    }
    log.debug("create mediawidget listener for media-requests toggler");
    document.addEventListener("toggleMediaRequests", toggle);
    return () => {
      log.debug("destroy mediawidget listener for media-requests toggler");
      document.removeEventListener("toggleMediaRequests", toggle);
    };
  }, [setRequestsEnabled]);

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

import React, { useEffect } from "react";

/* Where should the JSX for a flash message live? I thought that it
should be put inside the header but I learned that the user could 
navigate for another page just after creating a new post and it would
make the message disappear before the time we chose */
function FlashMessages(props) {
  return (
    <div className="floating-alerts">
      {props.messages.map((msg, index) => {
        return (
          <div
            key={index}
            class="alert alert-success text-center floating-alert shadow-sm"
          >
            {msg}
          </div>
        );
      })}
    </div>
  );
}

export default FlashMessages;

import React, { useContext } from "react";
import ErrorMessage from "./ErrorMessage";
import keyGen from "../utils/uniqueKeysGenerator";
import { ERRORCONTEXT } from "../App";

const ErrorContainer = () => {
  let errorContext = useContext(ERRORCONTEXT);

  return (
    <section
      style={{
        position: "fixed",
        top: "90px",
        right: "30px",
        transition: "cubic-bezier(.21,.49,.46,1.17) all 0.2s",
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        overflow: "auto",
        zIndex: 1000,
        paddingRight: "8px",
        maxHeight: "600px",
      }}
    >
      {errorContext?.errorMessagesState.map((message) => (
        <ErrorMessage
          key={keyGen()}
          message={message}
          removeErrorMessage={errorContext?.removeErrorMessage}
        />
      ))}
    </section>
  );
};

export default ErrorContainer;

import React from "react";

export default props => {
  const bodyRef = React.createRef();
  const createPdf = () => props.createPdf(bodyRef.current);
  return (
    <section className="pdf-container">
      <section className="pdf-toolbar">
        <center>
          {" "}
          <button
            style={{
              margin: "0.9em 1.5em",
              background: "blue",
              color: "white",
              padding: "0.2em 0.5em",
              fontSize: "1em"
            }}
            onClick={createPdf}
          >
            Create PDF
          </button>
        </center>
      </section>
      <section className="pdf-body" ref={bodyRef}>
        {props.children}
      </section>
    </section>
  );
};

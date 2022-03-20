import { useState } from "react";
import { css } from "@emotion/react";
import ClipLoader from "react-spinners/PropagateLoader";
import "./Loader.css";

// Can be a string as well. Need to ensure each key-value pair ends with ;
const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

function Loader() {
  let [loading, setLoading] = useState(true);
  let [color, setColor] = useState("#ADFF2F");

  return (
    <div className="sweet-loading">
      <ClipLoader color={color} loading={loading} css={override} size={15} />
    </div>
  );
}

export default Loader;

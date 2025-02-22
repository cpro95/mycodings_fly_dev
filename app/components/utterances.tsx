import * as React from "react";
import { useTheme } from "~/utils/theme";

const Utterances: React.FC = () => {
  const [theme] = useTheme();

  const utterances_theme = theme === "dark" ? "github-dark" : "github-light";

  return (
    <section
      ref={(elem) => {
        if (!elem) {
          return;
        }
        const scriptElem = document.createElement("script");
        scriptElem.src = "https://utteranc.es/client.js";
        scriptElem.async = true;
        scriptElem.setAttribute("repo", "cpro95/utterances_mycodings_fly_dev");
        scriptElem.setAttribute("issue-term", "pathname");
        scriptElem.setAttribute("theme", utterances_theme);
        scriptElem.setAttribute("label", "blog-comment");
        scriptElem.crossOrigin = "anonymous";
        elem.replaceChildren(scriptElem);
      }}
    />
  );
};

export default Utterances;

const API_BASE = "http://content.guardianapis.com/search";
const API_KEY = "teleporter-view";

/*
  --- The "React" library ---
*/

const createDOMNodeEl = (tag, propTypes = []) => (props = {}, ...children) => ({
  tag,
  attrs: Object.keys(props)
    .filter(prop => propTypes.includes(prop))
    .reduce(
      (out, prop) => ({
        ...out,
        [prop]: props[prop]
      }),
      {}
    ),
  children
});

const BASE_ATTRS = ["class"];

const DOM_NODE_SPECS = {
  div: [],
  header: ["role"],
  main: [],
  footer: [],
  nav: ["role"],
  h1: [],
  h2: [],
  ul: [],
  li: [],
  a: ["href", "title", "target"]
};

const { div, header, main, footer, nav, h1, h2, ul, li, a } = Object.entries(
  DOM_NODE_SPECS
).reduce(
  (out, [tag, attrs]) => ({
    ...out,
    [tag]: createDOMNodeEl(tag, attrs.concat(BASE_ATTRS))
  }),
  {}
);

const render = (child, node) => {
  let el;
  if (typeof child === "string") {
    el = document.createTextNode(child);
  } else {
    const { tag, attrs, children = [] } = child;
    el = document.createElement(tag);
    Object.keys(attrs).forEach(attr => {
      el.setAttribute(attr, attrs[attr]);
    });
    children.forEach(c => render(c, el));
  }
  node.appendChild(el);
};

/*
  --- The App ---
*/

/* The request logic */

// Create a query string from an object
const qs = obj =>
  `?${Object.entries(obj)
    .map(([k, v]) => `${encodeURI(k)}=${encodeURI(v)}`)
    .join("&")}`;

// Fetch the news
const fetchTheNews = async (params = {}) => {
  const queryString = qs(
    Object.assign({}, params, {
      "api-key": API_KEY
    })
  );
  const response = await fetch(`${API_BASE}${queryString}`);
  return /* await */ response.json(); // async automatically awaits return
};

/* The "React" components */

const Item = ({ webTitle, webUrl, sectionName }) =>
  li({},
    a({ href: webUrl, title: webTitle, target: "_blank" },
      `${sectionName} : ${webTitle}`
    )
  );

const Items = ({ items }) =>
  div({},
    nav({ role: "navigation" },
      ul({}, ...items.map(Item))
    )
  );

const FrontPage = (_, children = []) =>
  div({ class: "app" },
    header({},
      h1({},
        "The Guardian"
      )
    ),
    main({},
      children
    )
  );

/* Run the app */

(async () => {
  const { response: { results } } = await fetchTheNews();
  render(
    FrontPage({},
      Items({ items: results })
    ),
    document.getElementById("app")
  );
})();

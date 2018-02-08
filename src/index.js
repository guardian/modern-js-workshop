const API_BASE = "http://content.guardianapis.com/search";
const API_KEY = "0ccb3e45-8ac1-429b-90aa-456ba71ec319";

/*
  --- The VDOM library ---
*/

/*
createDOMNodeEl

Returns a factory function for creating Virtual DOM elements with
whitelisted attributes:

const div = createDOMNodeEl("div", ["class", "id", "style"]);
const header = createDOMNodeEl("header", ["class", "id", "style"]);

This will now let us call `div` or `header` with an object specifying the values
for its attributes and any children that it has. Any invalid attributes will not
be added to the VDOM element (and ultimately not to the DOM):

const vDOMHeader = header({ class: "header" });
const vDOMDiv = div({ class: "app", title: "won't appear" }, vDOMHeader);

vDOMDiv will now represent the following object which will serve as a spec to
pass to the render function:
{
  tag: 'div',
  attrs: {
    class: "app"
  },
  children: [
    {
      type: 'header',
      attrs: {
         class: "header"
      },
      children: [],
    }
  ]
}
*/

const createDOMNodeEl = (tag, allowedAttrs = []) => (
  attrs = {},
  ...children
) => ({
  tag,
  attrs: Object.entries(attrs)
    .filter(([attr]) => allowedAttrs.includes(attr))
    .reduce(
      (out, [attr, val]) => ({
        ...out,
        [attr]: val
      }),
      {}
    ),
  children
});

/*
The render function takes a VDOM representation and recurses through the nodes
(through the "children" property) and creates and appends the actual DOM nodes
*/

const render = (vDOMEl, node) => {
  let el;
  if (typeof vDOMEl === "string") {
    el = document.createTextNode(vDOMEl);
  } else {
    const { tag, attrs, children = [] } = vDOMEl;
    el = document.createElement(tag);
    Object.entries(attrs).forEach(([attr, val]) => {
      el.setAttribute(attr, val);
    });
    children.forEach(vDOMChild => render(vDOMChild, el));
  }
  node.appendChild(el);
};

/*
These contants are used to define out VDOM factories
*/
const BASE_ATTRS = ["class", "role"];
const DOM_NODE_SPECS = {
  div: [],
  header: [],
  main: [],
  footer: [],
  nav: [],
  h1: [],
  h2: [],
  ul: [],
  li: [],
  a: ["href", "title", "target"]
};

/*
createDOMNodes

Takes an array of DOM node specs (see above) and runs createDOMNodeEl on them to
create VDOM factories
*/

const createDOMNodes = (specs, baseSpecs) =>
  Object.entries(specs).reduce(
    (out, [tag, attrs]) => ({
      ...out,
      [tag]: createDOMNodeEl(tag, [...attrs, ...baseSpecs])
    }),
    {}
  );

/*
These are now are the VDOM factories to use in our app!
*/
const { div, header, main, footer, nav, h1, h2, ul, li, a } = createDOMNodes(
  DOM_NODE_SPECS,
  BASE_ATTRS
);

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
  const queryString = qs({
    ...params,
    "api-key": API_KEY
  });
  const response = await fetch(`${API_BASE}${queryString}`);
  return /* await */ response.json(); // async automatically awaits return
};

/* Higher order functions composing our VDOM factories */

const Item = ({ webTitle, webUrl, sectionName }) =>
  li({},
    a({ href: webUrl, title: webTitle, target: "_blank" },
      `${sectionName} : ${webTitle}`
    )
  );

const Items = ({ items }) =>
  div({},
    nav({ role: "navigation" },
      ul({},
        ...items.map(Item)
      )
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

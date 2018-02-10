/*
  --- The VDOM library ---
*/

const GuDOM = (() => {
  /*
  createDOMNodeEl

  Returns a factory function for creating Virtual DOM elements with any
  attributes:

  const div = createDOMNodeEl("div");
  const header = createDOMNodeEl("header");

  This will now let us call `div` or `header` with an object specifying the
  values for its attributes and any children that it has.

  const vDOMHeader = header({ class: "header" });
  const vDOMDiv = div({ class: "app" }, vDOMHeader);

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

  const createDOMNodeEl = tag => (attrs = {}, ...children) => ({
    tag,
    attrs,
    children
  });

  /*
    This function just uses an object to setAttributes on a DOM node
  */
  const setElementAttributes = (el, attrs = {}) =>
    Object.entries(attrs).forEach(([attr, val]) => {
      el.setAttribute(attr, val);
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
      setElementAttributes(el, attrs);
      children.forEach(vDOMChild => render(vDOMChild, el));
    }
    node.appendChild(el);
  };

  /*
  These strings will be used to create functions of the same name that create
  vDOM nodes that represent tags of the same name!.
  */
  const TAG_NAMES = [
    "div",
    "header",
    "main",
    "footer",
    "nav",
    "h1",
    "h2",
    "ul",
    "li",
    "a"
  ];

  /*
  createDOMNodes

  Takes an array of DOM node names and runs createDOMNodeEl on them to
  create an object with each key being a VDOM factory for that tag
  */

  const createDOMNodes = tags =>
    tags.reduce(
      (out, tag) => ({
        ...out,
        [tag]: createDOMNodeEl(tag)
      }),
      {}
    );

  /*
  These are now are the VDOM factories to use in our app!
  */
  return {
    ...createDOMNodes(TAG_NAMES),
    render
  };
})();

/*
  --- The App ---
*/

const { div, header, main, footer, nav, h1, h2, ul, li, a } = GuDOM;

/* Run the app */

(async () => {
  const { response: { results } } = await CAPI.fetchTheNews();

  const vDOM =
    div({ class: "app" },
      header({},
        h1({},
          "The Guardian"
        )
      ),
      main({},
        div({},
          nav({ role: "navigation" },
            ul({},
              ...results.map(({ webTitle, webUrl, sectionName }) =>
                li({},
                  a({ href: webUrl, title: webTitle, target: "_blank" },
                    `${sectionName} : ${webTitle}`
                  )
                )
              )
            )
          )
        )
      )
    );

  GuDOM.render(
    vDOM,
    document.getElementById("app")
  );
})();

/*
  --- The App ---
*/
import GuDOM from './lib/GuDom';
import { CAPI } from './services/CAPI';

const { div, header, main, footer, nav, h1, h2, ul, li, a, p } = GuDOM;

/* Run the app */

(async () => {
    const { response: { results } } = await CAPI.fetchLatest(10);

    const vDOM = div(
        { class: 'app' },
        header({}, h1({}, 'The Guardian')),
        main(
            {},
            div(
                {},
                h2({}, 'News'),
                nav(
                    { role: 'navigation' },
                    ul(
                        {},
                        ...results.map(({ webTitle, webUrl, sectionName }) =>
                            li(
                                {},
                                a(
                                    {
                                        href: webUrl,
                                        title: webTitle,
                                        target: '_blank',
                                        rel: 'noopener',
                                    },
                                    `${sectionName} : ${webTitle}`
                                )
                            )
                        )
                    )
                )
            )
        ),
        footer(
            {},
            p(
                {},
                `© The Guardian ${new Date().toLocaleDateString('en-GB', {
                    year: 'numeric',
                })}`
            )
        )
    );

    GuDOM.render(vDOM, document.getElementById('app'));
})();

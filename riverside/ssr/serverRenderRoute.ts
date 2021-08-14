import { RequestHandler } from 'express-serve-static-core'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { ViteDevServer } from 'vite'
import { pageLoader } from './pageLoader';

type Props = {
  vite: ViteDevServer;
}

export const serverRenderRoute =
  ({ vite }: Props): RequestHandler =>
    async (req, res) => {

      // this will be `/` or `/test` depending on the page requeste
      const url = req.originalUrl;

      try {
        let { template, Page, App, props } = await pageLoader({
          // pass the url, and vite to the pageLoader function which is essentially the next step
          url,
          vite

        });

        // render the component in the html

        const appHtml = await ReactDOMServer.renderToString(
          React.createElement(App, {
            page: {
              props,
              path: req.originalUrl,
              component: Page,
            }
          })
        );

        // inject the app-rendered HTML into the template.

        const html = template
          .replace(`<!--app-html-->`, appHtml)
          .replace(
            "</head>",
            `<script type="text/javascript">window._RIVERSIDE_PROPS_ = ${JSON.stringify(
              props
            )}</script></head>`
          );

        // Send the rendered HTML back to the client
        res.status(200).set({ "Content-Type": "text/html" }).end(html);
      } catch (e) {
        // catch errors and handle them with Vite

        vite.ssrFixStacktrace(e);
        console.error(e);
        res.status(500).end(e.message);
      }
    };



import express from 'express'
import { createServer as createViteServer } from 'vite'
import { serverRenderRoute } from './riverside/ssr/serverRenderRoute';


// Let's create a basic express app

async function createServer() {

  const app = express();

  // set vite to be on SSR Mode by creating a middleware
  const vite = await createViteServer({
    server: { middlewareMode: 'ssr' }
  });

  //calling the said SSR middleware
  app.use(vite.middlewares);

  // when a page is requested, call our SSR method
  // note this is a route that will intercept all requests
  app.use('*', serverRenderRoute({ vite }));

  // start the server
  app.listen(3000, () => console.log("Listening on :3000"));
}

createServer();
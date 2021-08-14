import fs from 'fs';
import path from 'path';
import { ViteDevServer } from "vite";
import { urlToFilePath } from "./urlToFilePath";

type Props = {
  url: string;
  vite: ViteDevServer;
}


type PageLoaderResult = {
  template: string;
  Page: any;
  App: any;
  props: any;
}

export const pageLoader = async ({
  url,
  vite,
}: Props): Promise<PageLoaderResult> => {

  // read the html file
  let template = fs.readFileSync(
    path.resolve(process.cwd(), "index.html"),
    "utf-8"
  );

  // apply the vite transforms
  // also add some vite magic like the react-refresh plugin

  template = await vite.transformIndexHtml(url, template);

  // load the server entry
  // we also didn't bundle the code since vite uses here, so we can use Node, yaay!

  const [{ default: Page, getServerSideProps }, { App }] = await Promise.all([
    vite.ssrLoadModule(`/src/pages${urlToFilePath(url)}`),
    vite.ssrLoadModule(`/riverside/entry.tsx`),
  ]);

  let props = {}
  if (getServerSideProps) props = await getServerSideProps();

  return { template, Page, props, App };

}
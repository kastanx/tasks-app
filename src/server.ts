import { createApp } from './createApp';
import { getPort } from './env';

(async () => {
  const app = await createApp();

  app.listen(getPort(), () => {
    console.debug(`App is running at`, {
      host: `http(s)://localhost:${getPort()}`,
    });
  });
})();

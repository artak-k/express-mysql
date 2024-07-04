import { router } from "./routes";
import { config } from "./config/config";
import logging from "./config/logging";
import { container } from "./container";
import { AppDataSource } from "./dataSource";

const { app } = container;
const NAMESPACE = 'SERVER';

const main = async () => {
  await AppDataSource.initialize()
  const conn = await container.createConnection();
  logging.info(NAMESPACE, `Db connection established: ${conn.options.database}`)
  app.use("/", router);

  const port = Number(config.port);
  app.listen(port, "0.0.0.0", function () {
    logging.info(NAMESPACE, `Express server has started on port ${port}`);
  });
}

main().catch(error => logging.warn(NAMESPACE, error));
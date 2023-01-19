import axios from "axios";
import { get } from "lodash";
import { BaseErrorHandler } from "../utils/ErrorHandlers/BaseErrorHandler/BaseErrorHandler";

type TExportParams = {
  query: string;
};

/** Служит для скачивания файлов с сервера, с предварительной проверкой на ошибку */
export class DownloadManager {
  private query: string;

  constructor(params: TExportParams) {
    this.query = params.query;
  }

  /** Запускает скачивание файла и обрабатывает ошибку */
  public startDownloadProcess() {
    return new Promise<void>((resolve, reject) => {
      axios
        .head(this.query)
        .then(() => {
          window.location.assign(this.query);
          resolve();
        })
        .catch(() => {
          axios.post(this.query).catch(async (error) => {
            const fetchedError = get(error, "response.data.error");

            if (fetchedError) {
              const err = await new BaseErrorHandler().prepareError(fetchedError);

              reject(err);
            }

            reject(error);
          });
        });
    });
  }
}

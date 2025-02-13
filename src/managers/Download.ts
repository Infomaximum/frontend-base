import axios from "axios";
import { get } from "lodash";
import { BaseErrorHandlerService } from "../services";

type TExportParams = {
  query: string;
};

/** Служит для скачивания файлов с сервера, с предварительной проверкой на ошибку */
export class DownloadManager {
  public static isDownload = false;
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
          DownloadManager.isDownload = true;
          window.location.assign(this.query);
          resolve();
        })
        .catch(() => {
          axios.post(this.query).catch(async (error) => {
            const fetchedError = get(error, "response.data.error");

            if (fetchedError) {
              const err = await new BaseErrorHandlerService().prepareError(fetchedError);

              reject(err);
            }

            reject(error);
          });
        })
        .finally(() => {
          DownloadManager.isDownload = false;
        });
    });
  }
}

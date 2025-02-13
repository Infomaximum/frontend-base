import { isEmpty } from "lodash";
import { compress, decompress } from "./compress";
import { historyStore } from "../store";

// /** Утилиты для работы с GET-параметрами URL */
export class SearchParamAccessor {
  private static compressParamKey = "cd";
  private static compressMethod = "deflate" as const;
  private static urlLimit = 1800;

  private static async getSearchParams(search: string) {
    let searchParams = new URLSearchParams(search);
    const compressedSearch = searchParams.get(this.compressParamKey);

    if (compressedSearch) {
      try {
        searchParams = new URLSearchParams(await decompress(compressedSearch, this.compressMethod));
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Decompress URL error:", error);
        searchParams.delete(this.compressParamKey);
      }
    }

    return searchParams;
  }

  private static async getCompressedSearch(search: string) {
    const compressedSearchParams = new URLSearchParams();

    try {
      compressedSearchParams.set(
        this.compressParamKey,
        await compress(search, this.compressMethod)
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Compress URL error:", error);
    }

    return compressedSearchParams.toString();
  }

  public static async get(search: string, key: string) {
    return (await this.getSearchParams(search)).get(key);
  }

  /**
   * @params search - строка типа ?a=1&b=2
   * @params keyValueList - список ключей и значений параметров в виде [key, value][]
   */
  public static async set(search: string, keyValueList: [string, string][]): Promise<string>;
  /**
   * @params search - строка типа ?a=1&b=2
   * @params key - ключ параметра
   * @params value - значение параметра
   */
  public static async set(search: string, key: string, value: string): Promise<string>;
  public static async set(
    search: string,
    keyOrKeyValueList: string | [string, string][],
    value?: string
  ): Promise<string> {
    const searchParams = await this.getSearchParams(search);

    let keyValueList: [string, string][] = [];

    if (typeof keyOrKeyValueList === "string") {
      keyValueList = [[keyOrKeyValueList, value ?? ""]];
    } else {
      keyValueList = keyOrKeyValueList;
    }

    keyValueList.forEach(([key, value]) => {
      if (searchParams.get(key) === value) {
        return;
      }

      if (isEmpty(value)) {
        searchParams.delete(key);
      } else {
        searchParams.set(key, value);
      }
    });

    let searchString = searchParams.toString();

    if (searchString.length > this.urlLimit) {
      searchString = await this.getCompressedSearch(searchString);
    }

    return searchString && `?${searchString}`;
  }
}

export class UrlParamAccessor {
  private static keyValueSet: Set<[string, string]> = new Set();
  private static processPromise: Promise<void> | null = null;

  public static async get(key: string) {
    return SearchParamAccessor.get(window.location.search, key);
  }

  private static async iterateKeyValueSet() {
    /**
     * https://stackoverflow.com/questions/326069/how-to-identify-if-a-webpage-is-being-loaded-inside-an-iframe-or-directly-into-t
     * Если вызывать скрипт window.location.href внутри iframe, то он вернет about:srcdoc
     */
    const isInIframe = window.self !== window.top;
    const location = isInIframe ? window.parent.location : window.location;
    let search = location.search;

    do {
      const keyValueList = Array.from(this.keyValueSet);
      this.keyValueSet.clear();

      search = await SearchParamAccessor.set(search, keyValueList);
    } while (this.keyValueSet.size > 0);

    historyStore.navigate(
      {
        search,
      },
      { replace: true }
    );

    this.processPromise = null;
  }

  public static async set(key: string, value: string) {
    this.keyValueSet.add([key, value]);

    if (!this.processPromise) {
      this.processPromise = this.iterateKeyValueSet();
    }

    await this.processPromise;
  }
}

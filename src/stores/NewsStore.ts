import { makeAutoObservable } from "mobx";
import { getFeed, markAsRead } from "@opendonationassistant/news-service";

export interface News {
  id: string;
  title: string;
  description: string;
  demoUrl: string;
}

export interface NewsStore {
  news: News[];
  markAsRead: () => void;
}

export class DefaultNewsStore {
  private _news: News[] = [];
  private _token: string;

  constructor(token: string) {
    this._token = token;
    getFeed({
      baseURL: process.env.REACT_APP_NEWS_API_ENDPOINT,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((data) => data.data)
      .then((news) => {
        this._news =
          news?.map((it) => {
            return {
              id: it.id ?? "",
              title: it.title ?? "",
              description: it.description ?? "",
              demoUrl: it.demoUrl ?? "",
            };
          }) ?? [];
      });
    makeAutoObservable(this);
  }

  public get news() {
    return this._news;
  }

  public markAsRead() {
    const id = this._news.at(0)?.id;
    if (!id) {
      return;
    }
    markAsRead({
      baseURL: process.env.REACT_APP_NEWS_API_ENDPOINT,
      headers: {
        Authorization: `Bearer ${this._token}`,
      },
      body: { newsId: id },
    });
    this._news = [];
  }
}

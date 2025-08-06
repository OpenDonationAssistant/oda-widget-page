import { DefaultApiFactory as NewsService } from "@opendonationassistant/oda-news-service-client";
import { makeAutoObservable } from "mobx";

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

  constructor() {
    this.client()
      .getFeed()
      .then((data) => data.data)
      .then((news) => {
        this._news = news.map((it) => {
          return {
            id: it.id ?? "",
            title: it.title ?? "",
            description: it.description ?? "",
            demoUrl: it.demoUrl ?? "",
          };
        });
      });
    makeAutoObservable(this);
  }

  private client() {
    return NewsService(undefined, process.env.REACT_APP_NEWS_API_ENDPOINT);
  }

  public get news() {
    return this._news;
  }

  public markAsRead() {
    const id = this._news.at(0)?.id;
    if (!id) {
      return;
    }
    this.client().markAsRead({
      newsId: id,
    });
  }
}

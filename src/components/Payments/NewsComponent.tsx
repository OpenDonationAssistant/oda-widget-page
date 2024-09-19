import React, { useEffect, useState } from "react";
import classes from "./NewsComponent.module.css";
import { Flex } from "antd";
import { DefaultApiFactory as NewsService } from "@opendonationassistant/oda-news-service-client";
import { log } from "../../logging";

interface News {
  id: string;
  title: string;
  description: string;
  demoUrl: string;
}

export default function NewsComponent({}: {}) {
  const [news, setNews] = useState<News | null>(null);
  const [progress, setProgress] = useState<number>(0);

  function clearNews() {
    setNews((prev) => {
      if (prev) {
        NewsService(
          undefined,
          process.env.REACT_APP_NEWS_API_ENDPOINT,
        ).markAsRead({
          newsId: prev.id,
        });
      }
      return null;
    });
  }

  function updateProgress() {
    setProgress((prev) => {
      if (prev < 100) {
        setTimeout(updateProgress, 30);
        return prev + 0.02;
      } else {
        clearNews();
        return 0;
      }
    });
  }

  useEffect(() => {
    if (news) {
      return;
    }
    NewsService(undefined, process.env.REACT_APP_NEWS_API_ENDPOINT)
      .getFeed()
      .then((data) => {
        setNews(
          data.data.map((it) => {
            return {
              id: it.id ?? "",
              title: it.title ?? "",
              description: it.description ?? "",
              demoUrl: it.demoUrl ?? "",
            };
          })[0],
        );
        if (data.data.length > 0) {
          setTimeout(updateProgress, 125);
        }
      });
  }, []);

  return (
    <>
      {news && (
        <div className={`${classes.newscontainer}`}>
          <div className={`${classes.closebutton}`}>
            <button
              className="material-symbols-sharp"
              onClick={() => {
                log.error("close news by hand");
                clearNews();
              }}
            >
              close
            </button>
          </div>
          <div className={`${classes.progressbar}`}>
            <div
              className={`${classes.filledprogress}`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <Flex justify="center" align="baseline">
            <div className={`${classes.newstitle}`}>{news.title}</div>
          </Flex>
          <div className={`${classes.newsbody}`}>{news.description}</div>
          {news.demoUrl && (
            <div>
              <img className={`${classes.newsdemo}`} src={news.demoUrl} />
            </div>
          )}
        </div>
      )}
    </>
  );
}

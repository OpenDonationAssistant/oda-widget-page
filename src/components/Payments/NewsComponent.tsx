import React, { useEffect, useState } from "react";
import classes from "./NewsComponent.module.css";
import { Flex } from "antd";
import { DefaultApiFactory as NewsService } from "@opendonationassistant/oda-news-service-client";

interface News {
  id: string;
  title: string;
  description: string;
  demoUrl: string;
}

export default function NewsComponent({}: {}) {
  const [news, setNews] = useState<News | null>(null);
  const [progress, setProgress] = useState<number>(0);

  function sendFeedback(rating: number) {
    setNews((prev) => {
      if (prev) {
        const service = NewsService(
          undefined,
          process.env.REACT_APP_NEWS_API_ENDPOINT,
        );
        service.createFeedback(prev.id, {
          rating: rating,
        });
        service.markAsRead({
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
        sendFeedback(-1);
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
        <Flex
          vertical={true}
          wrap={false}
          className={`${classes.newscontainer}`}
        >
          <div className={`${classes.progressbar}`}>
            <div
              className={`${classes.filledprogress}`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <Flex justify="center" align="baseline">
            <div className={`${classes.newstitle}`}>{news.title}</div>
          </Flex>
          <Flex
            className={`${classes.bodycontainer} full-width`}
            align="middle"
            justify="center"
          >
            <div className={`${classes.newsbody}`}>{news.description}</div>
            {news.demoUrl && (
              <img className={`${classes.newsdemo}`} src={news.demoUrl} />
            )}
          </Flex>
          <Flex
            className={`${classes.buttons}`}
            vertical={false}
            justify="space-around"
          >
            <img src="/icons/thumb-up.png" onClick={() => sendFeedback(10)} />
            <img src="/icons/thumb-down.png" onClick={() => sendFeedback(0)} />
          </Flex>
        </Flex>
      )}
    </>
  );
}

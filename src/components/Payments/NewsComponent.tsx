import React, { useEffect, useState } from "react";
import classes from "./NewsComponent.module.css";
import { Flex } from "antd";
import { DefaultApiFactory as NewsService } from "@opendonationassistant/oda-news-service-client";
import { useRequest } from "ahooks";

interface News {
  id: string;
  title: string;
  description: string;
  demoUrl: string;
}

export default function NewsComponent({}: {}) {
  const { data, mutate, run, loading } = useRequest<News | null, any>(
    async () => {
      const feed = await NewsService(
        undefined,
        process.env.REACT_APP_NEWS_API_ENDPOINT,
      )
        .getFeed()
        .then((data) => data.data);
      return feed.map((it) => {
        return {
          id: it.id ?? "",
          title: it.title ?? "",
          description: it.description ?? "",
          demoUrl: it.demoUrl ?? "",
        };
      })[0];
    },
  );

  function sendFeedback(rating: number) {
    mutate((prev) => {
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

  return (
    <>
      {data && (
        <Flex
          vertical={true}
          wrap={false}
          className={`${classes.newscontainer}`}
        >
          <div className={`${classes.closebutton}`}>
            <button
              className="material-symbols-sharp"
              onClick={() => {
                sendFeedback(-1);
              }}
            >
              close
            </button>
          </div>
          <Flex justify="center" align="baseline">
            <div className={`${classes.newstitle}`}>{data.title}</div>
          </Flex>
          <Flex
            className={`${classes.bodycontainer} full-width`}
            align="middle"
            justify="center"
          >
            <div className={`${classes.newsbody}`}>{data.description}</div>
            {data.demoUrl && (
              <img className={`${classes.newsdemo}`} src={data.demoUrl} />
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

import React, { useEffect, useState } from "react";
import classes from "./NewsComponent.module.css";
import { Flex } from "antd";
import { DefaultApiFactory as NewsService } from "@opendonationassistant/oda-news-service-client";
import { useRequest } from "ahooks";
import VoteUp from "../../icons/VoteUp";
import VoteDown from "../../icons/VoteDown";

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
            <a href="https://oda.digital/news">Новости</a>
            <button
              onClick={() => {
                sendFeedback(-1);
              }}
            >
              скрыть сообщение
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
            {data.demoUrl && (
              <img className={`${classes.newsdemo}`} src={data.demoUrl} />
            )}
            <div className={`${classes.newsbody}`}>{data.description}</div>
          </Flex>
          <Flex
            className={`${classes.buttons}`}
            vertical={false}
            justify="space-around"
          >
            <button onClick={() => sendFeedback(10)} ><VoteUp/></button>
            <button onClick={() => sendFeedback(0)} ><VoteDown/></button>
          </Flex>
        </Flex>
      )}
    </>
  );
}

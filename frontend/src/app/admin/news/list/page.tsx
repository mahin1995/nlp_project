"use client";

import dynamic from 'next/dynamic';

// import NewsComponent from "../../component/module/news-component/NewsComponent";
const NewsComponent=dynamic(
  () => import('../../component/module/news-component/NewsComponent'),
  { ssr: false }
);
function Page() {
  return <>
  <NewsComponent type={"view"} title={"News"} />
  </>;
  // return <></>
}

export default Page;

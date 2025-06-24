"use client";
import { useEffect } from "react";
// import PageHeaderBlock from "../../common/PageHeaderBlock";
const PageHeaderBlock=dynamic(
  () => import('../../common/PageHeaderBlock'),
  { ssr: false }
);
import { FromPage } from "../../types";
import FormView from "./component/FormView";
import TableView from "./component/TableView";
import dynamic from "next/dynamic";

function NewsComponent({ type, title }: { type: FromPage; title: string }) {
  useEffect(() => {
   document.getElementById("something");
}, []);
  return (
    <>
      <PageHeaderBlock
        title={title}
        url={"/admin/news"}
        fromPage={type}
        TableView={TableView}
        AddEditForm={FormView}
        createPermission={true}
      />
    </>
  );
}

export default NewsComponent;

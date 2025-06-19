"use client";

import PageHeaderBlock from "../../common/PageHeaderBlock";
import { FromPage } from "../../types";
import FormView from "./component/FormView";
import TableView from "./component/TableView";

function NewsComponent({ type, title }: { type: FromPage; title: string }) {
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

"use client";

import PageHeaderBlock from "../../common/PageHeaderBlock";
import { FromPage } from "../../types";
import FormView from "./component/FormView";
import TableView from "./component/TableView";

function CategoryPageComponent({ type, title }: { type: FromPage; title: string }) {
  return (
    <>
      <PageHeaderBlock
        title={title}
        url={"/admin/category"}
        fromPage={type}
        TableView={TableView}
        AddEditForm={FormView}
        createPermission={true}
      />
    </>
  );
}

export default CategoryPageComponent;

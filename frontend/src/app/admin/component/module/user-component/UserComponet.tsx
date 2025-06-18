"use client";

import PageHeaderBlock from "../../common/PageHeaderBlock";
import { FromPage } from "../../types";
import FormView from "./component/FormView";
import TableView from "./component/TableView";

function UserComponent({ type, title }: { type: FromPage; title: string }) {
  return (
    <>
      <PageHeaderBlock
        title={title}
        url={"/admin/user"}
        fromPage={type}
        TableView={TableView}
        AddEditForm={FormView}
        createPermission={true}
      />
    </>
  );
}

export default UserComponent;

// components/Layout.tsx
"use client";
import {
  CalendarOutlined,
  RightOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Layout, Menu } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BiExit } from "react-icons/bi";

const { Header, Sider, Content } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

export default function SideBarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  const items: MenuItem[] = [
    getItem("News", "", <CalendarOutlined />, [
      getItem("List", "/admin/news/list", <RightOutlined />),
      //   getItem("Pólizas", "polizas", <RightOutlined />),
    ]),
    // getItem("Contabilidad", "contabilidad", <MoneyCollectOutlined />, [
    //   getItem("Tratamientos", "tratamientos", <RightOutlined />),
    //   getItem("Gastos", "gastos", <RightOutlined />),
    //   getItem("Facturas", "facturas", <RightOutlined />),
    // ]),
    // getItem("Informes", "informes", <BarChartOutlined />, [
    //   getItem("Presupuestos", "presupuestos", <RightOutlined />),
    //   getItem("Informe médico", "informe-medico", <RightOutlined />),
    // ]),
    // getItem("Documentación", "documentacion", <FileTextOutlined />, [
    //   getItem("Firmas pendientes", "firmas-pendientes", <RightOutlined />),
    //   getItem("Documentos", "documentos", <RightOutlined />),
    // ]),
  ];
  const router = useRouter();

  let user;
  if (typeof window !== "undefined") {
    user = localStorage.getItem("user");
  }
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        width={250}
        theme="dark"
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
          style={{ paddingTop: "16px" }}
          onClick={({ key }) => {
            router.push(key);
          }}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: "#1890ff" }}>
          <div className="flex items-center justify-between h-full px-4">
            <h1 className="text-white text-xl font-semibold">INSIGHT FEED</h1>
            <div className="flex items-center space-x-4">
              <UserOutlined className="text-white text-xl" />
              <span className="text-white">{user}</span>
              <BiExit
                onClick={() => [
                  localStorage.removeItem("jwt_token"),
                  localStorage.removeItem("user"),
                  router.push("/admin/login"),
                ]}
                className="text-white text-xl cusror-pointer hover:text-red-500 transition-colors duration-200"
                title="Logout"
              />
            </div>
          </div>
        </Header>
        <Content style={{ margin: "16px" }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: "#fff",
              borderRadius: 8,
            }}
          >
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

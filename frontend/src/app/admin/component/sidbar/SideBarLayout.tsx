// components/Layout.tsx
"use client";
import {
  BarChartOutlined,
  CalendarOutlined,
  FileTextOutlined,
  MoneyCollectOutlined,
  RightOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Layout, Menu } from "antd";
import { useState } from "react";

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
    getItem("Agenda", "agenda", <CalendarOutlined />, [
      getItem("Gestión de citas", "gestion-citas", <RightOutlined />),
      getItem("Pólizas", "polizas", <RightOutlined />),
    ]),
    getItem("Contabilidad", "contabilidad", <MoneyCollectOutlined />, [
      getItem("Tratamientos", "tratamientos", <RightOutlined />),
      getItem("Gastos", "gastos", <RightOutlined />),
      getItem("Facturas", "facturas", <RightOutlined />),
    ]),
    getItem("Informes", "informes", <BarChartOutlined />, [
      getItem("Presupuestos", "presupuestos", <RightOutlined />),
      getItem("Informe médico", "informe-medico", <RightOutlined />),
    ]),
    getItem("Documentación", "documentacion", <FileTextOutlined />, [
      getItem("Firmas pendientes", "firmas-pendientes", <RightOutlined />),
      getItem("Documentos", "documentos", <RightOutlined />),
    ]),
  ];

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
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: "#1890ff" }}>
          <div className="flex items-center justify-between h-full px-4">
            <h1 className="text-white text-xl font-semibold">SALUD 360</h1>
            <div className="flex items-center space-x-4">
              <span className="text-white">Bienvenido</span>
              <UserOutlined className="text-white text-xl" />
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

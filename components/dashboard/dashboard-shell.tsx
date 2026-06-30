"use client";

import { useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LogoutOutlined, MenuOutlined } from "@ant-design/icons";
import { Button, Drawer, Grid, Layout, Menu, Tooltip } from "antd";
import Link from "@/components/link";
import { useAuth } from "@/hooks/use-auth";
import { usePermission } from "@/hooks/use-permission";
import { navItems } from "./nav-items";

const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;
const DRAWER_WIDTH = 240;

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { signOut } = useAuth();
  const { has, hasAny } = usePermission();
  const [mobileOpen, setMobileOpen] = useState(false);
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const visibleNavItems = navItems.filter(({ permission, any }) => {
    if (permission) return has(permission);
    if (any) return hasAny(any);
    return true;
  });

  const selectedKey =
    visibleNavItems.find(({ href }) =>
      href === "/" ? pathname === "/" : pathname.startsWith(href)
    )?.href ?? "/";

  const menuItems = visibleNavItems.map(({ label, href, icon: Icon }) => ({
    key: href,
    icon: <Icon />,
    label: <Link href={href}>{label}</Link>,
  }));

  const navMenu = (
    <Menu
      mode="inline"
      selectedKeys={[selectedKey]}
      items={menuItems}
      onClick={() => setMobileOpen(false)}
      style={{ borderInlineEnd: 0 }}
    />
  );

  return (
    <Layout style={{ flex: 1, minHeight: "100vh" }}>
      <Header
        style={{
          position: "fixed",
          top: 0,
          zIndex: 100,
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 8,
          paddingInline: 16,
          background: "#fff",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        {isMobile ? (
          <Button
            type="text"
            icon={<MenuOutlined />}
            aria-label="Open navigation"
            onClick={() => setMobileOpen((open) => !open)}
          />
        ) : null}

        <Link href="/" aria-label="DARCA Asset Management home">
          <Image
            src="/darca-logo.jpeg"
            alt="DARCA Asset Management"
            width={132}
            height={36}
            priority
            style={{ height: 36, width: "auto" }}
          />
        </Link>

        <div style={{ flex: 1 }} />

        <Tooltip title="Sign out">
          <Button
            type="text"
            icon={<LogoutOutlined />}
            aria-label="Sign out"
            onClick={() => void signOut()}
          />
        </Tooltip>
      </Header>

      <Layout style={{ marginTop: 64 }}>
        {!isMobile ? (
          <Sider
            width={DRAWER_WIDTH}
            style={{
              position: "fixed",
              left: 0,
              top: 64,
              bottom: 0,
              background: "#fff",
              borderRight: "1px solid #f0f0f0",
              overflow: "auto",
            }}
          >
            {navMenu}
          </Sider>
        ) : (
          <Drawer
            title="Navigation"
            placement="left"
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            width={DRAWER_WIDTH}
            styles={{ body: { padding: 0 } }}
          >
            {navMenu}
          </Drawer>
        )}

        <Content
          style={{
            marginLeft: isMobile ? 0 : DRAWER_WIDTH,
            padding: 24,
            minHeight: "calc(100vh - 64px)",
            background: "#f5f5f5",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}

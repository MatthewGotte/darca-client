"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Button, Drawer, Grid, Layout, Menu, Tooltip, Typography } from "antd";
import { useAuth } from "@/hooks/use-auth";
import { usePermission } from "@/hooks/use-permission";
import type { PermissionCode } from "@/lib/auth/permissions";
import { shellTheme } from "@/lib/shell-theme";
import { getSelectedNavKey, navGroups, type NavItem } from "./nav-items";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;
const { useBreakpoint } = Grid;
const SIDENAV_COLLAPSED_KEY = "sidenav-collapsed";

function filterNavItem(
  item: NavItem,
  has: (permission: PermissionCode) => boolean,
  hasAny: (permissions: PermissionCode[]) => boolean
) {
  if (item.permission) return has(item.permission);
  if (item.any) return hasAny(item.any);
  return true;
}

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, roles, signOut } = useAuth();
  const { has, hasAny } = usePermission();
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(SIDENAV_COLLAPSED_KEY) === "true";
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  useEffect(() => {
    localStorage.setItem(SIDENAV_COLLAPSED_KEY, String(collapsed));
  }, [collapsed]);

  const menuItems = useMemo(() => {
    return navGroups
      .map((group) => {
        const children = group.items
          .filter((item) => filterNavItem(item, has, hasAny))
          .map((item) => ({
            key: item.key,
            icon: <item.icon />,
            label: item.label,
            onClick: () => {
              router.push(item.href);
              setMobileOpen(false);
            },
          }));

        if (children.length === 0) return null;

        return {
          type: "group" as const,
          key: group.key,
          label: group.label,
          children,
        };
      })
      .filter((group) => group !== null);
  }, [has, hasAny, router]);

  const selectedKey = getSelectedNavKey(pathname);
  const onSettings = pathname.startsWith("/settings");

  const rolesTooltip =
    roles.length > 0 ? (
      <div style={{ whiteSpace: "nowrap" }}>
        <div style={{ fontWeight: 600, marginBottom: 6 }}>Assigned roles</div>
        {roles.map((role) => (
          <div key={role}>{role}</div>
        ))}
      </div>
    ) : null;

  const navMenu = (
    <Menu
      mode="inline"
      selectedKeys={selectedKey ? [selectedKey] : []}
      items={menuItems}
      theme="dark"
      style={{
        background: "transparent",
        border: "none",
        color: shellTheme.menuText,
      }}
    />
  );

  const siderContent = (
    <>
      {!isMobile ? (
        <div
          style={{
            display: "flex",
            justifyContent: collapsed ? "center" : "flex-end",
            padding: "12px 12px 4px",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ color: shellTheme.mutedText }}
            size="small"
          />
        </div>
      ) : null}
      {navMenu}
    </>
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          background: shellTheme.headerBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: isMobile ? "0 16px" : "0 24px",
          position: "sticky",
          top: 0,
          zIndex: 100,
          height: shellTheme.headerHeight,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {isMobile ? (
            <Button
              type="text"
              icon={<MenuUnfoldOutlined />}
              aria-label="Open navigation"
              onClick={() => setMobileOpen(true)}
              style={{ color: shellTheme.mutedText }}
              size="small"
            />
          ) : null}
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: shellTheme.brandAccent,
            }}
          />
          <Text
            strong
            style={{
              color: "#ffffff",
              fontSize: 16,
              letterSpacing: "0.5px",
            }}
          >
            DARCA
          </Text>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {user?.email ? (
            <Text style={{ color: shellTheme.mutedText, fontSize: 13 }}>
              {user.email}
            </Text>
          ) : null}
          {rolesTooltip ? (
            <Tooltip title={rolesTooltip} styles={{ root: { maxWidth: "none" } }}>
              <Button
                type="text"
                aria-label="Assigned roles"
                icon={<SafetyCertificateOutlined />}
                style={{ color: shellTheme.mutedText }}
                size="small"
              />
            </Tooltip>
          ) : null}
          <Tooltip title="Settings">
            <Button
              type="text"
              aria-label="Settings"
              icon={<SettingOutlined />}
              style={{ color: onSettings ? "#ffffff" : shellTheme.mutedText }}
              onClick={() => router.push("/settings")}
              size="small"
            />
          </Tooltip>
          <Tooltip title="Sign out">
            <Button
              type="text"
              aria-label="Sign out"
              icon={<LogoutOutlined />}
              style={{ color: shellTheme.mutedText }}
              onClick={() => void signOut()}
              size="small"
            />
          </Tooltip>
        </div>
      </Header>

      <Layout>
        {!isMobile ? (
          <Sider
            collapsible
            collapsed={collapsed}
            trigger={null}
            width={shellTheme.siderWidth}
            collapsedWidth={shellTheme.siderCollapsedWidth}
            style={{
              background: shellTheme.siderBg,
              borderRight: `1px solid ${shellTheme.border}`,
              height: `calc(100vh - ${shellTheme.headerHeight}px)`,
              position: "sticky",
              top: shellTheme.headerHeight,
              overflowY: "auto",
            }}
          >
            {siderContent}
          </Sider>
        ) : (
          <Drawer
            title="Navigation"
            placement="left"
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            size={shellTheme.siderWidth}
            styles={{
              header: { background: shellTheme.siderBg, color: "#fff" },
              body: { padding: 0, background: shellTheme.siderBg },
            }}
          >
            {navMenu}
          </Drawer>
        )}

        <Content
          style={{
            background: shellTheme.contentBg,
            height: `calc(100vh - ${shellTheme.headerHeight}px)`,
            overflowY: "auto",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}

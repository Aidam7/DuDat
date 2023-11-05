import {
  Navbar,
  NavbarContent,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  Button,
  NavbarMenu,
  NavbarMenuItem,
} from "@nextui-org/react";
import Link from "next/link";
import React from "react";
import LoginPanel from "~/components/auth/LoginPanel";

const DuDatNavbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  interface NavItem {
    label: string;
    href: string;
  }

  const navItems: NavItem[] = [
    { label: "My Groups", href: "/groups" },
    { label: "My Tasks", href: "/tasks" },
  ];
  return (
    <>
      <Navbar onMenuOpenChange={setIsMenuOpen} className="mb-5">
        <NavbarContent>
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="sm:hidden"
          />
          <NavbarBrand>
            <Link href="/">
              <span className="text-2xl font-bold">DuDat</span>
            </Link>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent className="hidden gap-4 sm:flex" justify="center">
          {navItems.map((item) => (
            <NavbarItem key={item.href}>
              <Link href={item.href}>{item.label}</Link>
            </NavbarItem>
          ))}
        </NavbarContent>
        <NavbarContent justify="end">
          <NavbarItem>
            <LoginPanel />
          </NavbarItem>
        </NavbarContent>
        <NavbarMenu className="font-mono">
          {navItems.map((item) => (
            <NavbarMenuItem key={item.href}>
              <Link href={item.href}>{item.label}</Link>
            </NavbarMenuItem>
          ))}
        </NavbarMenu>
      </Navbar>
    </>
  );
};

export default DuDatNavbar;

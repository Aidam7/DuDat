import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@nextui-org/react";
import Link from "next/link";
import { useState, type FC } from "react";
import LoginPanel from "~/components/auth/LoginPanel";

const DuDatNavbar: FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  interface NavItem {
    label: string;
    href: string;
  }

  const navItems: NavItem[] = [
    { label: "My Groups", href: "/groups" },
    { label: "Calendar", href: "/tasks/calendar" },
    { label: "My Tasks", href: "/tasks" },
  ];
  return (
    <>
      <Navbar
        onMenuOpenChange={setIsMenuOpen}
        isMenuOpen={isMenuOpen}
        className="mb-5 bg-blue text-white"
      >
        <NavbarContent>
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="sm:hidden"
          />
          <NavbarBrand>
            <Link href="/">
              <span className="text-4xl font-bold">DuDat</span>
            </Link>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent className="hidden gap-4 sm:flex" justify="center">
          {navItems.map((item) => (
            <NavbarItem key={item.href} className="text-2xl font-semibold">
              <Link href={item.href}>{item.label}</Link>
            </NavbarItem>
          ))}
        </NavbarContent>
        <NavbarContent justify="end">
          <NavbarItem>
            <LoginPanel />
          </NavbarItem>
        </NavbarContent>
        <NavbarMenu className="font-sans">
          {navItems.map((item) => (
            <NavbarMenuItem
              key={item.href}
              onClick={() => setIsMenuOpen(false)}
            >
              <Link href={item.href}>{item.label}</Link>
            </NavbarMenuItem>
          ))}
        </NavbarMenu>
      </Navbar>
    </>
  );
};

export default DuDatNavbar;

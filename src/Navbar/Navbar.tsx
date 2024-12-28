// Navbar.tsx
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import logo from "../assets/logo.jpeg";
import Button from "../Components/Button/Button";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface NavItem {
  name: string;
  href: string;
  current: boolean;
  roles: string[];
}

const navigation: NavItem[] = [
  // {
  //   name: "Contact",
  //   href: "#",
  //   current: false,
  //   roles: ["admin", "commuter", "operator"],
  // },
  {
    name: "Bookings",
    href: "/bookings",
    current: false,
    roles: ["admin", "commuter"],
  },
  { name: "Buses", href: "/bus", current: false, roles: ["operator"] },
  { name: "Trips", href: "/trips", current: false, roles: ["operator"] },
  { name: "Routes", href: "/CustomRoutes", current: false, roles: ["admin"] },
  { name: "Operator", href: "/addoperator", current: false, roles: ["admin"] },
];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const userDataString = localStorage.getItem("userData");
    const userData = userDataString ? JSON.parse(userDataString) : null;
    setUserRole(userData?.role || null);
    setIsAuthenticated(!!localStorage.getItem("authToken"));
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    setUserRole(null);
    setIsAuthenticated(false);
    navigate("/login");
  };

  const filteredNavigation = navigation.filter(
    (item) => !item.roles || (userRole && item.roles.includes(userRole))
  );

  return (
    <Disclosure as="nav" className="bg-gray-800">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="flex-shrink-0 flex items-center pl-0">
            <Link to="/" className="flex items-center">
              <img alt="Your Company" src={logo} className="h-11 w-auto" />
            </Link>
          </div>

          <div className="flex items-center ml-auto">
            <div className="hidden sm:block">
              <div className="flex space-x-4">
                {filteredNavigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    aria-current={item.current ? "page" : undefined}
                    className={classNames(
                      item.current
                        ? "bg-gray-900 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white",
                      "rounded-md px-3 py-2 text-sm font-medium"
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {!isAuthenticated ? (
              <Link to="/login">
                <Button>Sign in</Button>
              </Link>
            ) : (
              <Menu as="div" className="relative ml-4 z-50">
                <div>
                  <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Open user menu</span>
                    <img
                      alt=""
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      className="h-8 w-8 rounded-full"
                    />
                  </MenuButton>
                </div>
                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none z-50"
                >
                  <MenuItem>
                    <Link
                      to="/commuterprofile"
                      className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none z-50"
                    >
                      Profile
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none z-50"
                    >
                      Sign out
                    </button>
                  </MenuItem>
                </MenuItems>
              </Menu>
            )}
          </div>

          {/* Mobile menu button remains the same */}
        </div>
      </div>

      {/* Mobile menu panel remains the same but uses filteredNavigation */}
      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pb-3 pt-2">
          {filteredNavigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as="a"
              href={item.href}
              aria-current={item.current ? "page" : undefined}
              className={classNames(
                item.current
                  ? "bg-gray-900 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white",
                "block rounded-md px-3 py-2 text-base font-medium"
              )}
            >
              {item.name}
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}

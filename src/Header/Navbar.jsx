import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/redux/auth/authSlice";
import { useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

const Navbar = () => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.userInfo);
  // console.log("currentUser", currentUser);
  const userName = currentUser ? currentUser.name : null;

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const closeProfileMenu = () => {
    setIsProfileMenuOpen(false);
  };

  return (
    <>
      <div className="flex items-center justify-between w-full z-10 py-4 bg-[#FFFFFF] !shadow-md text-purple-600 h-16 ">
        <h1 className="ml-10">Dashboard</h1>
        <div className="flex items-center">
          {userName && <p className="mr-2">{userName}</p>}
          <ul className="  flex flex-shrink-0 mr-10">
            <li className="relative ">
              <button
                className="align-middle rounded-full focus:shadow-outline-purple focus:outline-none"
                onClick={toggleProfileMenu}
                onKeyDown={(e) => e.key === "Escape" && closeProfileMenu()}
                aria-label="Account"
                aria-haspopup="true"
              >
                <img
                  className="object-cover w-8 h-8 rounded-full "
                  src="https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2220431045.jpg"
                  alt=""
                  aria-hidden="true"
                />
              </button>
              {isProfileMenuOpen && (
                <ul
                  onClick={closeProfileMenu}
                  onKeyDown={(e) => e.key === "Escape" && closeProfileMenu()}
                  className="absolute right-0 w-56 p-2 mt-2 space-y-2 text-gray-600 bg-white border border-gray-100 rounded-md shadow-md dark:border-gray-700 dark:text-gray-300 dark:bg-gray-700"
                  aria-label="submenu"
                >
                  <Dialog>
                    <li className="flex">
                      <DialogTrigger asChild>
                        <Button
                          className="inline-flex items-center w-full px-2 py-1 text-sm bg-white text-gray-600 font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <svg
                            className="w-4 h-4 mr-3"
                            aria-hidden="true"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                          </svg>
                          <span>Log out</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>
                            Are you sure you want to logout?
                          </DialogTitle>
                        </DialogHeader>
                        <DialogFooter className="pt-10">
                          <DialogClose asChild>
                            <Button
                              type="button"
                              className="text-white bg-[red] hover:bg-[red]"
                              onClick={() => {
                                dispatch(logoutUser());
                              }}
                            >
                              Yes
                            </Button>
                          </DialogClose>
                          <DialogClose asChild>
                            <Button
                              type="button"
                              className="text-[black] bg-[#E2E8F0] hover:bg-[#E2E8F0]"
                            >
                              No
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </li>
                  </Dialog>
                </ul>
              )}
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Navbar;

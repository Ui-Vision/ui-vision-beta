import { AccountNavigation } from "@/components/Account/AccountNavigation";
import React from "react";

const AccountLayout = ({children} : {children : React.ReactNode}) => {
  return (
    <div className="w-full h-screen">
      <div className="w-full h-full flex">
        <div className=" hidden lg:block lg:w-[15%] 2xl:w-[12%] h-full bg-gray-700">
          <AccountNavigation />
        </div>
        <div className="w-full lg:w-[85%] 2xl:w-[88%] h-full bg-gray-900">{children}</div>
      </div>
    </div>
  );
};

export default AccountLayout;

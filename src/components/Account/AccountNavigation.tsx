"use client";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Image from "next/image";
import { FaUserCircle, FaRegEdit } from "react-icons/fa";
import UploadImage from "@/components/UploadFile";
import Link from "next/link";
import { Button } from "../ui/button";

export const AccountNavigation = () => {
  const { user, loading } = useSelector((state: RootState) => ({
    user: state.user,
    loading: state.user.loading,
  }));
  const handleUploadSuccess = (imageUrl: string) => {
    console.log("Image uploaded to:", imageUrl);
  };
  return (
    <div className="w-full h-full px-4 pt-10 pb-[90px]">
      <div className="flex flex-col  justify-between  w-full h-full">
        <div className="flex items-start">
          <div className=" relative bg-neutral-600/30 border-[0.6px] border-neutral-500 rounded-full p-2 ">
            {user?.image ? (
              <Image
                src={user.image}
                alt="Profile Image"
                width={60}
                height={60}
                className="w-[60px] h-[60px] object-cover rounded-full"
              />
            ) : (
              <FaUserCircle className="w-[60px] h-[60px]" />
            )}
            <div className=" absolute bottom-[-10px] right-[-10px]">
              <UploadImage
                buttonLabel={<FaRegEdit />}
                buttonStyle="p-2 bg-gray-500/40 rounded-[1rem] flex items-center justify-center "
                onUploadSuccess={handleUploadSuccess}
                path="profile_images"
              />
            </div>
          </div>
        </div>
        <div className="w-full">
          <div className="flex flex-col gap-y-4">
               <Link href='/account'>حساب کاربری</Link>
               <Link href='/account/products'>محصولات</Link>
               <Link href='/account/payment'>پرداخت ها</Link>
               <Link href='/account/notifications'>اعلان ها </Link>
               <Link href='/account/settings'>تنظیمات</Link>
          </div>
        </div>
        <div className="">
          <Button>خروج از حساب</Button>
        </div>
      </div>
    </div>
  );
};

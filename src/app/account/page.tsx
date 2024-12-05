"use client";
import UploadProfileImage from "@/components/UploadFile";
import Image from "next/image";
import { useSelector } from "react-redux";
import { FaRegEdit } from "react-icons/fa";
import { RootState } from "@/store/store";
import { FaUserCircle } from "react-icons/fa";
import { Skeleton } from "@/components/ui/skeleton";

const ProfilePage = () => {
  const { user, loading } = useSelector((state: RootState) => ({
    user: state.user,
    loading: state.user.loading,
  }));

  const handleUploadSuccess = (imageUrl: any) => {
    console.log("Image uploaded to:", imageUrl);
  };

  return (
    <div className="p-5">
      <div className="flex flex-col items-center justify-center">
        {loading ? (
          <div className="flex flex-col gap-5 items-center justify-center">
            <Skeleton className="w-[80px] h-[80px] rounded-full bg-gray-500" />
            <Skeleton className="w-[200px] h-[20px] bg-gray-500 " />
            <Skeleton className="w-[200px] h-[20px] bg-gray-500 " />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-6">
            <div className=" relative bg-neutral-600/30 border-[0.6px] border-neutral-500 rounded-full p-2 flex items-center justify-center">
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
                <UploadProfileImage
                  buttonLabel={<FaRegEdit />}
                  buttonStyle="p-2 bg-gray-500/40 rounded-[1rem] flex items-center justify-center "
                  onUploadSuccess={handleUploadSuccess}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <span>{user.name}</span>
              <span>{user.email}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;

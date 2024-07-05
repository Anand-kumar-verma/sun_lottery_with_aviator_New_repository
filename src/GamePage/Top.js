import { Avatar, Divider } from "@mui/material";
import React from "react";
import { BiMessageRounded } from "react-icons/bi";
import { BsSignTurnRight } from "react-icons/bs";
import { FaShare } from "react-icons/fa";
import { LuMessageCircle } from "react-icons/lu";
import { GetTopFn } from "../services/apicalling";
import { useQuery } from "react-query";
import moment from "moment";

const Top = () => {
  const { isLoading, data } = useQuery(
    ["myget"],
    () => GetTopFn(),
    {
      refetchOnMount: false,
      refetchOnReconnect: true,
    }
  );

  const result = data?.data?.data || [];
  console.log(result, "kkk")
  return (
    <div className="max-h-[90%] overflow-auto hide">
     
      {result?.map((item) => {
        return <div>
          <div className="!my-2 w-auto flex items-center justify-between">
            <div>
              <p className="flex flex-col justify-center">
                <Avatar
                  alt="Remy Sharp"
                  src="/static/images/avatar/1.jpg"
                  sx={{ width: 24, height: 24, fontSize: 10 }}
                />
                <span className="!text-[10px] text-gray-500">{item?.main_id?.username?.split("@")[0]?.substring(0, 3)}****</span>
              </p>
            </div>
            <div className="flex flex-col items-center leading-4">
              <p>
                <span className="!text-[12px] text-gray-500">
                  Bet,INR:
                </span>
                <span className="!text-[12px] text-white">{item?.amount}</span>
              </p>
              <p>
                <span className="!text-[12px] text-gray-500">
                  Cashed out:{" "}
                </span>
                <span className="!text-[12px] text-purple-400">{item?.multiplier}x</span>
              </p>
              <p>
                <span className="!text-[12px] text-gray-500">
                  Win,INR:{" "}
                </span>
                <span className="!text-[12px] text-white">{Number(item?.amountcashed || 0)?.toFixed(2)}</span>
              </p>
            </div>
            <div className="flex gap-2 items-">
              <span className="text-[15px]">
                <BsSignTurnRight className="!text-green-800" />
              </span>
            </div>
          </div>
          <div className="bg-black flex justify-between items-center px-4">
            <p className="flex gap-10 items-center">
              <span className="!text-[10px] text-gray-500"> 
                {moment(item?.createdAt)?.format("MM-YYYY")}{" "}
               </span>
              <p>
                <span className="!text-[12px] text-gray-500">Round: </span>
                <span className="!text-[12px] text-white">{item?.multiplier}x</span>
              </p>
            </p>
            <p className="rounded-full flex  items-center px-2  p-[2px] bg-gray-500 border-2 border-white">
              <FaShare className="cursor-pointer w-[10px]" />
              <LuMessageCircle className="cursor-pointer w-[10px]" />
            </p>
          </div>
          <Divider className="!bg-gray-500 !my-2" />
        </div>
      })}
    </div>
  );
};

export default Top;

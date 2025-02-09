"use client";

import { IGlobalState, setStateData } from "@/redux/slice";
import { useCookies } from "next-client-cookies";
import { useDispatch, useSelector } from "react-redux";

const useGetUserData = () => {
  const userData = useSelector((state: IGlobalState) => state.userData);
  if (userData) return userData;

  const { get: getCookies } = useCookies();
  const token = getCookies("Authorization") as string;
  const decodedToken = JSON.parse(atob(token.split(".")[1]));
  const dispatch = useDispatch();

  dispatch(setStateData({ type: "userData", value: decodedToken }));

  return decodedToken;
};

export default useGetUserData;

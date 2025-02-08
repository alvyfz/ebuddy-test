"use client";

import React, {
  ActionDispatch,
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { useCookies } from "next-client-cookies";

export type InitialStateType = {
  lang: "en" | "id";
  user: any;
  modal: {
    visible: boolean;
    title?: string;
    component: ReactNode;
    onClose?: () => void;
    hiddenClose?: boolean;
  };
};

export type GlobalContextType = [
  state: InitialStateType,
  setState: (key: string, value: any) => void,
  dispatch: ActionDispatch<[action: { type: ACTION; key: string; value: any }]>
];

const initialState: InitialStateType = {
  lang: "en",
  user: null,
  modal: {
    visible: false,
    title: "",
    component: null,
    onClose: () => { },
  },
};

enum ACTION {
  UPDATE = "UPDATE",
}

function reducer(state: InitialStateType, action: { type: ACTION; key: string; value: any }) {
  if (action.type === ACTION.UPDATE) {
    return {
      ...state,
      [action.key]: action.value,
    };
  }
  throw Error("Unknown action.");
}

const GlobalContext = createContext<GlobalContextType>({} as GlobalContextType);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { get: getCookies } = useCookies();
  const lang = getCookies("lang");
  const user = getCookies("Session");

  const setState = (key: string, value: any) => {
    dispatch({ type: ACTION.UPDATE, key, value });
  };

  useEffect(() => {
    if (lang) {
      setState("lang", lang);
    }

  }, [lang, user]);

  const value: GlobalContextType = [state, setState, dispatch];
  return <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>;
};

export const useGlobalState = () => useContext(GlobalContext);

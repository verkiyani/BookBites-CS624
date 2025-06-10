import React, { createContext, useState, Dispatch, SetStateAction } from "react";
import { Stack } from "expo-router";

interface MyListContextType {
  myList: any[];
  setMyList: Dispatch<SetStateAction<any[]>>;
}

export const MyListContext = createContext<MyListContextType>({
  myList: [],
  setMyList: () => {},
});

export default function RootLayout() {
  const [myList, setMyList] = useState<any[]>([]);

  return (
    <MyListContext.Provider value={{ myList, setMyList }}>
      <Stack>
        <Stack.Screen name="index" options={{ title: "Home" }} />
        <Stack.Screen name="MyListScreen" options={{ title: "My List" }} />
        <Stack.Screen name="BookDetailScreen" options={{ title: "Book Detail" }} />
      </Stack>
    </MyListContext.Provider>
  );
}

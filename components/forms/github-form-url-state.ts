import { useQueryStates } from "nuqs";
import { createSerializer, parseAsString } from "nuqs/server";

const searchParams = {
  username: parseAsString,
};

export const serializeFormSearchParams = createSerializer(searchParams);

export const useInitialUsername = () => {
  const [{ username }] = useQueryStates(searchParams);
  return username;
};

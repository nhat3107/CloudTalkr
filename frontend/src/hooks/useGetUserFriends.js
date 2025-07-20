import { useQuery } from "@tanstack/react-query";
import { getUserFriends } from "../lib/api";

const useGetUserFriends = () => {
  return useQuery({
    queryKey: ["user-friends"],
    queryFn: getUserFriends,
  });
};

export default useGetUserFriends;

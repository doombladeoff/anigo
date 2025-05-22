import { RequestProps } from "@/interfaces/ShikimoriRequest.interfaces";
import { OrderEnum } from "@/constants/OrderEnum";

export const QLRequestDefaultProps: RequestProps = {
  kind: ["tv"],
  duration: ["D", "F"],
  rating: ["pg_13", "r", "r_plus"],
  order: OrderEnum.ranked,
};

export const topProps: RequestProps = {
  status: ["ongoing", "released"],
  limit: 20,
  ...QLRequestDefaultProps,
};

export const onScreenProps: RequestProps = {
  status: ["ongoing"],
  limit: 20,
  ...QLRequestDefaultProps,
};

export const defaultFilters: RequestProps = {
  season: '!ancient',
  kind: ['tv', 'movie', 'tv_special', 'ova'],
  rating: ['pg_13', 'r', 'r_plus'],
}
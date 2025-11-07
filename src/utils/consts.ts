export const SITE_URL = {
  HOME: "/",
  USER_PROFILE: "/user-profile",
  CREATE_ORDER: "/create-order",

  ADMIN_AND: "admin_and",
  ADMIN_AND_CREATE_USER: "admin_and/create_user",
  ADMIN_AND_USERS: "admin_and/users",
  ADMIN_AND_USER_PROFILE: (id: number) => `admin_and/users/${id}`,
};

export const localStorageKeys = {
  tokenData: "tokenData",
};

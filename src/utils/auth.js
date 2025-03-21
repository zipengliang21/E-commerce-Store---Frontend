import { useAuthStore } from "../store/auth";
import axios from "./axios";
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

const Toast = Swal.mixin({
  toast: true,
  position: "top",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

export const login = async (email, password) => {
  try {
    const { data, status } = await axios.post("user/token/", {
      email,
      password,
    });

    if (status === 200) {
      setAuthUser(data.access, data.refresh);

      // Alert - Sign In Successfully
      Toast.fire({
        icon: "success",
        title: "Login Successfully",
      });
    }
    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error: error.response.data?.detail || "something went wrong",
    };
  }
};

export const register = async (full_name, email, phone, password, password2) => {
  try {
    const { data, status } = await axios.post("user/register/", {
      full_name,
      email,
      phone,
      password,
      password2,
    });

    if (status === 201) {
      await login(email, password);
      // Alert - Sign Up Successfully
      Toast.fire({
        icon: "success",
        title: "Account Created Successfully",
      });
    }

    return { data, error: null };
  } catch (error) {
    console.log(error);
    return {
      data: null,
      error: error.response?.data || "something went wrong",
    };
  }
};

export const logout = () => {
  Cookies.remove("access_token");
  Cookies.remove("refresh_token");
  useAuthStore.getState().setUser(null);
  console.log("logged out");
  // Alert - Sign Out Successfully
  Toast.fire({
    icon: "success",
    title: "Logout Successfully",
  });
};

export const setUser = async () => {
  const accessToken = Cookies.get("access_token");
  const refreshToken = Cookies.get("refresh_token");

  if (!accessToken || !refreshToken) {
    return;
  }

  if (!isAccessTokenExpired(accessToken)) {
    const response = await getRefreshToken();
    setAuthUser(response.access, response.refresh);
  } else {
    setAuthUser(accessToken, refreshToken);
  }
};

export const setAuthUser = (accessToken, refreshToken) => {
  Cookies.set("access_token", accessToken, {
    expires: 1,
    secure: true,
  });
  Cookies.set("refresh_token", refreshToken, {
    expires: 7,
    secure: true,
  });

  const user = jwt_decode(accessToken) ?? null;

  if (user) {
    useAuthStore.getState().setUser(user);
  }

  useAuthStore.getState().setLoading(false);
};

export const getRefreshToken = async () => {
  const refreshToken = Cookies.get("refresh_token");
  const { response } = await axios.post("user/token/refresh/", {
    refresh: refreshToken,
  });

  return response.data;
};

export const isAccessTokenExpired = accessToken => {
  try {
    const { decodedToken } = jwt_decode(accessToken);
    return Date.now() >= decodedToken.exp * 1000;
  } catch (error) {
    return true;
  }
};

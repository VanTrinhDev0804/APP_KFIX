import axios from "axios";
import {
  registerSuccess,
  loginFailure,
  loginRequest,
  loginSuccess,
  logoutUser,
  registerRequest,
  registerFailure,
  updateAvatarSuccess,
  updateFailure,
  updateRequest,
  updateUserNameSuccess,
  verifyOTPSuccess,
  verifyOTPFailure,
} from "../slice/authSlice";




const serverUrl = "http://192.168.43.30:5000";


// user
export const login = (phone, password) => async (dispatch) => {
  try {
    dispatch(loginRequest());
    const { data } = await axios.post(`${serverUrl}/api/login`, {
      phone,
      password,
    });

    if (data.status === true) {
      dispatch(loginSuccess(data));
    } else {
      dispatch(loginFailure());
    }
  } catch (error) {
    dispatch(loginFailure(error.response.data.error));
  }
};

export const register = (dataParam) => async (dispatch) => {
  try {
    dispatch(registerRequest());

    const { data } = await axios.post(`${serverUrl}/api/signup`, dataParam, {});
    
    if (data.status) {
      dispatch(registerSuccess(data));
     
    } else {
      dispatch(registerFailure("Lỗi!"));
    }
  } catch (error) {
    dispatch(registerFailure(error.response.data.error));
  }
};

export const logout = () => async (dispatch) => {
  const { data } = await axios.post(`${serverUrl}/api/logout`);

  if (data.status === true) {
    dispatch(logoutUser());
  }
};

export const updateAvatarUser = (avatar, phone) => async (dispatch) => {
  try {
    dispatch(updateRequest());
    const { data } = await axios.post(`${serverUrl}/api/updateavatar`, {
      avatar,
      phone,
    });
    if(data.status){
      dispatch(updateAvatarSuccess(data.avatar));
  
    }
 
  } catch (error) {
    dispatch(updateFailure(error.response.data.error));
  }
};
export const updateUserName = (name, phone) => async (dispatch) => {
  try {
    dispatch(updateRequest());
    const { data } = await axios.post(`${serverUrl}/api/updatename`, {
      name,
      phone,
    });
    if (data.status) {
      dispatch(updateUserNameSuccess(data.value));
    
    }
  } catch (error) {
    dispatch(updateFailure("Đã có lỗi!"));
  }
};

export const sendSMSOTP = (phone) => async (dispatch) =>{
  const { data } = await axios.post(`${serverUrl}/api/sendOTP`, {phone});
}
export const verifyOTPhandel = (phone , otp) => async (dispatch) =>{
  try {
    dispatch(updateRequest())
    const { data } = await axios.post(`${serverUrl}/api/verifyOTP`, {phone , otp});
    if (data.status){
      dispatch(verifyOTPSuccess())
    }
  } catch (error) {
    dispatch(verifyOTPFailure(error.response.data.error))
  }
 
}


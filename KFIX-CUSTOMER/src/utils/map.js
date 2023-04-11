

import axiosClient from "../api/axiosClient";
const MAP_4D_KEY =""

export const getAddressFromLocation = async (location) => {

    const locationStr = location.latitude + ',' + location.longitude;
    const url = `https://api.map4d.vn/sdk/v2/geocode?key=${MAP_4D_KEY}&location=${locationStr}`;
    const result = await axiosClient.get(url);
    if (result.code === 'ok') {
      let address = result.result[0].address;
      if (!address.includes('Việt Nam')) {
        address += ', Việt Nam';
      }
      return address;
    } else {
      return null;
    }
};

export const getAddressFromText = async (text) => {
  const url = `http://api.map4d.vn/sdk/autosuggest?key=${MAP_4D_KEY}&text=${text}`;
  const result = await axiosClient.get(url);
  if (result.code === 'ok') {
    let listAdress = result.result.slice(0, 5); //only show 5 address
    return listAdress;
  } else {
    return null;
  }
};



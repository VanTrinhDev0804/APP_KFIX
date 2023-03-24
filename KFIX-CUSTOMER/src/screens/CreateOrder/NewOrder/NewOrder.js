import { useNavigation } from "@react-navigation/native";
import { View, Pressable, Text, LogBox, TextInput, Image } from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import ReadMore from "react-native-read-more-text";

import { Button, HeaderScreen } from "../../../components";
import { colors, generalStyle } from "../../../contains";
import stylesNewOrder from "./stylesNewOrder";
import { useEffect, useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import ButtonAddImage from "./ButtonAddImage/ButtonAddImage";

const NewOrder = ({ route }) => {
  const navigation = useNavigation();
  const [address, setAddress] = useState("");
  const [open, setOpen] = useState(false);

  const [value, setValue] = useState("");
  const [items, setItems] = useState([
    { label: "Hỏng chìa khóa", value: "huchia" },
    { label: "Mất chìa khóa", value: "matchia" },
    { label: "Hỏng ổ khóa", value: "hongo" },
  ]);

  useEffect(() => {
    if (route.params) {
      const address = route?.params?.currentLocation?.address;
      if (address != "") setAddress(address);
    }
  }, [route]);
  //const address = route?.params?.currentLocation?.address;
  console.log(route);
  return (
    <View style={generalStyle.wrapper}>
      <HeaderScreen goBack name="Đặt đơn" option="Hủy"/>
      <View>
        <Text style={generalStyle.label}>Địa chỉ của bạn:</Text>
        <Pressable
          style={generalStyle.input}
          onPress={() => {
            navigation.navigate("SearchLocation");
          }}
        >
          <View style={stylesNewOrder.wConstainLocatin}>
            <Entypo name="location-pin" size={35} color={colors.primaryColor} />
            <View style={{ width: "85%" }}>
              <ReadMore numberOfLines={1} renderTruncatedFooter={() => null}>
                <Text style={stylesNewOrder.txtLocation}>
                  {address ? address : "Chưa có"}
                </Text>
              </ReadMore>
            </View>
          </View>
        </Pressable>
      </View>
      <View style={{ marginTop: 20 }}>
        <Text style={generalStyle.label}>Loại khóa</Text>
        <Pressable
          style={generalStyle.input}
          onPress={() => {
            navigation.navigate("SearchLocation");
          }}
        >
          <View style={stylesNewOrder.wConstainLocatin}>
            <Entypo name="location-pin" size={35} color={colors.primaryColor} />
            <View style={{ width: "85%" }}>
              <ReadMore numberOfLines={1} renderTruncatedFooter={() => null}>
                <Text style={stylesNewOrder.txtLocation}>
                  {route.params.problem}
                </Text>
              </ReadMore>
            </View>
          </View>
        </Pressable>
      </View>

      <View style={{ marginTop: 20 }}>
        <Text style={generalStyle.label}>Mô tả vấn đề của bạn:</Text>
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          labelStyle={{ fontSize: 18 }}
          textStyle={{ fontSize: 18 }}
          listMode="SCROLLVIEW"
          scrollViewProps={{
            nestedScrollEnabled: true,
          }}
        />
      </View>
      <View style={{ marginTop: 20 }}>
        <Text style={generalStyle.label}>Hình ảnh tình trạng khóa:</Text>
        <View style={{flexDirection: 'row',justifyContent: 'center'}}>
          <ButtonAddImage />
        </View>
      </View>
      {/* <Pressable style={{
        width: 100,
        height: 100,
        borderWidth: 1,
        borderRadius: 10,
        borderStyle: "dashed",
        borderColor: colors.mainGreen,
        justifyContent: "center",
        alignItems: "center",
      }} >
      <Text style={{
        width: 30,
        height: 30,
        textAlign: "center",
        textAlignVertical: "center",
        borderWidth: 1,
        borderRadius: 100,
        borderStyle: "dashed",
        borderColor: colors.mainGreen,
        color: colors.mainGreen,
      }}>+</Text>
      <Text style={{ color: colors.primaryColor }}>Thêm</Text>
    </Pressable> */}

      <Button
        title="Gửi yêu cầu"
        onPress={() => navigation.navigate("HaveEmployee")}
      />
    </View>
  );
};

export default NewOrder;
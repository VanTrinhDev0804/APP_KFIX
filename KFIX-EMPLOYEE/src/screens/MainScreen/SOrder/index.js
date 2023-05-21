import {
  Alert,
  Linking,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Modal from "react-native-modal";
import CurrencyInput from "react-native-currency-input";
import Entypo from "react-native-vector-icons/Entypo";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import generalStyle from "../../../generals/generalStyle";
import { Avartar, Contact, Image, ImageChoosen } from "../components";
import styles from "./styles";
import { Button } from "../../../components";
import { useDispatch, useSelector } from "react-redux";
import { ScrollView } from "react-native";
import { formatTimeFromCreateAt } from "../../../utils/date";
import { useState } from "react";
import { Docso, to_vietnamese } from "../../../utils/docso";
import {
  updateBalanceKeyer,
  updateKeyOrder,
  updateKeyerByKeyvalue,
} from "../../../firebase/asynsActions";
import { loadOrder } from "../../../redux/actions/orderAction";
import iconright from "../../../assests/images/arrow-right.png";
import SwipeButton from "rn-swipe-button";

import {
  child,
  get,
  getDatabase,
  onChildChanged,
  onValue,
  ref,
} from "firebase/database";
import { database } from "../../../firebase/config";
import {
  loadOrderFailure,
  loadOrderRequest,
  loadOrderSuccess,
  updateStatusOrder,
} from "../../../redux/slice/orderSlice";
import TimerCountdown from "react-native-timer-countdown-lucas";
import { Pressable } from "react-native";
const SOrder = ({ received }) => {
  const { order, loadding } = useSelector((state) => state.order);
  const { user, isOnline } = useSelector((state) => state.auth);

  const orderKeyerStatus = ref(database, "Keyers/" + user.userId + "/status");

  const dispatch = useDispatch();
  const dbRef = ref(getDatabase());

  onValue(
    orderKeyerStatus,
    (snapshot) => {
      if (snapshot.exists()) {
        if (snapshot.val() === "Xử lý đơn hàng") {
          if (order === null) {
            get(child(dbRef, `Keyers/${user.userId}/order`)).then((data) => {
              if (data.exists()) {
                const orderId = data.val();
                dispatch(loadOrder(orderId));
              }
            });
          }
        }
      }
    },
    {
      onlyOnce: true,
    }
  );
  if (order) {
    const orderValueRef = order && ref(database, "Orders/" + order.userID);
    onChildChanged(orderValueRef, (snapshot) => {
      if (snapshot.exists()) {
        if (order !== null && snapshot.key.toString() === "status") {
          setStatusOrder(snapshot.val());
          dispatch(updateStatusOrder(snapshot.val()));
        }
      }
    });
  }

  const status = order && order.status;
  const timeMove = order && order.keyer.timeMove;

  const [statusOrder, setStatusOrder] = useState(status);
  const [disableSlide, setDisableSlide] = useState(true);

  console.log(statusOrder);
  const navigation = useNavigation();

  const handleBaoGia = () => {
    setModalVisibleBG(true);
  };

  const latitude = "10.85584";
  const longitude = "106.63114";

  const handleDirect = () => {
    Linking.openURL(
      `https://www.google.com/maps/dir/?api=1&destination=${10.823},${106.68672}`
    );
  };
  const [isModalVisibleBG, setModalVisibleBG] = useState(false);
  const [isModalVisibleCall, setModalVisibleCall] = useState(false);

  const [price, setPrice] = useState(null);
  const [txtPrice, settextPrce] = useState("");
  const toggleModalBaoGia = () => {
    let orderUserId = order.userID;

    if (price > 0 && orderUserId !== null) {
      updateKeyOrder(`${orderUserId}/price`, price);
      updateKeyOrder(`${orderUserId}/status`, "Khách hàng xác nhận");
      setModalVisibleBG(!isModalVisibleBG);
      setModalVisibleCall(true);
    } else {
      settextPrce("Nhập phí sửa chữa");
    }
  };
  // Gọi cho khách
  const handleCallCustomer = () => {
    let orderUserId = order.userID;
    Linking.openURL(`tel:${order && order.userOrder.phone}`);
    dispatch(loadOrder(orderUserId));
  };
  const handelCloseCall = () => {
    let orderUserId = order.userID;
    dispatch(loadOrder());
    setModalVisibleCall(false);
  };

  const HandelHoanThanhDon = () => {
    let orderUserId = order.userID;
    let valueBlace = user.balanceAc - 1000;
    if (isOnline) {
      updateKeyerByKeyvalue(`${user.userId}/status`, "Online");
    } else {
      updateKeyerByKeyvalue(`${user.userId}/status`, "Offline");
    }
    // update realtime
    updateKeyerByKeyvalue(`${user.userId}/order`, "");
    updateKeyerByKeyvalue(`${user.userId}/balanceAc`, valueBlace);
    // update so du firebase
    updateBalanceKeyer(`${user.userId}`, valueBlace);
    updateKeyOrder(`${orderUserId}/status`, "Hoàn thành");
    dispatch(loadOrderFailure());
  };

  const handelUpdateDangSuaKhoa = () => {
    let orderUserId = order.userID;
    if (statusOrder === "Thợ đang đến" || order.status == "Thợ đang đến") {
      updateKeyOrder(`${orderUserId}/status`, "Thợ đang sửa");
    }
  };

  return (
    <>
      {order ? (
        <ScrollView>
          <View style={generalStyle.container}>
            <View style={styles.wapperorder}>
              <Text style={styles.orderTitle}>
                Chi tiết hóa đơn {order && order.orderID}
              </Text>
            </View>
            <Text style={{ color: "#888", marginTop: 20 }}>Khách hàng:</Text>
            <View style={styles.container}>
              <Avartar
                width={90}
                height={90}
                link={order && order.userOrder.avartar}
              />
              <View>
                <Text style={generalStyle.txtName}>
                  {order && order.userOrder.username}
                </Text>
                <Contact
                  phoneNumber={order && order.keyer.phone}
                  status={statusOrder}
                />
                {/* <TouchableOpacity>
                <AntDesign name="message1" size={25} color="#000" />
            </TouchableOpacity> */}
              </View>
            </View>

            <View>
              <View style={styles.orderDetail}>
                <Text style={{ color: "#888", marginBottom: 20 }}>
                  Đặt dịch vụ lúc{" "}
                  {order && formatTimeFromCreateAt(order.createAt)}
                </Text>
                <View style={[generalStyle.rowCenterV, generalStyle.mb2]}>
                  <Entypo name="location-pin" size={30} color="red" />
                  <Pressable
                    style={styles.infoCustomer}
                    onPress={() =>
                      Linking.openURL(
                        `https://www.google.com/maps/dir/?api=1&destination=${order?.diaChi}`
                      )
                    }
                  >
                    <Text style={styles.textInfoCustomerdiaChi}>
                      {order && order.diaChi}
                    </Text>
                  </Pressable>
                </View>
                <View style={[generalStyle.rowCenterV, generalStyle.mb2]}>
                  <Entypo name="warning" size={30} color="orange" />
                  <View style={styles.infoCustomer}>
                    <Text style={styles.textInfoCustomer}>
                      {order && order.problem}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.contentOrder}>
                <MaterialCommunityIcons
                  name="map-marker-distance"
                  size={25}
                  color="green"
                />
                <Text style={styles.reasonOrder}>
                  {order && order.keyer.distance}
                </Text>
              </View>
              <View style={styles.contentOrder}>
                {order && order.note ? (
                  <>
                    <MaterialIcons name="note" size={25} color="blue" />
                    <Text style={styles.reasonOrder}>{order.note}</Text>
                  </>
                ) : (
                  ""
                )}
              </View>
              <View style={styles.contentOrder}>
                <Text style={{ color: "#888", marginBottom: 20 }}>
                  Tình trạng khóa
                </Text>
                <View style={styles.images}>
                  <ImageChoosen onlyView={true} img={order && order.image} />
                </View>
              </View>
            </View>
            {order && order.status !== "Báo giá" ? (
              <>
                <View style={{ borderWidth: 0.3, marginTop: 20 }}></View>
                <View style={[generalStyle.rowCenterV, styles.infoEmployee]}>
                  <Text style={[styles.textInfoCustomer]}>
                    Thu tiền của khách:
                  </Text>
                  <Text style={[styles.textInfoCustomer]}>
                    {order && order.price + "VND"}
                  </Text>
                </View>
                {order && order.status === "Khách hàng xác nhận" ? (
                  <Text style={{ color: "#888", marginBottom: 20 }}>
                    Chi phí sửa chữa đã được gửi đến khách hàng!Đảm bảo khách
                    hàng chấp nhận đơn giá! Đơn hàng sẽ tự động hủy khi khách
                    hàng không chấp nhận đơn giá mà bạn đưa ra!
                  </Text>
                ) : statusOrder === "Thợ đang đến" ? (
                  <Text style={{ color: "#888", marginBottom: 20 }}>
                    Chi phí sửa chữa đã được xác nhận bởi khách hàng!
                  </Text>
                ) : (
                  ""
                )}
              </>
            ) : (
              ""
            )}

            {/* đếm time hoàn th */}

            <View style={{ marginTop: 20 }}>
              {(statusOrder === "Thợ đang đến" && !isModalVisibleCall) ||
              (order.status === "Thợ đang đến" && !isModalVisibleCall) ? (
                <>
                  <View>
                    <TimerCountdown
                      initialSecondsRemaining={
                        1000 * (order && order.keyer.timeMove)
                      }
                      onTimeElapsed={handelUpdateDangSuaKhoa}
                      allowFontScaling={true}
                      style={{ fontSize: 20 }}
                    />

                    <SwipeButton
                      disabled={true}
                      containerStyles={{ borderRadius: 10 }}
                      railStyles={{ borderRadius: 10 }}
                      thumbIconStyles={{ borderRadius: 5 }}
                      thumbIconImageSource={iconright}
                      onSwipeSuccess={HandelHoanThanhDon}
                      //disable the button by doing true (Optional)
                      swipeSuccessThreshold={100}
                      height={60}
                      title="Truợt để hoàn thành"
                      //After the completion of swipe (Optional)
                      railFillBackgroundColor="#99CC99" //(Optional)
                      railFillBorderColor="#99CC99" //(Optional)
                      thumbIconBackgroundColor="#008000" //(Optional)
                      thumbIconBorderColor="#008000" //(Optional)
                      railBackgroundColor="#bbeaa6" //(Optional)
                      railBorderColor="#99CC99"
                    />
                  </View>
                </>
              ) : order.status === "Thợ đang sửa" ||
                statusOrder === "Thợ đang sửa" ? (
                <View>
                  <SwipeButton
                    disabled={false}
                    containerStyles={{ borderRadius: 10 }}
                    railStyles={{ borderRadius: 10 }}
                    thumbIconStyles={{ borderRadius: 5 }}
                    thumbIconImageSource={iconright}
                    //disable the button by doing true (Optional)
                    swipeSuccessThreshold={100}
                    height={60}
                    title="Truợt để hoàn thành"
                    onSwipeSuccess={HandelHoanThanhDon}
                    //After the completion of swipe (Optional)
                    railFillBackgroundColor="#99CC99" //(Optional)
                    railFillBorderColor="#99CC99" //(Optional)
                    thumbIconBackgroundColor="#008000" //(Optional)
                    thumbIconBorderColor="#008000" //(Optional)
                    railBackgroundColor="#bbeaa6" //(Optional)
                    railBorderColor="#99CC99"
                  />
                </View>
              ) : order && order.status === "Báo giá" ? (
                <Button
                  title="Báo giá"
                  customStyle={styles.btn}
                  onPress={handleBaoGia}
                />
              ) : statusOrder === "Khách hàng xác nhận" ? (
                <Button
                  title="Gọi cho khách!"
                  onPress={() =>
                    Linking.openURL(`tel:${order && order.userOrder.phone}`)
                  }
                />
              ) : (
                ""
              )}

              {/* <View style={styles.options}>
            <Button
              title="Chỉ đường"
              customStyle={{ backgroundColor: "blue", ...styles.btn }}
              onPress={handleDirect}
            />
          
          </View> */}
            </View>
          </View>
          {/* Modal Báo Giá */}
          <Modal
            isVisible={isModalVisibleBG}
            onBackdropPress={() => setModalVisibleBG(false)}
          >
            <View
              style={{ backgroundColor: "#fff", borderRadius: 8, padding: 20 }}
            >
              <Text style={{ fontSize: 18 }}>
                Nhập phí sửa chữa cho đơn hàng!
              </Text>
              <View style={styles.contentOrder}>
                <View style={{ flex: 1 }}>
                  <CurrencyInput
                    style={generalStyle.input}
                    keyboardType="numeric"
                    placeholder="Đơn giá"
                    value={price}
                    onChangeValue={setPrice}
                    delimiter="."
                    // separator="."
                    precision={false}
                    minValue={0}
                    onChangeText={(formattedValue) => {
                      settextPrce(to_vietnamese(price).trim());
                    }}
                  />
                </View>
              </View>
              {txtPrice !== "" ? (
                <Text style={{ color: "green", marginBottom: 20 }}>
                  {price > 0 ? txtPrice + " đồng" : txtPrice}
                </Text>
              ) : (
                <Text style={{ color: "#888", marginBottom: 20 }}>
                  Chi phí sửa chữa sẽ được gửi đến khách hàng. Bạn hãy chắn chắn
                  nhập phí sửa chữa phù hợp cho đơn hàng và thu phí sửa chữa
                  theo đúng đơn giá đã nhập!
                </Text>
              )}

              <Button title="Xác nhận" onPress={toggleModalBaoGia} />
            </View>
          </Modal>

          {/* Modal call KH */}
          <Modal
            isVisible={isModalVisibleCall}
            onBackdropPress={handelCloseCall}
          >
            <View
              style={{ backgroundColor: "#fff", borderRadius: 8, padding: 20 }}
            >
              <Text style={{ fontSize: 18 }}>Gọi cho khách hàng!</Text>
              <Button title="Gọi cho khách!" onPress={handleCallCustomer} />
            </View>
          </Modal>
        </ScrollView>
      ) : (
        <View style={generalStyle.container}>
          <View style={generalStyle.wrapper}>
            <View style={styles.wapperorder}>
              <Text style={styles.orderTitle}>Bạn chưa có đơn hàng!</Text>
            </View>
          </View>
        </View>
      )}
    </>
  );
};

export default SOrder;

import { useState } from "react";
import {

  Image,
  Linking,
  Modal,
  Platform,
  Pressable,
 
  View,
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import Fontisto from "react-native-vector-icons/Fontisto";
import { generalColor } from "../../../../generals";
import styles from "./styles";

const ImageChosen = (props) => {
  const [modalVisible, setModalVisible] = useState(false);


//   const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
// const latLng = `${0},${0}`;
// const label = 'Custom Label';
// const url = Platform.select({
//   ios: `${scheme}${label}@${latLng}`,
//   android: `${scheme}${latLng}(${label})`
// });

    



  return (
    <>
      <Pressable onPress={() => setModalVisible(true)}>
        <Image
          style={styles.image}
          source={{
            uri: props.img ? props.img : "" ,
          }}
        />
        {!props.onlyView && (
          <AntDesign
            name="closecircle"
            size={20}
            color={generalColor.borderColor}
            style={styles.closeIcon}
          />
        )}
      </Pressable>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalView}>
         
          <Fontisto
            name="close-a"
            size={22}
            color={generalColor.borderColor}
            style={styles.closeViewImage}
            onPress={() => setModalVisible(false)}
          />
         
       
          <Image
          style={styles.imageView}
            source={{
              uri: props.img ? props.img : "" ,

            }}
          />
        </View>
      </Modal>
    </>
  );
};

export default ImageChosen;

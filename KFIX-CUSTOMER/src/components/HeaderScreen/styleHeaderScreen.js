import { StyleSheet } from 'react-native'


import { colors } from '../../contains'

const stylesHeaderScreen = StyleSheet.create({
    constain: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    nameHeader: {
        fontSize: 25,
        color: colors.textColor,
        flex: 1,
    },
    option: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    txtOption: {
        fontSize: 20,
        color: 'orange'
    }
})

export default stylesHeaderScreen
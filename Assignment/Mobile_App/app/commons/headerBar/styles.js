import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    headerContainer: {
        backgroundColor: 'black',
        height: 64,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    titleView: {
        flex: 1 / 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    titleText: {
        fontSize: 18,
        color: '#42C84B',
        // fontFamily: 'OCRAStd'
    },
    leftView: {
        flex: 1 / 4
    },
    rightView: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        flex: 1 / 4
    },
    leftButton: {
        left: 10,
        top: 3,
        height: 32,
        width: 32,
    },
    rightButton: {
        top: 12,
        height: 32,
        width: 32,
        right: 10
    }
})
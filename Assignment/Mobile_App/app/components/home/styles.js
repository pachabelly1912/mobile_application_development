import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black'
    },
    snackBar: {
        height: 6,
        backgroundColor: '#9B9B9B'
    },
    headerList: {
        backgroundColor: '#051429',
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerText: {
        marginLeft: 10,
        color: '#42C84B',
        // fontFamily: 'OCRAStd',
    },
    gpuNameText: {
        marginLeft: 10,
        color: 'white',
        // fontFamily: 'OCRAStd',
    },
    gpuContainer: {
        height: 40,
        flexDirection: 'row',
        alignItems: 'center'
    },
    seperator: {
        alignSelf: 'center' 
    },
    deleteButton: {
        marginLeft: 10,
        height: 20,
        width: 15,
        resizeMode: 'stretch'
    },
    statusButton: {
        height: 20,
        width: 25,
        resizeMode: 'stretch'
    },
    statusButtonContainer: {
        marginLeft: 10
    },
    buttonContainer: { 
        flex: 1 / 4, 
        flexDirection: 'row',
     justifyContent: 'space-around'
     },
    detailButton: {
        marginLeft: 5,
        height: 20,
        width: 20,
        resizeMode: 'stretch'
    },
    settingButton: {
        height: 23,
        width: 23,
        resizeMode: 'stretch'
    }
})
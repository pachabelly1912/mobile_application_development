import { StyleSheet} from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black'
    },
    selectModelContainer: {
        flex: 1,
        alignItems: 'center',
    },
    scrollView: {
      flex: 4/5  
    },
    snackBar: {
        height: 6,
        backgroundColor: '#9B9B9B'
    },
    cardTypeView: {
        justifyContent: 'center',
        height: 50,
        width: 300,
        backgroundColor: '#4A90E2',
        marginTop: 10,
        borderRadius: 10,
        paddingLeft: 20
    },
    cardTypeName:{
        color: 'white',
        // fontFamily: 'OCRAStd'
    },
    topicView: {
        flex: 1/5,
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    topicTxt: {
        color: '#42C84B',
        // fontFamily: 'OCRAStd',
        alignSelf: 'center'
    }
})
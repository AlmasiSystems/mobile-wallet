import React, { Component } from 'react';
import {Platform,StyleSheet,ImageBackground,Text,View,TouchableOpacity,Button} from 'react-native'
import styles from './styles.js';

export default class SignIn extends React.Component {

    render() {
        return (
            <ImageBackground source={require('../resources/images/signin_process_bg.png')} style={styles.backgroundImage}>
                <View style={{flex:1}}>
                </View>
                <View style={{flex:1, alignItems:'center'}}>
                    <Text>WELCOME</Text>
                    <Text style={styles.bigTitle}>LOGIN / CREATE</Text>
                        <View style={{width:100, height:1, backgroundColor:'white', marginTop:30,marginBottom:20}}></View>
                        <Text style={{color:'white'}}>Create your QRL wallet following 2 simple steps</Text>
                    <TouchableOpacity style={styles.SubmitButtonStyle} activeOpacity = { .5 } onPress={() => this.props.navigation.push('CreateWalletTreeHeight')}>
                        <Text style={styles.TextStyle}> CREATE ADVANCED WALLET </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.SubmitButtonStyleDark} activeOpacity = { .5 } onPress={ () => this.props.navigation.push('OpenExistingWalletOptions') }>
                        <Text style={styles.TextStyleWhite}> OPEN EXISTING WALLET </Text>
                    </TouchableOpacity>

                    <Button color="white" onPress={() => this.props.navigation.pop()  } title="Go Back"/>
                </View>
            </ImageBackground>
        );
    }
}

// // styling
// const styles = StyleSheet.create({
//     bigTitle:{
//         color:'white',
//         fontSize: 25,
//     },
//     SubmitButtonStyle: {
//         width: 300,
//         marginTop:10,
//         paddingTop:15,
//         paddingBottom:15,
//         marginLeft:30,
//         marginRight:30,
//         backgroundColor:'white',
//         borderRadius:10,
//         borderWidth: 1,
//         borderColor: '#fff'
//     },
//     SubmitButtonStyleDark: {
//         width: 300,
//         marginTop:10,
//         paddingTop:15,
//         paddingBottom:15,
//         marginLeft:30,
//         marginRight:30,
//         backgroundColor:'#144b82',
//         borderRadius:10,
//         borderWidth: 1,
//         borderColor: '#144b82'
//     },
//     TextStyle:{
//         color:'#1e79cb',
//         textAlign:'center',
//     },
//     TextStyleWhite:{
//         color:'white',
//         textAlign:'center',
//     },
//     backgroundImage: {
//         flex: 1,
//         width: null,
//         height: null,
//     },
// });

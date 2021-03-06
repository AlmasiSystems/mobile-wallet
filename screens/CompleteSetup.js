import React, { Component } from 'react';
import {Platform, StyleSheet,KeyboardAvoidingView, ImageBackground, Text, View, Image, ActionSheetIOS, TextInput, Modal, Button, ActivityIndicator, Picker, AsyncStorage, TouchableOpacity, TouchableHighlight } from 'react-native';
import styles from './styles.js';

// Android and Ios native modules
import {NativeModules} from 'react-native';
var IosWallet = NativeModules.CreateWallet;
var AndroidWallet = NativeModules.AndroidWallet;
import PINCode from '@haskkor/react-native-pincode'

export default class CompleteSetup extends React.Component {

    static navigationOptions = {
        headerMode: 'none'
    };

    state={
        pin: null,
        hashFunction: '',
        loading: false,
        dimensions : undefined,
        y1:0,
        y2:0,
        y3:0,
        showModal: false,
        selectText : undefined,
        modalVisible: false,
        disableButton: false,
        name: ''
    }

    // update the wallet counter
    _updateWalletcounter = (walletcounterUpdate) => {
        AsyncStorage.setItem("walletcounter", walletcounterUpdate);
    }

    _onNameChange = (text) => {
        this.setState({name: text})
    }

    // update the index of the opened wallet
    _updateWalletIndex = (walletIndexToCreate, address) => {
        AsyncStorage.setItem("walletcreated","yes");
        // update the walletindex
        AsyncStorage.setItem("walletindex",walletIndexToCreate );
        // update the walletlist JSON
        // if first wallet create, just instantiate the walletlist JSON
        if (walletIndexToCreate == "1"){
            AsyncStorage.setItem("walletlist", JSON.stringify( [{"index":walletIndexToCreate, "address": "Q"+address, "name": this.state.name}] ) );
        }
        else {
            // update walletlist JSON
            AsyncStorage.getItem("walletlist").then((walletlist) => {
                walletlist = JSON.parse(walletlist)
                walletlist.push({"index":walletIndexToCreate, "address": "Q"+address, "name": this.state.name})
                AsyncStorage.setItem("walletlist", JSON.stringify( walletlist ));
            });
        }
        // show main menu once wallet is open
        this.props.navigation.navigate('App');
    }

    // Create QRL wallet
    createWallet = () => {
        this.setState({loading:true, disableButton:true})
        AsyncStorage.getItem('walletcounter').then((walletcounter) => {
            // if not first wallet
            if(walletcounter != null){
                walletIndexToCreate = (parseInt(walletcounter, 10) + 1).toString();
                this._updateWalletcounter(walletIndexToCreate)
            }
            // if first wallet
            else {
                walletIndexToCreate = "1"
                this._updateWalletcounter("1");
            }
            // Ios
            if (Platform.OS === 'ios'){
                IosWallet.createWallet(this.props.navigation.state.params.treeHeight, walletIndexToCreate, this.state.name, this.state.pin, this.props.navigation.state.params.hashFunctionId,  (err, status, address)=> {
                    this.setState({loading:false})
                    // if success -> open the main view of the app
                    if (status =="success"){
                        this._updateWalletIndex(walletIndexToCreate, address)
                    }
                    else {
                        console.log("ERROR while opening wallet: ", err)
                    }
                })
            }
            // Android
            else {
                AndroidWallet.createWallet(this.props.navigation.state.params.treeHeight, walletIndexToCreate, this.state.name, this.state.pin, this.props.navigation.state.params.hashFunctionId, (err) => {console.log(err); }, (status, address) => {
                    // if success -> open the main view of the app
                    if (status =="success"){
                        this._updateWalletIndex(walletIndexToCreate, address)
                    }
                    else {
                        console.log("ERROR while opening wallet: ", error)
                    }
                })
            }
        }).catch((error) => {console.log(error)});
    }

    // show/hide the PIN view
    launchModal(bool, pinValue) {
        this.setState({modalVisible: bool, pin: pinValue})
    }


    showButtons = () => {
        return(
            <View style={{alignItems:'center'}}>
                <Text style={styles.smallTitle}>1. Choose a 4-digit PIN </Text>
                <TouchableOpacity accessibilityLabel="create4digitPinButton" style={styles.SubmitButtonStyle} disabled={this.state.disableButton} activeOpacity = { .5 } onPress={ () => {this.launchModal(true, null)}}  >
                    <Text style={styles.TextStyle}> CREATE 4-DIGIT PIN </Text>
                </TouchableOpacity>
                <Text style={styles.smallTitle}>2. Give your wallet a name</Text>
                <TextInput onChangeText={ (text) => this._onNameChange(text) } editable={!this.state.isLoading}  underlineColorAndroid="transparent" style={styles.hexInput} value={this.state.name} />
                <TouchableOpacity accessibilityLabel="cancelButtonBeforePin" style={styles.SubmitButtonStyleRed} disabled={this.state.disableButton} activeOpacity = { .5 } onPress={ () => {this.props.navigation.popToTop()} }>
                <Text style={styles.TextStyleWhite}> BACK </Text>
                </TouchableOpacity>
            </View>
        );
    }

    showCreateButton = () => {
        if (this.state.pin != null && this.state.name != ''){
            return(
                <View>
                    <TouchableOpacity accessibilityLabel="createWalletButton" style={styles.SubmitButtonStyle} disabled={this.state.disableButton} activeOpacity = { .5 } onPress={this.createWallet} >
                        <Text style={styles.TextStyle}> CREATE WALLET </Text>
                    </TouchableOpacity>
                </View>
            );
        }
    }

    render() {
        return (
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null} style={{flex:1}} enabled>
            <ImageBackground accessibilityLabel="CompleteSetup" source={require('../resources/images/complete_setup_bg.png')} style={styles.backgroundImage}>
                <Modal animationType="slide" visible={this.state.modalVisible}>
                    <ImageBackground source={require('../resources/images/complete_setup_bg.png')} style={styles.backgroundImage}>
                        <PINCode
                            accessibilityLabel="pinCodeView"
                            status={'choose'}
                            storePin={(pin: string) => {
                                this.setState({pin:pin})
                            }}
                            bottomLeftComponent = {
                                <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                                    <TouchableHighlight onPress={() => this.launchModal(false, null) } >
                                        <Text style={{color:'white'}}>Cancel</Text>
                                    </TouchableHighlight>
                                </View>
                            }
                            subtitleChoose = "to keep your QRL wallet secure"
                            stylePinCodeColorSubtitle ="white"
                            stylePinCodeColorTitle="white"
                            colorPassword="white"
                            numbersButtonOverlayColor="white"
                            finishProcess = {() => this.launchModal(false, this.state.pin) }
                        />
                    </ImageBackground>
                </Modal>

                <View style={{flex:1}}>
                </View>
                <View style={{flex:3, alignItems:'center'}} ref='Marker2' onLayout={({nativeEvent}) => { this.refs.Marker2.measure((x, y, width, height, pageX, pageY) => {this.setState({y1:y});}) }}>
                    <Text style={styles.bigTitle}>COMPLETE SETUP</Text>
                    <View style={{width:100, height:1, backgroundColor:'white', marginTop:30,marginBottom:20}}></View>
                    <Text style={styles.descriptionText}>{'\n'}Height: {this.props.navigation.state.params.treeHeight}</Text>
                    <Text style={styles.descriptionText}>Signatures: {this.props.navigation.state.params.signatureCounts}</Text>
                    <Text style={styles.descriptionText}>Hash function: {this.props.navigation.state.params.hashFunctionName}</Text>

                    {this.state.loading ?
                        <View style={{alignItems:'center'}}><ActivityIndicator style={{paddingTop:20}} size={'large'}></ActivityIndicator><Text style={{color:'white'}}>This may take a while.</Text><Text style={{color:'white'}}>Please be patient...</Text></View>
                        :
                        <View>
                            {this.showButtons()}
                            {this.showCreateButton()}
                        </View>
                    }
                </View>
            </ImageBackground>
            </KeyboardAvoidingView>
        );
    }
}

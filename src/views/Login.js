import React, { useState } from 'react'
import {
    View, Text, StyleSheet, Image, TextInput, TouchableOpacity,
    ActivityIndicator, KeyboardAvoidingView
} from 'react-native'
import NetInfo from '@react-native-community/netinfo'
import Toast from 'react-native-simple-toast';
// import Soap from 'soap-everywhere'
// import Convert from 'xml-js'
import { showMessage, hideMessage } from "react-native-flash-message";
import Fontisto from 'react-native-vector-icons/Fontisto'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Logo from '../assets/logo.png'
// import Request from 'request'


export default function Login() {
    const [state, setState] = useState({
        isLoading: false,
        isUserNameEmpty: false,
        isPasswordEmpty: false,
        username: '',
        password: '',
        passwordInputFocus: false
    })

    const handleLogin = () => {

        if (!state.username) {
            setState({
                ...state, isUserNameEmpty: true
            })
        } else if (!state.password) {
            setState({
                ...state, isPasswordEmpty: true
            })
        } else {

            setState({
                ...state, isLoading: true
            })

            NetInfo.fetch().then(state => {
                if (state.isConnected) {
                    const url = 'http://isapi.icu-tech.com/ICUTech-test.dll/wsdl/IICUTech#Login'
                    const username = state.username
                    const password = state.password
                    const ips = 0
                    const soapRequest = `<?xml version="1.0" encoding="UTF-8"?>
                    <env:Envelope xmlns:env="http://www.w3.org/2003/05/soap-envelope" 
                    xmlns:ns1="urn:ICUTech.Intf-IICUTech" xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
                    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:enc="http://www.w3.org/2003/05/soap-encoding">
                    <env:Body>
                    <ns1:Login env:encodingStyle="http://www.w3.org/2003/05/soap-encoding">
                    <UserName xsi:type="xsd:string">${username}</UserName>
                    <Password xsi:type="xsd:string">${password}</Password>
                    </ns1:Login>
                    </env:Body>
                    </env:Envelope>`

                    var xmlhttp = new XMLHttpRequest();
                    xmlhttp.open('POST', url, true);

                    xmlhttp.onreadystatechange = function () {
                        if (xmlhttp.readyState == 4) {
                            if (xmlhttp.status == 200) {
                                console.log(xmlhttp.responseText);
                            }
                        }
                    }

                    xmlhttp.setRequestHeader('Content-Type', 'text/xml');
                    xmlhttp.setRequestHeader('SOAPAction', '"urn:ICUTech.Intf-IICUTech#Login"');
                    xmlhttp.send(soapRequest);

                    // const args = {
                    //     UserName: state.username,
                    //     Password: state.password,
                    //     IPs: '0'
                    // }
                    // Soap.createClient(url, function (err, client) {
                    //     client.IICUTechservice.IICUTechPort.Login(args, function (result) {
                    //         console.log('object')
                    //         console.log(result);
                    //     });
                    // });
                    // let formData = new FormData();
                    // formData.append('UserName', state.username);
                    // formData.append('Password', state.password);
                    // formData.append('IPS', 'dummy');
                    // fetch('http://isapi.icu-tech.com/ICUTech-test.dll/Login', {
                    //     method: 'POST',
                    //     headers: {
                    //         Accept: 'application/json',
                    //         'Content-Type': 'application/json',
                    //     },
                    //     body: formData,
                    // }).then((response) => response.json())
                    //     .then((responseJson) => {
                    //         console.log(response)
                    //         setState({
                    //             ...state, isLoading: false
                    //         })
                    //     })
                    //     .catch((error) => {
                    //         console.error(error);
                    //     });
                } else {
                    Toast.show(
                        'Please, check your network.',
                        Toast.SHORT
                    )
                }
            })
        }
    }

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior="padding"
                enabled
            >
                <Image source={Logo} style={styles.logoLayout} />
                <Text style={styles.screenTitle}>
                    Have an account ?   Log in now
            </Text>
                <View style={styles.formContainer}>
                    <Text style={[state.isUserNameEmpty ? styles.errorMessage : styles.noErrorMessage]}>
                        UserName cannot be empty</Text>
                    <View style={styles.textInputContainer}>
                        <FontAwesome name='user-circle' size={20} color="gray" />
                        <TextInput placeholder="UserName" style={styles.textInputStyle} value={state.username}
                            onChangeText={username => {
                                setState({ ...state, isUserNameEmpty: false, username })
                            }}
                        />
                    </View>
                    <Text style={[state.isPasswordEmpty ? styles.errorMessage : styles.noErrorMessage]}>Password cannot be empty</Text>
                    <View style={styles.textInputContainer}>
                        <Fontisto name='locked' size={20} color="gray" />
                        <TextInput placeholder="Password" secureTextEntry={true} style={styles.textInputStyle}
                            value={state.password} onChangeText={password => {
                                setState({ ...state, isPasswordEmpty: false, password })
                            }} />
                    </View>
                    <View>
                        <TouchableOpacity
                            style={styles.loginButtonStyle}
                            activeOpacity={0.5}
                            onPress={handleLogin}
                        >
                            {state.isLoading ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                    <Text style={styles.loginTextStyle}> LOGIN </Text>
                                )}
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        height: '100%',
        width: '100%',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    logoLayout: {
        height: 100,
        width: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: '#f39900'
    },
    screenTitle: {
        marginTop: 60,
        marginBottom: 40,
        fontFamily: 'Open Sans',
        fontSize: 17,
        fontWeight: 'bold'
    },
    formContainer: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        paddingLeft: 16,
        paddingRight: 16
    },
    textInputContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 3,
        marginBottom: 20,
        shadowColor: "#fff",
        shadowOffset: {
            width: 0,
            height: 0.1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 0.5,
        elevation: 2,
        width: '100%',
        borderRadius: 25,
        paddingLeft: 10
    },
    textInputStyle: {
        flex: 1,
        fontSize: 16,
        height: 45,
        paddingLeft: 10,
        paddingRight: 10
    },
    loginButtonStyle: {
        marginTop: 25,
        backgroundColor: '#f39900',
        paddingTop: 13,
        paddingBottom: 13,
        borderRadius: 25,
        shadowColor: "#fff",
        shadowOffset: {
            width: 0,
            height: 0.1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 0.5,
        elevation: 2,
    },
    loginTextStyle: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16
    },
    errorMessage: {
        color: 'red',
        textAlign: 'center'
    },
    noErrorMessage: {
        color: '#fff',
        textAlign: 'center'
    }
})

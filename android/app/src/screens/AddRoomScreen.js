import React,{useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {IconButton, Title} from 'react-native-paper';
import FormButton from '../components/FormButton';
import FormInput from '../components/FormInput';
import Firestore from '@react-native-firebase/firestore'
export default function AddRoomScreen({ navigation }) {

    const [roomName, setRoomName] = useState('');

    function handleButtonPress() {
        if (roomName.length > 0) {
            Firestore()
            .collection('THREADS')
            .add({
                name: roomName,
                latestMessage: {
                    text:`You have joind the room ${roomName}.`,
                    createdAt: new Date().getTime()
                }
            })
            .then(docRef => {
                docRef.collection('MESSAGES').add({
                    text:`You have joined the room ${roomName}.`,
                    createdAt: new Date().getTime(),
                    system: true
                });
                navigation.navigate('Home')
            });
        }
    }
    return (
        <View style={styles.rootContainer}>
            <View style={styles.closeButtonContainer}>
                <IconButton
                    icon = 'close-circle'
                    size={36}
                    color='#6646ee'
                    onPress={()=> navigation.goBack()}
                />
            </View>
            <View style={styles.innerContainer}>
                <Title style={styles.title}>Create a new chat room</Title>
                <FormInput
                    labelName='Room Name'
                    value={roomName}
                    onChangeText={(text) => setRoomName(text)}
                    clearButtonMode='while-editing'
                />
                <FormButton 
                    title='Create'
                    modelValue='contained'
                    labelStyle={styles.buttonLabel}
                    onPress={() => handleButtonPress()}
                    disabled={roomName.length === 0}
                />
            </View>
        </View>
        // <View style={{
        //     flex:1,
        //     justifyContent:'center',
        //     alignItems:'center'
        // }}>
        //     <Text>Create a new chat room</Text>
        //     <FormButton
        //        mode='contained'
        //        title='Close Modal'
        //        onPress={ ()=> navigation.goBack() }
        //     />
        // </View>
    );
}

const styles = StyleSheet.create({
    rootContainer: {
      flex: 1,
    },
    closeButtonContainer: {
      position: 'absolute',
      top: 30,
      right: 0,
      zIndex: 1,
    },
    innerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: 24,
      marginBottom: 10,
    },
    buttonLabel: {
      fontSize: 22,
    },
  });
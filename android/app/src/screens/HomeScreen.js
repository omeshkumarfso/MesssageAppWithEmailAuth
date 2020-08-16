import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, 
    Dimensions,Button,TouchableOpacity } from 'react-native';
import { Title, List, Divider } from 'react-native-paper';
import Firestore from '@react-native-firebase/firestore'
import FormButton from '../components/FormButton';
import { AuthContext } from '../navigation/AuthProvider';
import Loading from '../components/Loading';


export default function HomeScreen({ navigation }) {

    const [threads, setThreads] = useState([])
    const [loading, setLoading] = useState(true)
    

    useEffect(() => {
        const unsubscribe = Firestore()
            .collection('THREADS')
            .orderBy('latestMessage.createdAt', 'desc')
            .onSnapshot((querySnapshot) => {
                const threads = querySnapshot.docs.map((documentSnapshot) => {
                    return {
                        _id: documentSnapshot.id,
                        name: '',
                        latestMessage: {
                            text: ''
                        },
                        ...documentSnapshot.data(),
                    };
                });
                setThreads(threads);

                if (loading) {
                    setLoading(false);
                }
            });
        return () => unsubscribe();
    }, []);

    if(loading) {
        return <Loading/>;
    }

    return (
        <View style={styles.container}>
           <FlatList
               data={threads}
               keyExtractor={(item) => item._id}
               ItemSeparatorComponent={() => <Divider/> }
               renderItem={({item}) => (
                   <TouchableOpacity
                     onPress={()=> navigation.navigate('Room', {thread: item})}
                   >
                       <List.Item
                       title={item.name}
                       description={item.latestMessage.text}
                       titleNumberOfLines={1}
                       titleStyle={styles.listTitle}
                       descriptionStyle={styles.listDescription}
                       descriptionNumberOfLines={1}
                   />
                   </TouchableOpacity>
               )}
           />

            {/* <Title> {user.uid} </Title>
            <Button
               style={{width:Dimensions.get('screen').width}}
                modelValue='contained'
                title='Logout'
                onPress={() => logout()}
            /> */}
            {/* <FormButton
             modelValue='contained'
             title='Add Room'
             onPress={ () => navigation.navigate('AddRoomScreen')}
          /> */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f5f5f5',
        flex: 1,
      },
      listTitle: {
        fontSize: 22,
      },
      listDescription: {
        fontSize: 16,
      },
});
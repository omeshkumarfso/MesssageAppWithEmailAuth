import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import {
    GiftedChat, Bubble, Send,
    SystemMessage
} from 'react-native-gifted-chat';
import { IconButton } from 'react-native-paper';
import Firestore from '@react-native-firebase/firestore';
import { AuthContext } from '../navigation/AuthProvider';
export default function RoomScreen({ route }) {

    const { user } = useContext(AuthContext);
    const currentUser = user.toJSON();
    const { thread } = route.params;
    const [messages, setMessages] = useState([])

    useEffect(() => {
        const messagesListener = Firestore()
            .collection('THREADS')
            .doc(thread._id)
            .collection('MESSAGES')
            .orderBy('createdAt', 'desc')
            .onSnapshot(querySnapshot => {
                const messages = querySnapshot.docs.map(doc => {
                    const firebaseData = doc.data();

                    const data = {
                        _id: doc.id,
                        text: '',
                        createdAt: new Date().getTime(),
                        ...firebaseData
                    };

                    if (!firebaseData.system) {
                        data.user = {
                            ...firebaseData.user,
                            name: firebaseData.user.email
                        };
                    }
                    return data;
                });
                setMessages(messages);
            });
            return () => messagesListener();
    }, []);

    async function handleSend(messages) {
        const text = messages[0].text;

        Firestore()
            .collection('THREADS')
            .doc(thread._id)
            .collection('MESSAGES')
            .add({
                text,
                createdAt: new Date().getTime(),
                user: {
                    _id: currentUser.uid,
                    email: currentUser.email
                }
            });

        
            await Firestore()
                .collection('THREADS')
                .doc(thread._id)
                .set(
                    {
                        latestMessage: {
                            text,
                            createdAt: new Date().getTime()
                        }
                    },
                    { merge: true }
                );
        
        
    }


    function renderBubble(props) {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: '#6646ee'
                    }
                }}
                textStyle={{
                    right: {
                        color: '#fff'
                    }
                }}
            />
        );
    }

    function renderSend(props) {
        return (
            <Send {...props}>
                <View style={styles.sendingContainer}>
                    <IconButton
                        icon='send-circle'
                        size={32}
                        color='#6646ee'
                    />
                </View>
            </Send>
        );
    }

    function scrollToBottomComponent() {
        return (
            <View style={styles.bottomComponentContainer}>
                <IconButton
                    icon='chevron-double-down'
                    size={36}
                    color='#6646ee'
                />
            </View>
        );
    }

    function renderLoading() {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size='large' color='#6646ee' />
            </View>
        )
    }

    function renderSystemMessage(props) {
        return (
            <SystemMessage
                {...props}
                wrapperStyle={styles.systemMessageText}
                textStyle={styles.systemMessageText}
            />
        );
    }

    // useEffect(() => {
    //     console.log({ user });
    // }, []);

    return (
        <GiftedChat
            messages={messages}
            onSend={handleSend}
            user={{ _id: currentUser.uid }}
            renderBubble={renderBubble}
            placeholder='Type your message here...'
            showUserAvatar
            alwaysShowSend
            renderSend={renderSend}
            scrollToBottom
            scrollToBottomComponent={scrollToBottomComponent}
            renderLoading={renderLoading}
            renderSystemMessage={renderSystemMessage}
        />
    );
}

const styles = StyleSheet.create({
    sendingContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    bottomComponentContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    systemMessageText: {
        fontSize: 14,
        color: '#fff',
        fontWeight: 'bold'
    },
});
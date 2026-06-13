import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, 
         Button, KeyboardAvoidingView, Platform } from 'react-native';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { db } from '../config/firebaseConfig';
import { useAuth } from '../context/AuthContext';

export default function ChatScreen({ navigation }) {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const { user, logout } = useAuth();

    const insets = useSafeAreaInsets();

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Button onPress={logout} title="Logout" color='red' />
            ),
        });
    }, [navigation]);

    useEffect(() => {
        const q = query(collection(db, 'messages'), orderBy('timestamp', 'asc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setMessages(msgs);
        });

        return () => unsubscribe();
    }, []);

    const handleSend = async () => {
        const textToSend = inputText.trim() 
        if (textToSend === '') return;

        setInputText('');

        try {
            await addDoc(collection(db, 'messages'), {
                senderId: user.uid,
                text: textToSend,
                imageURL: "",
                timestamp: serverTimestamp(),
                read: false
            });
            
        } catch (error){
            console.error("Gagal mengirim pesan: ", error);
        }
    };

    const renderChatItem = ({ item }) => {
        const isMyMessage = item.senderId === user.uid;
        return (
            <View style={[ styles.messageContainer, isMyMessage?
                            styles.myMessage : styles.theirMessage
            ]}>
                <Text style={isMyMessage ? styles.myMessageText : styles.theirMessageText}>
                    {item.text}
                </Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.rootContainer} edges={['left', 'right']} >
            <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'padding' : 'padding'}
            style={styles.keyboardContainer}
            keyboardVerticalOffset={90}
            >
                {/* Daftar pesan chat */}
                <FlatList data={messages}
                    keyExtractor={(item) => item.id}
                    renderItem={renderChatItem}
                    style={styles.chatList}
                    contentContainerStyle={styles.chatContent}
                />

                {/* Kolom input pesan */}
                <View style={styles.inputContainer}>
                    <TextInput style={styles.input} placeholder='Ketik pesan...'
                        value={inputText} onChangeText={setInputText}
                    />
                    <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                        <Text style={styles.sendButtonText}>Kirim</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    rootContainer: { flex: 1, backgroundColor: '#fff' }, 
    keyboardContainer: { flex: 1, backgroundColor: '#fff' },
    chatList: { flex: 1, backgroundColor: '#f5f5f5' }, 
    chatContent: { padding: 15 },
    messageContainer: {
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
        maxWidth: '75%',
    },
    myMessage: {
        backgroundColor: '#007AFF',
        alignSelf: 'flex-end',
    },
    theirMessage: {
        backgroundColor: '#E5E5EA',
        alignSelf: 'flex-start',
    },
    myMessageText: { color: '#fff', fontSize: 16 },
    theirMessageText: { color: '#000', fontSize: 16 },
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#fff',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#eee'
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
        marginRight: 10,
        fontSize: 16
    },
    sendButton: {
        backgroundColor: '#007AFF',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    sendButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});
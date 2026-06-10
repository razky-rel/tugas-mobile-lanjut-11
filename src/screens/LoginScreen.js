import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();

    const handleLogin = async () => {
        if (!email || !password) {
            return Alert.alert('Error', 'Semua kolom wajib diisi!');
        }
        try {
            await login(email, password);
        } catch (error){
            Alert.alert('Login Gagal', error.message);
        }
    };

    return (
        <View style={styles.container} >
            <Text style={styles.title} >Real-time Chat App</Text>
            <TextInput 
                placeholder='Email' value={email}
                onChangeText={setEmail} autoCapitalize='none'
                style={styles.input} />
            <TextInput 
                placeholder='Password' value={password}
                onChangeText={setPassword} secureTextEntry
                style={styles.input} />
            <Button title="Login" onPress={handleLogin} />
            <Text style={styles.link} onPress={() => navigation.navigate('Register')}
            > Belum punya akun? Daftar di sini</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, justifyContent: 'center'},
    title: {fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center'},
    input: {borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 15},
    link: {color: 'blue', marginTop: 15, textAlign: 'center'} 
});
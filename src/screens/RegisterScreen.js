import React, {useState} from 'react';
import { View, TextInput, Button, Text, Alert, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function RegisterScreen({navigation}) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {register} = useAuth();

    const handleRegister = async () => {
        if (!name || !email || !password){
            return Alert.alert('Error', 'Semua kolom wajib diisi');
        } try {
            await register(name, email, password);
            Alert.alert('Sukses', 'Akun berhasil dibuat');
        } catch(error) {
            Alert.alert('Registrasi Gagal', error.message);
        }
    };

    return (
        <View style={styles.container} >
            <Text style={styles.title}>Daftar Akun Baru</Text>
            <TextInput 
                placeholder='Nama Lengkap'
                value={name} onChangeText={setName}
                style={styles.input} />
            <TextInput
                placeholder='Email'
                value={email} onChangeText={setEmail}
                autoCapitalize='none'
                style={styles.input} />
            <TextInput 
                placeholder='Password'
                value={password} onChangeText={setPassword}
                secureTextEntry
                style={styles.input} />
            <Button title='Daftar' onPress={handleRegister} />
            <Text style={styles.link} onPress={() => navigation.navigate('Login')} >
                Sudah punya akun? Login di sini
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {flex: 1, padding: 20, justifyContent: 'center'},
    title: {fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center'},
    input: {borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 5},
    link: {color: 'blue', marginTop: 15, textAlign: 'center'}
});
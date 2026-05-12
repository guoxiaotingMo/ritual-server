import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi } from '../../api/auth';
import { useAuthStore } from '../../store/useAuthStore';

export default function LoginScreen({ navigation }: any) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const setUser = useAuthStore((state) => state.setUser);

  const handleLogin = async () => {
    if (!phone || !password) {
      Alert.alert('提示', '请填写手机号和密码');
      return;
    }
    setLoading(true);
    try {
      const res: any = await authApi.login({ phone, password });
      if (res.code === 200) {
        await AsyncStorage.setItem('accessToken', res.data.accessToken);
        await AsyncStorage.setItem('refreshToken', res.data.refreshToken);
        setUser({ id: 0, phone, nickName: '', avatar: '', gender: 0, birthday: '' });
      }
    } catch (error: any) {
      Alert.alert('登录失败', error.response?.data?.message || '网络错误');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Text style={styles.title}>仪式感</Text>
      <Text style={styles.subtitle}>记住每一个重要日子</Text>
      <TextInput style={styles.input} placeholder="手机号" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
      <TextInput style={styles.input} placeholder="密码" secureTextEntry value={password} onChangeText={setPassword} />
      <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? '登录中...' : '登录'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>还没有账号？去注册</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 36, fontWeight: 'bold', textAlign: 'center', color: '#E91E63', marginBottom: 8 },
  subtitle: { fontSize: 16, textAlign: 'center', color: '#999', marginBottom: 40 },
  input: { borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 12, padding: 16, marginBottom: 16, fontSize: 16, backgroundColor: '#fafafa' },
  button: { backgroundColor: '#E91E63', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  link: { textAlign: 'center', color: '#E91E63', marginTop: 20, fontSize: 15 },
});

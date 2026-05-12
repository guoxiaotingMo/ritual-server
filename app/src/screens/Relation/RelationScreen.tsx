import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { relationApi } from '../../api/relation';

export default function RelationScreen() {
  const [inviteCode, setInviteCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res: any = await relationApi.generateInvite();
      if (res.code === 200) {
        setGeneratedCode(res.data.inviteCode);
      }
    } catch (error: any) {
      Alert.alert('生成失败', error.response?.data?.message || '网络错误');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    if (!inviteCode) { Alert.alert('提示', '请输入邀请码'); return; }
    setLoading(true);
    try {
      const res: any = await relationApi.acceptInvite(inviteCode);
      if (res.code === 200) {
        Alert.alert('绑定成功', '你们已成功绑定！');
      }
    } catch (error: any) {
      Alert.alert('绑定失败', error.response?.data?.message || '网络错误');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Text style={styles.sectionTitle}>生成邀请码</Text>
      <Text style={styles.desc}>生成邀请码后发送给你的伴侣，对方输入即可绑定</Text>
      <TouchableOpacity style={styles.button} onPress={handleGenerate} disabled={loading}>
        <Text style={styles.buttonText}>生成邀请码</Text>
      </TouchableOpacity>
      {generatedCode ? (
        <View style={styles.codeContainer}>
          <Text style={styles.codeLabel}>你的邀请码：</Text>
          <Text style={styles.codeValue}>{generatedCode}</Text>
        </View>
      ) : null}

      <View style={styles.divider} />

      <Text style={styles.sectionTitle}>输入邀请码</Text>
      <Text style={styles.desc}>输入伴侣的邀请码，完成绑定</Text>
      <TextInput style={styles.input} placeholder="请输入邀请码" value={inviteCode} onChangeText={setInviteCode} autoCapitalize="characters" />
      <TouchableOpacity style={styles.button} onPress={handleAccept} disabled={loading}>
        <Text style={styles.buttonText}>确认绑定</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 8 },
  desc: { fontSize: 14, color: '#999', marginBottom: 16 },
  button: { backgroundColor: '#E91E63', padding: 14, borderRadius: 12, alignItems: 'center', marginBottom: 16 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  codeContainer: { backgroundColor: '#FCE4EC', padding: 20, borderRadius: 12, alignItems: 'center', marginBottom: 16 },
  codeLabel: { fontSize: 14, color: '#E91E63', marginBottom: 8 },
  codeValue: { fontSize: 32, fontWeight: 'bold', color: '#E91E63', letterSpacing: 4 },
  divider: { height: 1, backgroundColor: '#f0f0f0', marginVertical: 24 },
  input: { borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 12, padding: 14, fontSize: 18, backgroundColor: '#fafafa', marginBottom: 16, textAlign: 'center', letterSpacing: 4 },
});

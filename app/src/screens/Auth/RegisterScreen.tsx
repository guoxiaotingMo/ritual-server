import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi } from '../../api/auth';
import { userApi } from '../../api/user';
import { useAuthStore } from '../../store/useAuthStore';
import { useToast } from '../../components/Toast';
import { validatePhone, validatePassword, validateConfirmPassword, getErrorMessage } from '../../utils/validation';
import { Theme } from '../../theme';

export default function RegisterScreen({ navigation }: any) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const setUser = useAuthStore((state) => state.setUser);
  const toast = useToast();

  const handlePhoneChange = (text: string) => {
    setPhone(text);
    if (phoneError) {
      const err = validatePhone(text);
      setPhoneError(err || '');
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (passwordError) {
      const err = validatePassword(text);
      setPasswordError(err || '');
    }
    if (confirmError && confirmPassword) {
      const err = validateConfirmPassword(text, confirmPassword);
      setConfirmError(err || '');
    }
  };

  const handleConfirmChange = (text: string) => {
    setConfirmPassword(text);
    if (confirmError) {
      const err = validateConfirmPassword(password, text);
      setConfirmError(err || '');
    }
  };

  const handleRegister = async () => {
    const phoneErr = validatePhone(phone);
    const pwdErr = validatePassword(password);
    const confirmErr = validateConfirmPassword(password, confirmPassword);

    setPhoneError(phoneErr || '');
    setPasswordError(pwdErr || '');
    setConfirmError(confirmErr || '');

    if (phoneErr || pwdErr || confirmErr) {
      toast.warning(phoneErr || pwdErr || confirmErr);
      return;
    }

    setLoading(true);
    try {
      const res: any = await authApi.register({ phone: phone.trim(), password });
      if (res.code === 200) {
        await AsyncStorage.setItem('accessToken', res.data.accessToken);
        await AsyncStorage.setItem('refreshToken', res.data.refreshToken);
        try {
          const profileRes: any = await userApi.getProfile();
          if (profileRes.code === 200) {
            const user = profileRes.data;
            await AsyncStorage.setItem('user', JSON.stringify(user));
            setUser(user);
          } else {
            const fallbackUser = { id: 0, phone: phone.trim(), nickName: '', avatar: '', gender: 0, birthday: '' };
            await AsyncStorage.setItem('user', JSON.stringify(fallbackUser));
            setUser(fallbackUser);
          }
        } catch {
          const fallbackUser = { id: 0, phone: phone.trim(), nickName: '', avatar: '', gender: 0, birthday: '' };
          await AsyncStorage.setItem('user', JSON.stringify(fallbackUser));
          setUser(fallbackUser);
        }
        toast.success('注册成功，欢迎加入！');
      } else {
        const msg = res.message || '注册失败';
        if (msg.includes('已存在')) {
          setPhoneError('该手机号已注册');
          toast.error('该手机号已注册，请直接登录');
        } else {
          toast.error(msg);
        }
      }
    } catch (error: any) {
      const msg = getErrorMessage(error);
      if (msg.includes('已存在')) {
        setPhoneError('该手机号已注册');
        toast.error('该手机号已注册，请直接登录');
      } else {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.bgOrb1} />
      <View style={styles.bgOrb2} />
      <View style={styles.content}>
        <View style={styles.headerSection}>
          <Text style={styles.logo}>◈</Text>
          <Text style={styles.title}>创建账号</Text>
          <Text style={styles.subtitle}>开启你的仪式感之旅</Text>
        </View>
        <View style={styles.card}>
          <View style={styles.cardBorder} />
          <View style={styles.inputWrap}>
            <TextInput
              style={[styles.input, phoneError && styles.inputError]}
              placeholder="手机号"
              placeholderTextColor={Theme.colors.textMuted}
              keyboardType="phone-pad"
              maxLength={11}
              value={phone}
              onChangeText={handlePhoneChange}
              onBlur={() => { if (phone) { const err = validatePhone(phone); setPhoneError(err || ''); } }}
            />
            {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
          </View>
          <View style={styles.inputWrap}>
            <TextInput
              style={[styles.input, passwordError && styles.inputError]}
              placeholder="密码（6-20位）"
              placeholderTextColor={Theme.colors.textMuted}
              secureTextEntry
              maxLength={20}
              value={password}
              onChangeText={handlePasswordChange}
              onBlur={() => { if (password) { const err = validatePassword(password); setPasswordError(err || ''); } }}
            />
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
          </View>
          <View style={styles.inputWrap}>
            <TextInput
              style={[styles.input, confirmError && styles.inputError]}
              placeholder="确认密码"
              placeholderTextColor={Theme.colors.textMuted}
              secureTextEntry
              maxLength={20}
              value={confirmPassword}
              onChangeText={handleConfirmChange}
              onBlur={() => { if (confirmPassword) { const err = validateConfirmPassword(password, confirmPassword); setConfirmError(err || ''); } }}
            />
            {confirmError ? <Text style={styles.errorText}>{confirmError}</Text> : null}
          </View>
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.8}
          >
            <View style={styles.buttonGradient}>
              <View style={styles.buttonGradientLeft} />
              <View style={styles.buttonGradientRight} />
            </View>
            <Text style={styles.buttonText}>{loading ? '注册中...' : '注 册'}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Login')} activeOpacity={0.7}>
          <Text style={styles.link}>已有账号？<Text style={styles.linkHighlight}>去登录</Text></Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  bgOrb1: {
    position: 'absolute',
    top: -100,
    right: -80,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
  },
  bgOrb2: {
    position: 'absolute',
    bottom: -120,
    left: -60,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(255, 107, 157, 0.06)',
  },
  content: {
    flex: 1,
    paddingHorizontal: Theme.spacing.lg,
    justifyContent: 'center',
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: Theme.spacing.xxl,
  },
  logo: {
    fontSize: 44,
    color: Theme.colors.primary,
    marginBottom: Theme.spacing.sm,
    textShadowColor: 'rgba(192, 132, 252, 0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  title: {
    fontSize: Theme.fontSize.hero,
    fontWeight: '900',
    color: Theme.colors.text,
    letterSpacing: 4,
    textShadowColor: 'rgba(192, 132, 252, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 30,
  },
  subtitle: {
    fontSize: Theme.fontSize.md,
    color: Theme.colors.textSecondary,
    marginTop: Theme.spacing.sm,
    letterSpacing: 2,
  },
  card: {
    backgroundColor: 'rgba(26, 26, 46, 0.65)',
    borderRadius: Theme.radius.xl,
    padding: Theme.spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
    ...Theme.shadow.card,
  },
  cardBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(192, 132, 252, 0.3)',
  },
  inputWrap: {
    marginBottom: Theme.spacing.sm,
  },
  input: {
    backgroundColor: 'rgba(10, 10, 15, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: Theme.radius.md,
    padding: Theme.spacing.md,
    fontSize: Theme.fontSize.lg,
    color: Theme.colors.text,
    letterSpacing: 1,
  },
  inputError: {
    borderColor: Theme.colors.error,
    borderWidth: 1,
  },
  errorText: {
    fontSize: Theme.fontSize.xs,
    color: Theme.colors.error,
    marginTop: 4,
    marginLeft: 4,
    fontWeight: '500',
  },
  button: {
    borderRadius: Theme.radius.md,
    marginTop: Theme.spacing.md,
    overflow: 'hidden',
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    ...Theme.shadow.float,
  },
  buttonGradient: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
  },
  buttonGradientLeft: {
    flex: 1,
    backgroundColor: Theme.colors.gradientStart,
  },
  buttonGradientRight: {
    flex: 1,
    backgroundColor: Theme.colors.gradientEnd,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: Theme.fontSize.lg,
    fontWeight: '800',
    letterSpacing: 4,
  },
  link: {
    textAlign: 'center',
    color: Theme.colors.textSecondary,
    marginTop: Theme.spacing.xl,
    fontSize: Theme.fontSize.md,
  },
  linkHighlight: {
    color: Theme.colors.primary,
    fontWeight: '600',
  },
});

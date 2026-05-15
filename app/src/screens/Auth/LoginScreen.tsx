import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi } from '../../api/auth';
import { userApi } from '../../api/user';
import { useAuthStore } from '../../store/useAuthStore';
import { useToast } from '../../components/Toast';
import { validatePhone, validatePassword, getErrorMessage } from '../../utils/validation';
import { Theme } from '../../theme';

export default function LoginScreen({ navigation }: any) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
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
  };

  const handleLogin = async () => {
    const phoneErr = validatePhone(phone);
    const pwdErr = validatePassword(password);

    setPhoneError(phoneErr || '');
    setPasswordError(pwdErr || '');

    if (phoneErr || pwdErr) {
      toast.warning(phoneErr || pwdErr);
      return;
    }

    setLoading(true);
    try {
      const res: any = await authApi.login({ phone: phone.trim(), password });
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
        toast.success('登录成功');
      } else {
        const msg = res.message || '登录失败';
        if (msg.includes('密码错误')) {
          setPasswordError('密码错误');
          toast.error('密码错误，请重新输入');
        } else if (msg.includes('不存在')) {
          setPhoneError('该手机号未注册');
          toast.error('该手机号未注册，请先注册');
        } else {
          toast.error(msg);
        }
      }
    } catch (error: any) {
      const msg = getErrorMessage(error);
      if (msg.includes('密码错误')) {
        setPasswordError('密码错误');
        toast.error('密码错误，请重新输入');
      } else if (msg.includes('不存在')) {
        setPhoneError('该手机号未注册');
        toast.error('该手机号未注册，请先注册');
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
          <Text style={styles.logo}>✦</Text>
          <Text style={styles.title}>仪式感</Text>
          <Text style={styles.subtitle}>记住每一个重要日子</Text>
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
              placeholder="密码"
              placeholderTextColor={Theme.colors.textMuted}
              secureTextEntry
              maxLength={20}
              value={password}
              onChangeText={handlePasswordChange}
              onBlur={() => { if (password) { const err = validatePassword(password); setPasswordError(err || ''); } }}
            />
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
          </View>
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            <View style={styles.buttonGradient}>
              <View style={styles.buttonGradientLeft} />
              <View style={styles.buttonGradientRight} />
            </View>
            <Text style={styles.buttonText}>{loading ? '登录中...' : '登 录'}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Register')} activeOpacity={0.7}>
          <Text style={styles.link}>还没有账号？<Text style={styles.linkHighlight}>去注册</Text></Text>
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
    top: -120,
    left: -80,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(255, 107, 157, 0.06)',
  },
  bgOrb2: {
    position: 'absolute',
    bottom: -100,
    right: -60,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
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
    fontSize: 48,
    color: Theme.colors.gold,
    marginBottom: Theme.spacing.sm,
    textShadowColor: 'rgba(251, 191, 36, 0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  title: {
    fontSize: Theme.fontSize.hero,
    fontWeight: '900',
    color: Theme.colors.text,
    letterSpacing: 6,
    textShadowColor: 'rgba(255, 107, 157, 0.3)',
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
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: Theme.radius.xl,
    padding: Theme.spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.08)',
    overflow: 'hidden',
    ...Theme.shadow.card,
  },
  cardBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
  },
  inputWrap: {
    marginBottom: Theme.spacing.sm,
  },
  input: {
    backgroundColor: Theme.colors.surfaceLight,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.08)',
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

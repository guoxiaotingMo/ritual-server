import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { relationApi } from '../../api/relation';
import { Theme } from '../../theme';
import { useToast } from '../../components/Toast';
import { validateInviteCode, getErrorMessage } from '../../utils/validation';

export default function RelationScreen() {
  const [inviteCode, setInviteCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [codeError, setCodeError] = useState('');
  const toast = useToast();

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res: any = await relationApi.generateInvite();
      if (res.code === 200) {
        setGeneratedCode(res.data.inviteCode);
        toast.success('邀请码已生成');
      } else {
        toast.error(res.message || '生成失败');
      }
    } catch (error: any) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    const codeErr = validateInviteCode(inviteCode);
    setCodeError(codeErr || '');

    if (codeErr) {
      toast.warning(codeErr);
      return;
    }

    setLoading(true);
    try {
      const res: any = await relationApi.acceptInvite(inviteCode.trim());
      if (res.code === 200) {
        toast.success('绑定成功，你们已关联！');
      } else {
        const msg = res.message || '绑定失败';
        if (msg.includes('无效') || msg.includes('过期')) {
          setCodeError('邀请码无效或已过期');
          toast.error('邀请码无效或已过期');
        } else if (msg.includes('已存在')) {
          toast.warning('你们已经绑定过了');
        } else {
          toast.error(msg);
        }
      }
    } catch (error: any) {
      const msg = getErrorMessage(error);
      if (msg.includes('无效') || msg.includes('过期')) {
        setCodeError('邀请码无效或已过期');
        toast.error('邀请码无效或已过期');
      } else if (msg.includes('已存在')) {
        toast.warning('你们已经绑定过了');
      } else {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>生成邀请码</Text>
        <Text style={styles.desc}>生成邀请码后发送给你的伴侣，对方输入即可绑定</Text>
        <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleGenerate} disabled={loading} activeOpacity={0.8}>
          <Text style={styles.buttonText}>{loading ? '生成中...' : '生成邀请码'}</Text>
        </TouchableOpacity>
        {generatedCode ? (
          <View style={styles.codeContainer}>
            <Text style={styles.codeLabel}>你的邀请码</Text>
            <Text style={styles.codeValue}>{generatedCode}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.divider} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>输入邀请码</Text>
        <Text style={styles.desc}>输入伴侣的邀请码，完成绑定</Text>
        <View style={styles.glassCard}>
          <TextInput
            style={[styles.input, codeError && styles.inputError]}
            placeholder="请输入邀请码"
            placeholderTextColor={Theme.colors.textMuted}
            value={inviteCode}
            onChangeText={(text) => { setInviteCode(text); if (codeError) setCodeError(validateInviteCode(text) || ''); }}
            autoCapitalize="characters"
          />
          {codeError ? <Text style={styles.errorText}>{codeError}</Text> : null}
        </View>
        <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleAccept} disabled={loading} activeOpacity={0.8}>
          <Text style={styles.buttonText}>{loading ? '绑定中...' : '确认绑定'}</Text>
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
  section: {
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: Theme.fontSize.xl,
    fontWeight: '800',
    color: Theme.colors.text,
    marginBottom: Theme.spacing.sm,
    letterSpacing: 1,
  },
  desc: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.textSecondary,
    marginBottom: Theme.spacing.lg,
    lineHeight: 20,
  },
  button: {
    backgroundColor: Theme.colors.primary,
    paddingVertical: Theme.spacing.lg,
    borderRadius: Theme.radius.lg,
    alignItems: 'center',
    marginBottom: Theme.spacing.lg,
    ...Theme.shadow.float,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: Theme.fontSize.lg,
    fontWeight: '800',
    letterSpacing: 2,
  },
  codeContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.08)',
    borderRadius: Theme.radius.lg,
    paddingVertical: Theme.spacing.xl,
    paddingHorizontal: Theme.spacing.lg,
    alignItems: 'center',
    marginBottom: Theme.spacing.lg,
    ...Theme.shadow.card,
  },
  codeLabel: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.accent,
    marginBottom: Theme.spacing.md,
    fontWeight: '600',
    letterSpacing: 1,
  },
  codeValue: {
    fontSize: Theme.fontSize.hero,
    fontWeight: '900',
    color: Theme.colors.gold,
    letterSpacing: 6,
  },
  divider: {
    height: 1,
    backgroundColor: Theme.colors.borderLight,
    marginHorizontal: Theme.spacing.lg,
  },
  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: Theme.radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.08)',
    marginBottom: Theme.spacing.lg,
    ...Theme.shadow.card,
  },
  input: {
    fontSize: Theme.fontSize.lg,
    color: Theme.colors.text,
    paddingVertical: Theme.spacing.lg,
    paddingHorizontal: Theme.spacing.lg,
    textAlign: 'center',
    letterSpacing: 4,
    fontWeight: '700',
  },
  inputError: {
    color: Theme.colors.error,
  },
  errorText: {
    fontSize: Theme.fontSize.xs,
    color: Theme.colors.error,
    textAlign: 'center',
    paddingBottom: Theme.spacing.sm,
    fontWeight: '500',
  },
});

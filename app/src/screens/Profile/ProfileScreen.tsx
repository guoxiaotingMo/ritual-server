import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Theme } from '../../theme';
import { useAuthStore } from '../../store/useAuthStore';
import { useToast } from '../../components/Toast';

export default function ProfileScreen({ navigation }: any) {
  const { user, logout } = useAuthStore();
  const toast = useToast();

  const menuItems = [
    { title: '编辑资料', icon: '✎', onPress: () => navigation.navigate('ProfileEdit') },
    { title: '绑定伴侣', icon: '\u2665', onPress: () => navigation.navigate('Relation') },
    { title: '通知中心', icon: '\u2726', onPress: () => navigation.navigate('Notification') },
    { title: '数据同步', icon: '\u21BB', onPress: () => toast.info('功能开发中，敬请期待') },
    { title: '通用设置', icon: '\u2699', onPress: () => toast.info('功能开发中，敬请期待') },
  ];

  const handleLogout = () => {
    Alert.alert(
      '退出登录',
      '确定要退出当前账号吗？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '退出',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              toast.success('已退出登录');
            } catch {
              toast.error('退出失败，请重试');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.avatarOuter}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{user?.nickName?.charAt(0) || '?'}</Text>
          </View>
        </View>
        <Text style={styles.nickName}>{user?.nickName || '未设置昵称'}</Text>
        <Text style={styles.phone}>{user?.phone}</Text>
      </View>

      <View style={styles.sectionLabel}>
        <Text style={styles.sectionLabelText}>MENU</Text>
        <View style={styles.sectionLine} />
      </View>

      <View style={styles.menu}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.menuItem,
              index === menuItems.length - 1 && { borderBottomWidth: 0 },
            ]}
            onPress={item.onPress}
            activeOpacity={0.6}
          >
            <View style={styles.menuIconWrap}>
              <Text style={styles.menuIcon}>{item.icon}</Text>
            </View>
            <Text style={styles.menuTitle}>{item.title}</Text>
            <Text style={styles.menuArrow}>{'›'}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.6}>
        <Text style={styles.logoutText}>退出登录</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  content: {
    paddingBottom: Theme.spacing.xxl,
  },
  header: {
    paddingTop: 64,
    paddingBottom: Theme.spacing.xl,
    paddingHorizontal: Theme.spacing.lg,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderBottomLeftRadius: Theme.radius.xl,
    borderBottomRightRadius: Theme.radius.xl,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(139, 92, 246, 0.06)',
  },
  avatarOuter: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 107, 157, 0.25)',
    backgroundColor: 'rgba(255, 107, 157, 0.04)',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(139, 92, 246, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.12)',
  },
  avatarText: {
    fontSize: 34,
    color: Theme.colors.primary,
    fontWeight: '800',
  },
  nickName: {
    fontSize: Theme.fontSize.xl,
    fontWeight: '800',
    color: Theme.colors.text,
    marginTop: Theme.spacing.md,
    letterSpacing: 1,
  },
  phone: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.textMuted,
    marginTop: Theme.spacing.xs,
    letterSpacing: 1,
  },
  sectionLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Theme.spacing.xl,
    marginHorizontal: Theme.spacing.lg,
    marginBottom: Theme.spacing.sm,
  },
  sectionLabelText: {
    fontSize: 10,
    color: Theme.colors.gold,
    fontWeight: '700',
    letterSpacing: 3,
    marginRight: Theme.spacing.sm,
  },
  sectionLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(251, 191, 36, 0.15)',
  },
  menu: {
    marginHorizontal: Theme.spacing.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: Theme.radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.06)',
    ...Theme.shadow.card,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Theme.spacing.md,
    paddingLeft: Theme.spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Theme.colors.border,
  },
  menuIconWrap: {
    width: 36,
    height: 36,
    borderRadius: Theme.radius.sm,
    backgroundColor: 'rgba(255, 107, 157, 0.06)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 157, 0.08)',
  },
  menuIcon: {
    fontSize: 18,
    color: Theme.colors.primary,
  },
  menuTitle: {
    flex: 1,
    fontSize: Theme.fontSize.md,
    color: Theme.colors.text,
    fontWeight: '600',
  },
  menuArrow: {
    fontSize: 22,
    color: Theme.colors.textMuted,
    fontWeight: '300',
  },
  logoutBtn: {
    marginTop: Theme.spacing.xl,
    marginHorizontal: Theme.spacing.lg,
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
    padding: Theme.spacing.md,
    borderRadius: Theme.radius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.1)',
  },
  logoutText: {
    color: Theme.colors.error,
    fontSize: Theme.fontSize.md,
    fontWeight: '700',
    letterSpacing: 2,
  },
});

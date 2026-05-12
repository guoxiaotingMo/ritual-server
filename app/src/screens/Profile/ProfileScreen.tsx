import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useAuthStore } from '../../store/useAuthStore';

export default function ProfileScreen({ navigation }: any) {
  const { user, logout } = useAuthStore();

  const menuItems = [
    { title: '绑定伴侣', icon: '💑', onPress: () => navigation.navigate('Relation') },
    { title: '通知中心', icon: '🔔', onPress: () => navigation.navigate('Notification') },
    { title: '数据同步', icon: '📦', onPress: () => {} },
    { title: '通用设置', icon: '⚙️', onPress: () => {} },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{user?.nickName?.charAt(0) || '?'}</Text>
        </View>
        <Text style={styles.nickName}>{user?.nickName || '未设置昵称'}</Text>
        <Text style={styles.phone}>{user?.phone}</Text>
      </View>
      <View style={styles.menu}>
        {menuItems.map((item, index) => (
          <TouchableOpacity key={index} style={styles.menuItem} onPress={item.onPress}>
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <Text style={styles.menuTitle}>{item.title}</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Text style={styles.logoutText}>退出登录</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#E91E63', padding: 32, alignItems: 'center', borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  avatarContainer: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.3)', justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 32, color: '#fff', fontWeight: '600' },
  nickName: { fontSize: 20, fontWeight: '600', color: '#fff', marginTop: 12 },
  phone: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  menu: { backgroundColor: '#fff', marginTop: 16, marginHorizontal: 16, borderRadius: 12, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
  menuIcon: { fontSize: 20, marginRight: 12 },
  menuTitle: { flex: 1, fontSize: 16, color: '#333' },
  menuArrow: { fontSize: 20, color: '#ccc' },
  logoutBtn: { marginTop: 24, marginHorizontal: 16, backgroundColor: '#fff', padding: 16, borderRadius: 12, alignItems: 'center' },
  logoutText: { color: '#E91E63', fontSize: 16, fontWeight: '600' },
});

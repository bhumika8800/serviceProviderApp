import { View, Text, StyleSheet } from 'react-native';

export function ServiceDetailScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Service Detail</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 18, fontWeight: '600', color: '#0F172A' },
});

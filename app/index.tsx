import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, StatusBar, StyleSheet, Text, View } from 'react-native';

export default function LoaderScreen() {
  const router = useRouter();

  useEffect(() => {
    // On attend 4 secondes
    const timer = setTimeout(() => {
      // On utilise "as any" pour éviter l'erreur de type si player.tsx 
      // n'est pas encore totalement indexé par Expo
      router.replace('/player' as any);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.content}>
        <Text style={styles.logo}>📻</Text>
        <Text style={styles.title}>IMPACT-JOB FM</Text>

        <ActivityIndicator size="large" color="#1DB954" />

        <Text style={styles.subtitle}>Connexion au flux direct...</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.version}>© 2026 Michael Ndale - v1.0.0 - All rights reserved</Text>
        <Text style={styles.version}>impactjob.space | +257 69 97 48 48 | miguelndale@gmail.com</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontSize: 100,
    marginBottom: 20,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 3,
    marginBottom: 40,
  },
  subtitle: {
    color: '#888888',
    marginTop: 20,
    fontSize: 14,
    fontStyle: 'italic',
  },
  footer: {
    position: 'absolute',
    bottom: 50,
  },
  version: {
    color: '#444444',
    fontSize: 12,
  },
});
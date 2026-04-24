import { Ionicons } from '@expo/vector-icons';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PlayerScreen() {
    // Utilisation de <any> pour éviter les conflits de types TS sur le son
    const [sound, setSound] = useState<any>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const STREAM_URL = 'https://stream.live.vc.bbcmedia.co.uk/bbc_world_service';

    useEffect(() => {
        const configureAudio = async () => {
            try {
                // CONFIGURATION GLOBALE (C'est ici que staysActiveInBackground doit être)
                await Audio.setAudioModeAsync({
                    staysActiveInBackground: true,
                    playsInSilentModeIOS: true,
                    interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
                    shouldDuckAndroid: true,
                    interruptionModeIOS: InterruptionModeIOS.DuckOthers,
                    playThroughEarpieceAndroid: false,
                });
            } catch (error) {
                console.log("Erreur config audio:", error);
            }
        };
        configureAudio();

        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, []);

    async function toggleRadio() {
        try {
            if (sound) {
                if (isPlaying) {
                    await sound.pauseAsync();
                    setIsPlaying(false);
                } else {
                    setIsLoading(true);
                    await sound.playAsync();
                    setIsPlaying(true);
                    setIsLoading(false);
                }
            } else {
                setIsLoading(true);
                // CORRECTION : On ne met que { shouldPlay: true } ici
                const { sound: newSound } = await Audio.Sound.createAsync(
                    { uri: STREAM_URL },
                    { shouldPlay: true }
                );
                setSound(newSound);
                setIsPlaying(true);
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Erreur de lecture :", error);
            setIsLoading(false);
        }
    }

    return (
        <View style={styles.mainContainer}>
            <StatusBar style="light" />
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>RADIO IMPACT-JOB FM</Text>
                </View>

                <View style={styles.centerSection}>
                    <View style={styles.albumArt}>
                        <Ionicons name="radio" size={100} color={isPlaying ? "#1DB954" : "#333"} />
                    </View>
                    <Text style={styles.trackTitle}>BBC WORLD SERVICE</Text>
                    <View style={styles.liveBadge}>
                        <Text style={[styles.status, { color: isPlaying ? "#1DB954" : "#666" }]}>
                            {isPlaying ? "● EN DIRECT" : "PAUSE"}
                        </Text>
                    </View>
                </View>

                <View style={styles.bottomSection}>
                    <TouchableOpacity style={styles.playButton} onPress={toggleRadio} disabled={isLoading}>
                        {isLoading ? (
                            <ActivityIndicator color="white" size="large" />
                        ) : (
                            <Ionicons name={isPlaying ? "pause" : "play"} size={60} color="white" />
                        )}
                    </TouchableOpacity>

                    <View style={styles.footer}>
                        <Text style={styles.version}>© 2026 Michael Ndale - v1.0.0 - All rights reserved</Text>
                        <Text style={styles.version}>impactjob.space | +257 69 97 48 48 | miguelndale@gmail.com</Text>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: '#121212' },
    safeArea: { flex: 1, justifyContent: 'space-between', alignItems: 'center' },
    header: { marginTop: 10 },
    headerTitle: { color: '#888', fontSize: 12, fontWeight: 'bold', letterSpacing: 2 },
    centerSection: { alignItems: 'center', justifyContent: 'center', width: '100%' },
    albumArt: { width: 220, height: 220, backgroundColor: '#1e1e1e', borderRadius: 110, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#222', marginBottom: 30 },
    trackTitle: { color: 'white', fontSize: 26, fontWeight: 'bold', textAlign: 'center' },
    liveBadge: { marginTop: 10, backgroundColor: '#000', paddingHorizontal: 20, paddingVertical: 5, borderRadius: 20, borderWidth: 1, borderColor: '#333' },
    status: { fontSize: 12, fontWeight: 'bold' },
    bottomSection: { alignItems: 'center', width: '100%', paddingBottom: 30 },
    playButton: { backgroundColor: '#1DB954', width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center', marginBottom: 30 },
    footer: { width: '100%', alignItems: 'center' },
    version: { color: '#444', fontSize: 10, textAlign: 'center', lineHeight: 16 }
});
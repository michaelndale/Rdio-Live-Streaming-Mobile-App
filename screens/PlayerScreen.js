import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PlayerScreen() {
    const [sound, setSound] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // URL DE TEST (Flux de radio publique)
    const STREAM_URL = 'https://peridot.streamguys.com:80/live';

    useEffect(() => {
        // Configuration indispensable pour iOS et le mode arrière-plan
        Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            staysActiveInBackground: true,
            playsInSilentModeIOS: true,
            shouldDuckAndroid: true,
            playThroughEarpieceAndroid: false,
        });

        return () => {
            if (sound) sound.unloadAsync();
        };
    }, [sound]);

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
                const { sound: newSound } = await Audio.Sound.createAsync(
                    { uri: STREAM_URL },
                    { shouldPlay: true }
                );
                setSound(newSound);
                setIsPlaying(true);
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Erreur lecture radio:", error);
            setIsLoading(false);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>LECTEUR LIVE</Text>

            <View style={styles.diskContainer}>
                <View style={styles.disk}>
                    <Ionicons name="musical-notes" size={100} color="#1DB954" />
                </View>
            </View>

            <View style={styles.infoContainer}>
                <Text style={styles.stationName}>Radio Premium FM</Text>
                <Text style={styles.liveBadge}>● EN DIRECT</Text>
            </View>

            <TouchableOpacity
                style={styles.playButton}
                onPress={toggleRadio}
                disabled={isLoading}
            >
                {isLoading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Ionicons name={isPlaying ? "pause" : "play"} size={50} color="white" />
                )}
            </TouchableOpacity>

            <Text style={styles.footer}>Compatible iOS & Android</Text>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#121212', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 50 },
    header: { color: '#555', fontSize: 16, fontWeight: 'bold' },
    diskContainer: { marginTop: 20 },
    disk: { width: 260, height: 260, backgroundColor: '#1e1e1e', borderRadius: 130, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#333' },
    infoContainer: { alignItems: 'center' },
    stationName: { color: 'white', fontSize: 28, fontWeight: 'bold' },
    liveBadge: { color: '#ff4444', fontSize: 14, fontWeight: 'bold', marginTop: 8 },
    playButton: { backgroundColor: '#1DB954', width: 90, height: 90, borderRadius: 45, justifyContent: 'center', alignItems: 'center', elevation: 10 },
    footer: { color: '#444', fontSize: 12 }
});
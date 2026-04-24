import { Ionicons } from '@expo/vector-icons';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function PlayerScreen() {
    // Suppression du typage <Audio.Sound> pour éviter l'erreur d'itérable
    const [sound, setSound] = useState < any > (null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const STREAM_URL = 'https://direct.franceinter.fr/live/franceinter-midfi.mp3';

    useEffect(() => {
        const configureAudio = async () => {
            try {
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: false,
                    staysActiveInBackground: true,
                    interruptionModeIOS: InterruptionModeIOS.DoNotMix,
                    playsInSilentModeIOS: true,
                    shouldDuckAndroid: true,
                    interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
                    playThroughEarpieceAndroid: false,
                });
            } catch (error) {
                console.error("Erreur config audio:", error);
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
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>RADIO IMPACT-JOB FM EN DIRECT</Text>
            </View>

            <View style={styles.albumArtContainer}>
                <View style={styles.albumArt}>
                    <Ionicons
                        name={isPlaying ? "radio" : "radio-outline"}
                        size={120}
                        color={isPlaying ? "#1DB954" : "#555"}
                    />
                </View>
            </View>

            <View style={styles.infoContainer}>
                <Text style={styles.trackTitle}>IMPACT-JOB FM</Text>
                <View style={styles.liveIndicator}>
                    <Text style={[styles.status, { color: isPlaying ? "#1DB954" : "#888" }]}>
                        {isPlaying ? "● EN DIRECT" : "PRÊT À DIFFUSER"}
                    </Text>
                </View>
            </View>

            <View style={styles.controls}>
                <TouchableOpacity
                    style={styles.playButton}
                    onPress={toggleRadio}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="white" size="large" />
                    ) : (
                        <Ionicons name={isPlaying ? "pause" : "play"} size={60} color="white" />
                    )}
                </TouchableOpacity>
            </View>

            <View style={styles.footerContainer}>
                <Text style={styles.footer}>© 2026 IMPACT-JOB FM</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#121212', alignItems: 'center', justifyContent: 'space-between' },
    header: { marginTop: Platform.OS === 'android' ? 40 : 20 },
    headerTitle: { color: '#888', fontSize: 12, fontWeight: 'bold', letterSpacing: 2 },
    albumArtContainer: { flex: 1, justifyContent: 'center' },
    albumArt: { width: 240, height: 240, backgroundColor: '#1e1e1e', borderRadius: 120, justifyContent: 'center', alignItems: 'center', elevation: 15, borderWidth: 1, borderColor: '#333' },
    infoContainer: { alignItems: 'center', marginBottom: 40 },
    trackTitle: { color: 'white', fontSize: 32, fontWeight: 'bold' },
    liveIndicator: { marginTop: 10, backgroundColor: '#000', paddingHorizontal: 15, paddingVertical: 5, borderRadius: 20 },
    status: { fontSize: 14, fontWeight: 'bold' },
    controls: { marginBottom: 60 },
    playButton: { backgroundColor: '#1DB954', width: 110, height: 110, borderRadius: 55, justifyContent: 'center', alignItems: 'center' },
    footerContainer: { marginBottom: 20 },
    footer: { color: '#444', fontSize: 10, fontWeight: 'bold' }
});
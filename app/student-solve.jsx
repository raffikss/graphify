import React, { useState, useRef, useMemo } from "react";
import { View, Text, Button, StyleSheet, Alert, Platform, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import ImageAnnotator from "../components/ImageAnnotator";
import { captureRef } from "react-native-view-shot";
import { uploadFileToStorage } from "../utils/appwrite";
import { comparePoints } from "../utils/coords";

const MOCK_TEACHER_URL = "https://placehold.co/600x400/0000FF/FFFFFF.png?text=Mock+Image";
const MOCK_RED_POINTS = JSON.stringify([{ x: 0.2, y: 0.3 }, { x: 0.8, y: 0.7 }]);

export default function StudentSolve() {
    const { teacherOriginalUrl, redPoints: redPointsParam } = useLocalSearchParams();
    const router = useRouter();
    
    const imageUrl = useMemo(() => {
        return teacherOriginalUrl 
            ? `${teacherOriginalUrl}&t=${Date.now()}` 
            : MOCK_TEACHER_URL;
    }, [teacherOriginalUrl]);

    const redPoints = redPointsParam ? JSON.parse(redPointsParam) : JSON.parse(MOCK_RED_POINTS);
    const [greenPoints, setGreenPoints] = useState([]);
    const imageRef = useRef();
    const [loading, setLoading] = useState(false);

    async function handleAccept() {
        try {
            if (greenPoints.length === 0) return Alert.alert("Mark a mistake first");
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 100));
            
            const shotUri = await captureRef(imageRef, {
                format: "jpg",
                quality: 0.9,
            });

            const uploadRes = await uploadFileToStorage(shotUri, `submission-${Date.now()}.jpg`);
            const { score } = comparePoints(redPoints, greenPoints, 0.05);

            router.push({
                pathname: "/result",
                params: {
                    score: score.toString(),
                    total: redPoints.length.toString(),
                    teacherMarkedUrl: teacherOriginalUrl, 
                    studentMarkedUrl: uploadRes.url,
                    redPoints: JSON.stringify(redPoints) 
                },
            });
        } catch (err) {
            console.error(err);
            Alert.alert("Error", String(err));
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Student — Mark Mistakes</Text>
            
            <View style={styles.fullscreenArea}>
                <ImageAnnotator 
                    ref={imageRef}
                    imageUri={imageUrl} 
                    markerColor="#00FF00" 
                    points={greenPoints} 
                    onPointsChange={setGreenPoints} 
                />
            </View>

            <View style={styles.controls}>
                <Button title="Undo" onPress={() => setGreenPoints(p => p.slice(0, -1))} />
                <Button title="Clear" onPress={() => setGreenPoints([])} />
                {loading ? <ActivityIndicator /> : <Button title="Submit" onPress={handleAccept} />}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        paddingTop: 40, 
        paddingBottom: 20,
        backgroundColor: '#fff'
    },
    title: { fontSize: 20, marginBottom: 10, textAlign: "center" },
    fullscreenArea: { 
        flex: 1, 
        width: '100%',
        backgroundColor: '#333',
    },
    controls: { 
        flexDirection: "row", 
        justifyContent: "space-around", 
        paddingVertical: 15,
        backgroundColor: '#fff'
    },
});
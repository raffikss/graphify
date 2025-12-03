    // app/index.jsx
    import React from 'react';
    import { View, Text, Button, StyleSheet } from 'react-native';
    import { Link } from 'expo-router';

    export default function Home() {
    return (
        <View style={styles.container}>
        <Text style={styles.title}>Graphify — Home</Text>

        <View style={styles.row}>
            <Link href="/teacher-create" asChild>
            <Button title="Create Exercise" onPress={() => {}} />
            </Link>
        </View>

        <View style={styles.row}>
            <Link href="/student-solve" asChild>
            <Button title="Solve Exercise" onPress={() => {}} />
            </Link>
        </View>

        <Text style={styles.hint}>
            For teachers: Start by clicking "Create Exercise" to take a photo and annotate it.
            {"\n"}
            For students: Click "Solve Exercise" to practice on a sample exercise.
        </Text>
        </View>
    );
    }

    const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 22, marginBottom: 20 },
    row: { width: '100%', marginVertical: 8 },
    hint: { marginTop: 24, textAlign: 'center', color: '#666' },
    });

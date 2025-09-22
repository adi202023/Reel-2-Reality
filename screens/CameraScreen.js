import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  Image,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useApp } from '../context/AppContext';

const CameraScreen = ({ route, navigation }) => {
  const { challenge } = route.params;
  const { completeChallenge, theme } = useApp();
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions to continue.');
      return false;
    }
    return true;
  };

  const handleRecordVideo = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    setIsRecording(true);
    
    // Simulate recording delay
    setTimeout(async () => {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 1,
      });

      setIsRecording(false);

      if (!result.canceled) {
        setSelectedMedia(result.assets[0]);
      }
    }, 2000);
  };

  const handleTakePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedMedia(result.assets[0]);
    }
  };

  const handleSubmitProof = () => {
    if (!selectedMedia) {
      Alert.alert('No media selected', 'Please record a video or take a photo first.');
      return;
    }

    const success = completeChallenge(challenge.id, {
      mediaUri: selectedMedia.uri,
      mediaType: selectedMedia.type,
      timestamp: new Date()
    });

    if (success) {
      navigation.navigate('Confirmation', {
        type: 'proof_submitted',
        challenge,
        pointsEarned: challenge.points
      });
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <StatusBar barStyle={theme.barStyle} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.headerTextColor} />
        </TouchableOpacity>
        
        <Text style={[styles.headerTitle, { color: theme.headerTextColor }]}>{challenge.title}</Text>
        
        <TouchableOpacity style={styles.helpButton}>
          <Ionicons name="help-circle" size={24} color={theme.headerTextColor} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollView}
        showsVerticalScrollIndicator={false}
        bounces={true}
        alwaysBounceVertical={true}
        keyboardShouldPersistTaps="handled"
      >
        {/* Challenge Info */}
        <View style={styles.challengeInfo}>
          <Text style={[styles.challengeTitle, { color: theme.textColor }]}>{challenge.title}</Text>
          <Text style={[styles.challengeDescription, { color: theme.textColor }]}>{challenge.description}</Text>
        </View>

        {/* Camera Viewfinder Mockup */}
        <View style={styles.viewfinderContainer}>
          {selectedMedia ? (
            <View style={styles.previewContainer}>
              <Image source={{ uri: selectedMedia.uri }} style={styles.preview} />
              <View style={styles.previewOverlay}>
                <Ionicons name="checkmark-circle" size={60} color="#10b981" />
                <Text style={styles.previewText}>Media Selected!</Text>
              </View>
            </View>
          ) : (
            <View style={styles.viewfinder}>
              <View style={styles.viewfinderFrame}>
                <View style={[styles.corner, styles.topLeft]} />
                <View style={[styles.corner, styles.topRight]} />
                <View style={[styles.corner, styles.bottomLeft]} />
                <View style={[styles.corner, styles.bottomRight]} />
              </View>
              
              <View style={styles.centerContent}>
                <Ionicons name="camera" size={80} color="rgba(255,255,255,0.6)" />
                <Text style={styles.instructionText}>
                  {isRecording ? 'Recording...' : 'Tap record to start or choose from gallery'}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity
            style={styles.galleryButton}
            onPress={handleTakePhoto}
            activeOpacity={0.7}
          >
            <Ionicons name="images" size={24} color={theme.headerTextColor} />
            <Text style={[styles.controlText, { color: theme.textColor }]}>{'Gallery'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.recordButton, isRecording && styles.recordingButton]}
            onPress={handleRecordVideo}
            activeOpacity={0.8}
            disabled={isRecording}
          >
            {isRecording ? (
              <View style={styles.recordingIndicator} />
            ) : (
              <Ionicons name="videocam" size={32} color={theme.headerTextColor} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.switchButton}
            onPress={() => Alert.alert('Camera Switch', 'This would switch between front/back camera')}
            activeOpacity={0.7}
          >
            <Ionicons name="camera-reverse" size={24} color={theme.headerTextColor} />
            <Text style={[styles.controlText, { color: theme.textColor }]}>{'Flip'}</Text>
          </TouchableOpacity>
        </View>

        {/* Submit Button */}
        {selectedMedia && (
          <View style={styles.submitContainer}>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmitProof}
              activeOpacity={0.8}
            >
              <Ionicons name="send" size={20} color="white" />
              <Text style={styles.submitText}>Submit Proof (+{challenge.points} points)</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    paddingVertical: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: 50,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  helpButton: {
    padding: 8,
  },
  challengeInfo: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  challengeDescription: {
    fontSize: 14,
  },
  viewfinderContainer: {
    flex: 1,
    margin: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  viewfinder: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  viewfinderFrame: {
    position: 'absolute',
    top: 40,
    left: 40,
    right: 40,
    bottom: 40,
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: '#6366f1',
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  centerContent: {
    alignItems: 'center',
  },
  instructionText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 40,
  },
  previewContainer: {
    flex: 1,
    position: 'relative',
  },
  preview: {
    flex: 1,
    width: '100%',
    resizeMode: 'cover',
  },
  previewOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 40,
    paddingVertical: 30,
  },
  galleryButton: {
    alignItems: 'center',
    gap: 8,
  },
  switchButton: {
    alignItems: 'center',
    gap: 8,
  },
  controlText: {
    fontSize: 12,
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'white',
  },
  recordingButton: {
    backgroundColor: '#dc2626',
  },
  recordingIndicator: {
    width: 24,
    height: 24,
    backgroundColor: 'white',
    borderRadius: 4,
  },
  submitContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10b981',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  submitText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CameraScreen;

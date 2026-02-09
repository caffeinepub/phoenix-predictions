import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useCamera } from '@/camera/useCamera';
import { useMediaRecorder } from '@/hooks/useMediaRecorder';
import { Camera, Video, Square, Download, Trash2, AlertCircle, Play, Pause } from 'lucide-react';

export default function CameraCaptureRecorderCard() {
  const {
    isActive: isCameraActive,
    isSupported: isCameraSupported,
    error: cameraError,
    isLoading: isCameraLoading,
    startCamera,
    stopCamera,
    videoRef,
    canvasRef,
  } = useCamera({
    facingMode: 'environment',
    width: 1280,
    height: 720,
  });

  const {
    isRecording,
    isPaused,
    elapsedTime,
    recordedUrl,
    error: recorderError,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    clearRecording,
    downloadRecording,
  } = useMediaRecorder({
    mimeType: 'video/webm;codecs=vp9',
    videoBitsPerSecond: 2500000,
  });

  const [showRecordedVideo, setShowRecordedVideo] = useState(false);

  // Format elapsed time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start recording when camera becomes active
  const handleStartRecording = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      startRecording(stream);
    }
  };

  // Stop recording
  const handleStopRecording = () => {
    stopRecording();
    setShowRecordedVideo(true);
  };

  // Clear and restart
  const handleClearRecording = () => {
    clearRecording();
    setShowRecordedVideo(false);
  };

  // Show camera not supported message
  if (isCameraSupported === false) {
    return (
      <Card className="aviator-card border-destructive/50">
        <CardHeader>
          <CardTitle className="font-heading text-2xl flex items-center gap-2">
            <Camera className="h-6 w-6" />
            Camera Capture
          </CardTitle>
          <CardDescription>Record live Aviator gameplay for analytics</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Camera is not supported in your browser. Please use a modern browser with camera support.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="aviator-card">
      <CardHeader>
        <CardTitle className="font-heading text-2xl flex items-center gap-2">
          <Camera className="h-6 w-6" />
          Camera Capture
        </CardTitle>
        <CardDescription>Record live Aviator gameplay for analytics</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Camera Error */}
        {cameraError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {cameraError.type === 'permission'
                ? 'Camera permission denied. Please allow camera access to continue.'
                : cameraError.type === 'not-found'
                  ? 'No camera found. Please connect a camera device.'
                  : cameraError.message}
            </AlertDescription>
          </Alert>
        )}

        {/* Recorder Error */}
        {recorderError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{recorderError}</AlertDescription>
          </Alert>
        )}

        {/* Camera Preview */}
        {!showRecordedVideo && (
          <div className="relative w-full bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              style={{ minHeight: '300px' }}
            />
            <canvas ref={canvasRef} className="hidden" />
            
            {/* Recording Indicator */}
            {isRecording && !isPaused && (
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-destructive/90 text-destructive-foreground px-3 py-2 rounded-full">
                <div className="h-3 w-3 rounded-full bg-white animate-pulse" />
                <span className="text-sm font-bold">REC {formatTime(elapsedTime)}</span>
              </div>
            )}

            {/* Paused Indicator */}
            {isPaused && (
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-muted/90 text-muted-foreground px-3 py-2 rounded-full">
                <Pause className="h-3 w-3" />
                <span className="text-sm font-bold">PAUSED {formatTime(elapsedTime)}</span>
              </div>
            )}

            {/* Camera not active overlay */}
            {!isCameraActive && !isCameraLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                <div className="text-center">
                  <Camera className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Camera not active</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Recorded Video Playback */}
        {showRecordedVideo && recordedUrl && (
          <div className="relative w-full bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
            <video
              src={recordedUrl}
              controls
              className="w-full h-full object-cover"
              style={{ minHeight: '300px' }}
            />
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-wrap gap-2">
          {/* Camera Controls */}
          {!isCameraActive && !isRecording && !showRecordedVideo && (
            <Button
              onClick={startCamera}
              disabled={isCameraLoading}
              className="bg-primary hover:bg-primary/90"
            >
              <Camera className="h-4 w-4 mr-2" />
              {isCameraLoading ? 'Initializing...' : 'Enable Camera'}
            </Button>
          )}

          {isCameraActive && !isRecording && !showRecordedVideo && (
            <>
              <Button
                onClick={handleStartRecording}
                disabled={isCameraLoading}
                className="bg-primary hover:bg-primary/90"
              >
                <Video className="h-4 w-4 mr-2" />
                Start Recording
              </Button>
              <Button
                onClick={stopCamera}
                variant="secondary"
                disabled={isCameraLoading}
              >
                Stop Camera
              </Button>
            </>
          )}

          {/* Recording Controls */}
          {isRecording && (
            <>
              <Button
                onClick={handleStopRecording}
                variant="destructive"
              >
                <Square className="h-4 w-4 mr-2" />
                Stop Recording
              </Button>
              {!isPaused ? (
                <Button
                  onClick={pauseRecording}
                  variant="secondary"
                >
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </Button>
              ) : (
                <Button
                  onClick={resumeRecording}
                  variant="secondary"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Resume
                </Button>
              )}
            </>
          )}

          {/* Playback Controls */}
          {showRecordedVideo && recordedUrl && (
            <>
              <Button
                onClick={() => downloadRecording()}
                className="bg-primary hover:bg-primary/90"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Recording
              </Button>
              <Button
                onClick={handleClearRecording}
                variant="secondary"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear & Record Again
              </Button>
            </>
          )}
        </div>

        {/* Info */}
        {isCameraActive && !isRecording && !showRecordedVideo && (
          <p className="text-sm text-muted-foreground">
            Position your camera to capture the Aviator game screen, then click "Start Recording" to begin.
          </p>
        )}

        {recordedUrl && showRecordedVideo && (
          <p className="text-sm text-muted-foreground">
            Recording complete! You can download the video for offline analysis or clear it to record again.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

import { useState, useRef, useCallback, useEffect } from 'react';

export interface UseMediaRecorderOptions {
  mimeType?: string;
  videoBitsPerSecond?: number;
}

export interface UseMediaRecorderReturn {
  isRecording: boolean;
  isPaused: boolean;
  elapsedTime: number;
  recordedBlob: Blob | null;
  recordedUrl: string | null;
  error: string | null;
  startRecording: (stream: MediaStream) => void;
  stopRecording: () => void;
  pauseRecording: () => void;
  resumeRecording: () => void;
  clearRecording: () => void;
  downloadRecording: (filename?: string) => void;
}

export function useMediaRecorder(options: UseMediaRecorderOptions = {}): UseMediaRecorderReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedTimeRef = useRef<number>(0);

  const mimeType = options.mimeType || 'video/webm';

  // Cleanup function
  const cleanup = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    mediaRecorderRef.current = null;
  }, []);

  // Clear recording and revoke URL
  const clearRecording = useCallback(() => {
    if (recordedUrl) {
      URL.revokeObjectURL(recordedUrl);
    }
    setRecordedBlob(null);
    setRecordedUrl(null);
    setElapsedTime(0);
    setError(null);
  }, [recordedUrl]);

  // Start recording
  const startRecording = useCallback((stream: MediaStream) => {
    try {
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        setError(`MediaRecorder does not support ${mimeType}`);
        return;
      }

      clearRecording();
      chunksRef.current = [];

      const recorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: options.videoBitsPerSecond,
      });

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        setRecordedBlob(blob);
        const url = URL.createObjectURL(blob);
        setRecordedUrl(url);
        setIsRecording(false);
        setIsPaused(false);
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      };

      recorder.onerror = (event: Event) => {
        const errorEvent = event as ErrorEvent;
        setError(`Recording error: ${errorEvent.message || 'Unknown error'}`);
        cleanup();
      };

      recorder.start(100); // Collect data every 100ms
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setIsPaused(false);
      setError(null);

      // Start timer
      startTimeRef.current = Date.now();
      pausedTimeRef.current = 0;
      timerRef.current = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTimeRef.current - pausedTimeRef.current) / 1000));
      }, 1000);
    } catch (err) {
      setError(`Failed to start recording: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, [mimeType, options.videoBitsPerSecond, clearRecording, cleanup]);

  // Stop recording
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  }, []);

  // Pause recording
  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      pausedTimeRef.current = Date.now() - startTimeRef.current;
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, []);

  // Resume recording
  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      const pauseDuration = Date.now() - startTimeRef.current - pausedTimeRef.current;
      startTimeRef.current = Date.now() - pausedTimeRef.current;
      timerRef.current = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTimeRef.current - pausedTimeRef.current) / 1000));
      }, 1000);
    }
  }, []);

  // Download recording
  const downloadRecording = useCallback((filename?: string) => {
    if (!recordedBlob || !recordedUrl) return;

    const extension = mimeType.split('/')[1].split(';')[0];
    const defaultFilename = `aviator-recording-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.${extension}`;
    
    const a = document.createElement('a');
    a.href = recordedUrl;
    a.download = filename || defaultFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [recordedBlob, recordedUrl, mimeType]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
      if (recordedUrl) {
        URL.revokeObjectURL(recordedUrl);
      }
    };
  }, [cleanup, recordedUrl]);

  return {
    isRecording,
    isPaused,
    elapsedTime,
    recordedBlob,
    recordedUrl,
    error,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    clearRecording,
    downloadRecording,
  };
}

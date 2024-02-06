import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  GestureResponderEvent,
  Image,
  ImageBackground,
  LayoutChangeEvent,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewProps,
} from 'react-native';
import { Spinner } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Video, {
  OnBufferData,
  OnLoadData,
  OnProgressData,
  OnSeekData,
} from 'react-native-video';

const BackgroundImage = ImageBackground || Image; // fall back to Image if RN < 0.46

const getDurationTime = (duration: number) => {
  const padTimeValueString = (value: number) =>
    value.toString().padStart(2, '0');

  if (!Number.isFinite(duration)) {
    return '';
  }
  let seconds: string | number = Math.floor(duration % 60),
    minutes: string | number = Math.floor((duration / 60) % 60),
    hours: string | number = Math.floor((duration / (60 * 60)) % 24);

  const isHrsZero = hours === 0;
  hours = isHrsZero ? 0 : padTimeValueString(hours);
  minutes = padTimeValueString(minutes);
  seconds = padTimeValueString(seconds);

  if (isHrsZero) {
    return minutes + ':' + seconds;
  }

  return hours + ':' + minutes + ':' + seconds;
};

interface VideoPlayerProps {
  video: Video['props']['source'];
  thumbnail?: Image['props']['source'];
  endThumbnail?: Image['props']['source'];
  videoWidth?: number;
  videoHeight?: number;
  duration?: number;
  autoplay?: boolean;
  paused?: boolean;
  defaultMuted?: boolean;
  muted?: boolean;
  style?: ViewProps['style'];
  controlsTimeout?: number;
  disableControlsAutoHide?: boolean;
  disableFullscreen?: boolean;
  loop?: boolean;
  resizeMode?: Video['props']['resizeMode'];
  hideControlsOnStart?: boolean;
  endWithThumbnail?: boolean;
  disableSeek?: boolean;
  pauseOnPress?: boolean;
  fullScreenOnLongPress?: boolean;
  customStyles?: {
    wrapper?: ViewProps['style'];
    video?: Video['props']['style'];
    videoWrapper?: ViewProps['style'];
    controls?: ViewProps['style'];
    playControl?: ViewProps['style'];
    controlButton?: ViewProps['style'];
    controlIcon?: Icon['props']['style'];
    playIcon?: Icon['props']['style'];
    seekBar?: ViewProps['style'];
    seekBarFullWidth?: ViewProps['style'];
    seekBarProgress?: ViewProps['style'];
    seekBarKnob?: ViewProps['style'];
    seekBarKnobSeeking?: ViewProps['style'];
    seekBarBackground?: ViewProps['style'];
    thumbnail?: Image['props']['style'];
    playButton?: ViewProps['style'];
    playArrow?: Icon['props']['style'];
    durationText?: ViewProps['style'];
  };
  onEnd?: (event?: any) => {};
  onProgress?: (event: OnProgressData) => {};
  onLoad?: (event: OnLoadData) => {};
  onStart?: () => {};
  onPlayPress?: () => {};
  onHideControls?: () => {};
  onShowControls?: () => {};
  onMutePress?: (isMute: boolean) => {};
  showDuration?: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  video,
  defaultMuted,
  hideControlsOnStart,
  thumbnail,
  endThumbnail,
  muted,
  paused,
  style,
  videoWidth = 1280,
  videoHeight = 720,
  autoplay = false,
  disableControlsAutoHide,
  disableFullscreen,
  duration,
  endWithThumbnail,
  onEnd,
  onHideControls,
  onLoad,
  onMutePress,
  onPlayPress,
  onProgress,
  onShowControls,
  onStart,
  controlsTimeout = 2000,
  loop = false,
  resizeMode = 'contain',
  disableSeek = false,
  pauseOnPress = false,
  fullScreenOnLongPress = false,
  customStyles,
  showDuration = false,
}) => {
  const player = useRef<Video | null>(null);
  const currentTime = useRef<TextInput | null>(null);
  const _controlsTimeout = useRef<NodeJS.Timeout | null>(null);
  const [isStarted, setIsStarted] = useState(autoplay);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [hasEnded, setHasEnded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [width, setWidth] = useState(200);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(defaultMuted);
  const [isControlsVisible, setIsControlsVisible] = useState(
    !hideControlsOnStart
  );
  const [_duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);

  let seekBarWidth = 200;
  let wasPlayingBeforeSeek = autoplay;
  let seekTouchStart = 0;
  let seekProgressStart = 0;

  const hideControls = useCallback(() => {
    if (onHideControls) {
      onHideControls();
    }

    if (disableControlsAutoHide) {
      return;
    }

    if (_controlsTimeout.current) {
      clearTimeout(_controlsTimeout.current);
      _controlsTimeout.current = null;
    }
    _controlsTimeout.current = setTimeout(() => {
      setIsControlsVisible(false);
    }, controlsTimeout);
  }, [controlsTimeout, disableControlsAutoHide, onHideControls]);

  useEffect(() => {
    if (autoplay) {
      hideControls();
    }

    return () => {
      if (_controlsTimeout.current) {
        clearTimeout(_controlsTimeout.current);
        _controlsTimeout.current = null;
      }
    };
  }, [autoplay, hideControls]);

  const onLayout = (event: LayoutChangeEvent) => {
    const { width: layoutWidth } = event.nativeEvent.layout;
    setWidth(layoutWidth);
  };

  const onStartPress = () => {
    if (onStart) {
      onStart();
    }
    setIsPlaying(true);
    setIsStarted(true);
    setHasEnded(false);
    setProgress(progress === 1 ? 0 : progress);

    hideControls();
  };

  const onSeekBarLayout = (event: LayoutChangeEvent) => {
    const customStyle = customStyles?.seekBar;
    let padding = 0;
    // @ts-ignore
    if (customStyle && customStyle.paddingHorizontal) {
      // @ts-ignore
      padding = customStyle.paddingHorizontal * 2;
    } else if (customStyle) {
      // @ts-ignore
      padding = customStyle.paddingLeft || 0;
      // @ts-ignore
      padding += customStyle.paddingRight ? customStyle.paddingRight : 0;
    } else {
      padding = 20;
    }

    seekBarWidth = event.nativeEvent.layout.width - padding;
  };

  const onSeekStartResponder = () => {
    return true;
  };

  const onSeekMoveResponder = () => {
    return true;
  };

  const onSeekGrant = (e: GestureResponderEvent) => {
    seekTouchStart = e.nativeEvent.pageX;
    seekProgressStart = progress;
    wasPlayingBeforeSeek = isPlaying;
    setIsSeeking(true);
    setIsPlaying(false);
  };

  const onSeekRelease = () => {
    setIsSeeking(false);
    setIsPlaying(wasPlayingBeforeSeek);
    showControls();
  };

  const onSeek = (e: GestureResponderEvent) => {
    const diff = e.nativeEvent.pageX - seekTouchStart;
    const ratio = 100 / seekBarWidth;
    const _progress = seekProgressStart + (ratio * diff) / 100;

    setProgress(_progress);

    player.current?.seek(_progress * _duration);
  };

  const handleLoadStart = () => {
    setIsLoading(true);
  };

  const handleBuffer = (buffData: OnBufferData) => {
    setIsLoading(true);
    if (buffData.isBuffering) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  };

  const showControls = () => {
    if (onShowControls) {
      onShowControls();
    }

    setIsControlsVisible(true);
    hideControls();
  };

  const renderStartButton = () => {
    return (
      <TouchableOpacity
        style={[styles.playButton, customStyles?.playButton]}
        onPress={onStartPress}
      >
        <Icon
          style={[styles.playArrow, customStyles?.playArrow]}
          name="play-arrow"
          size={42}
        />
      </TouchableOpacity>
    );
  };

  const getSizeStyles = () => {
    const ratio = videoHeight / videoWidth;
    return {
      height: width * ratio,
      width,
    };
  };

  const renderThumbnail = (_thumbnail: Image['props']['source']) => {
    return (
      <BackgroundImage
        style={[
          styles.thumbnail,
          getSizeStyles(),
          style,
          customStyles?.thumbnail,
        ]}
        source={_thumbnail}
      >
        {renderStartButton()}
      </BackgroundImage>
    );
  };

  const _onProgress = (event: OnProgressData) => {
    if (isSeeking) {
      return;
    }
    if (onProgress) {
      onProgress(event);
    }
    setProgress(event.currentTime / (duration || _duration));
    currentTime.current?.setNativeProps({
      text: getDurationTime(event.currentTime),
    });
  };

  const _onEnd = (event?: any) => {
    if (onEnd) {
      onEnd(event);
    }

    if (endWithThumbnail || endThumbnail) {
      setIsStarted(false);
      setHasEnded(true);
      player.current?.dismissFullscreenPlayer();
    }

    setProgress(1);

    if (!loop) {
      setIsPlaying(false);
    }
    player.current?.seek(0);

    currentTime.current?.setNativeProps({
      text: getDurationTime(_duration),
    });
  };

  const _onLoad = (event: OnLoadData) => {
    if (onLoad) {
      onLoad(event);
    }
    const { duration: loadDuration } = event;
    setIsLoading(false);
    setDuration(loadDuration);
  };

  const _onPlayPress = () => {
    if (onPlayPress) {
      onPlayPress();
    }
    setIsPlaying(!isPlaying);
    showControls();
  };

  const _onMutePress = () => {
    const _isMuted = !isMuted;
    if (onMutePress) {
      onMutePress(_isMuted);
    }
    setIsMuted(_isMuted);
    showControls();
  };

  const onToggleFullScreen = () => {
    player.current?.presentFullscreenPlayer();
  };

  const _onSeekEvent = (e: OnSeekData) => {
    currentTime.current?.setNativeProps({
      text: getDurationTime(e.currentTime),
    });
  };

  const renderSeekBar = (fullWidth?: boolean) => {
    return (
      <View
        style={[
          styles.seekBar,
          fullWidth ? styles.seekBarFullWidth : {},
          customStyles?.seekBar,
          fullWidth ? customStyles?.seekBarFullWidth : {},
        ]}
        onLayout={onSeekBarLayout}
      >
        <View
          style={[
            { flexGrow: progress },
            styles.seekBarProgress,
            customStyles?.seekBarProgress,
          ]}
        />
        {!fullWidth && !disableSeek ? (
          <View
            style={[
              styles.seekBarKnob,
              customStyles?.seekBarKnob,
              isSeeking ? { transform: [{ scale: 1 }] } : {},
              isSeeking ? customStyles?.seekBarKnobSeeking : {},
            ]}
            hitSlop={{ top: 20, bottom: 20, left: 10, right: 20 }}
            onStartShouldSetResponder={onSeekStartResponder}
            onMoveShouldSetResponder={onSeekMoveResponder}
            onResponderGrant={onSeekGrant}
            onResponderMove={onSeek}
            onResponderRelease={onSeekRelease}
            onResponderTerminate={onSeekRelease}
          />
        ) : null}
        <View
          style={[
            styles.seekBarBackground,
            { flexGrow: 1 - progress },
            customStyles?.seekBarBackground,
          ]}
        />
      </View>
    );
  };

  const renderControls = () => {
    return (
      <View style={[styles.controls, customStyles?.controls]}>
        <TouchableOpacity
          onPress={_onPlayPress}
          style={[customStyles?.controlButton, customStyles?.playControl]}
        >
          <Icon
            style={[
              styles.playControl,
              customStyles?.controlIcon,
              customStyles?.playIcon,
            ]}
            name={isPlaying ? 'pause' : 'play-arrow'}
            size={32}
          />
        </TouchableOpacity>
        {renderSeekBar()}
        {showDuration && (
          <>
            <TextInput
              style={[
                styles.durationText,
                styles.activeDurationText,
                customStyles?.durationText,
              ]}
              editable={false}
              ref={(e) => (currentTime.current = e)}
              value={getDurationTime(0)}
            />
            <Text style={[styles.durationText, customStyles?.durationText]}>
              /
            </Text>
            <Text style={[styles.durationText, customStyles?.durationText]}>
              {getDurationTime(_duration)}
            </Text>
          </>
        )}
        {muted ? null : (
          <TouchableOpacity
            onPress={_onMutePress}
            style={customStyles?.controlButton}
          >
            <Icon
              style={[styles.extraControl, customStyles?.controlIcon]}
              name={isMuted ? 'volume-off' : 'volume-up'}
              size={24}
            />
          </TouchableOpacity>
        )}
        {Platform.OS === 'android' || disableFullscreen ? null : (
          <TouchableOpacity
            onPress={onToggleFullScreen}
            style={customStyles?.controlButton}
          >
            <Icon
              style={[styles.extraControl, customStyles?.controlIcon]}
              name="fullscreen"
              size={32}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderVideo = () => {
    return (
      <View style={customStyles?.videoWrapper}>
        <View
          style={{
            position: 'relative',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Video
            style={[styles.video, getSizeStyles(), style, customStyles?.video]}
            ref={(p) => {
              player.current = p;
            }}
            muted={muted || isMuted}
            paused={paused ? paused || !isPlaying : !isPlaying}
            onProgress={_onProgress}
            onEnd={_onEnd}
            onLoad={_onLoad}
            source={video}
            resizeMode={resizeMode}
            onSeek={_onSeekEvent}
            onLoadStart={handleLoadStart}
            onBuffer={handleBuffer}
          />
          {isLoading && (
            <View
              style={{
                position: 'absolute',
              }}
            >
              <Spinner size="lg" accessibilityLabel="Loading video" />
            </View>
          )}
        </View>
        <View style={[getSizeStyles(), { marginTop: -getSizeStyles().height }]}>
          <TouchableOpacity
            style={styles.overlayButton}
            onPress={() => {
              showControls();
              if (pauseOnPress) {
                _onPlayPress();
              }
            }}
            onLongPress={() => {
              if (fullScreenOnLongPress && Platform.OS !== 'android') {
                onToggleFullScreen();
              }
            }}
          />
        </View>
        {!isPlaying || isControlsVisible
          ? renderControls()
          : renderSeekBar(true)}
      </View>
    );
  };

  const renderContent = () => {
    if (hasEnded && endThumbnail) {
      return renderThumbnail(endThumbnail);
    } else if (!isStarted && thumbnail) {
      return renderThumbnail(thumbnail);
    } else if (!isStarted) {
      return (
        <View style={[styles.preloadingPlaceholder, getSizeStyles(), style]}>
          {renderStartButton()}
        </View>
      );
    }
    return renderVideo();
  };

  return (
    <View onLayout={onLayout} style={customStyles?.wrapper}>
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  preloadingPlaceholder: {
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnail: {
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playArrow: {
    color: 'white',
  },
  video:
    Platform.Version >= 24
      ? {}
      : {
          backgroundColor: 'black',
        },
  controls: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    height: 48,
    marginTop: -48,
    flexDirection: 'row',
    alignItems: 'center',
  },
  playControl: {
    color: 'white',
    padding: 8,
  },
  extraControl: {
    color: 'white',
    padding: 8,
  },
  seekBar: {
    alignItems: 'center',
    height: 30,
    flexGrow: 1,
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginLeft: -10,
    marginRight: -5,
  },
  seekBarFullWidth: {
    marginLeft: 0,
    marginRight: 0,
    paddingHorizontal: 0,
    marginTop: -3,
    height: 3,
  },
  seekBarProgress: {
    height: 3,
    backgroundColor: '#F00',
  },
  seekBarKnob: {
    width: 20,
    height: 20,
    marginHorizontal: -8,
    marginVertical: -10,
    borderRadius: 10,
    backgroundColor: '#F00',
    transform: [{ scale: 0.8 }],
    zIndex: 1,
  },
  seekBarBackground: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    height: 3,
  },
  overlayButton: {
    flex: 1,
  },
  activeDurationText: {
    paddingLeft: 8,
    paddingRight: 0,
    paddingBottom: 0,
    paddingTop: 0,
  },
  durationText: {
    color: 'white',
  },
});

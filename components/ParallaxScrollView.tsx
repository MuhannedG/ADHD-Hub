// ParallaxScrollView.tsx

import React, { FC, ReactNode } from 'react';
import {
  ScrollView,
  ScrollViewProps,
  StyleSheet,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';

/**
 * Interface for the ParallaxScrollView props
 */
export interface ParallaxScrollViewProps extends ScrollViewProps {
  /**
   * The height (in px) of the "header" or "foreground" area at the top.
   * Defaults to 200 if not provided.
   */
  parallaxHeaderHeight?: number;

  /**
   * The height reserved for a sticky header (unused in this minimal version).
   * Defaults to 0 if not provided.
   */
  stickyHeaderHeight?: number;

  /**
   * If you want to fade out the foreground (unused in this minimal version).
   * Defaults to false.
   */
  fadeOutForeground?: boolean;

  /**
   * If you want to fade out the background (unused in this minimal version).
   * Defaults to false.
   */
  fadeOutBackground?: boolean;

  /**
   * The background color of the header area.
   * Defaults to 'transparent'.
   */
  backgroundColor?: string;

  /**
   * The background color for the content below the header.
   * Defaults to 'transparent'.
   */
  contentBackgroundColor?: string;

  /**
   * A function returning the header “foreground” element (e.g., an ImageBackground).
   * This is rendered at the top, within the fixed-height header area.
   */
  renderForeground?: () => ReactNode;

  /**
   * Additional style for the content container (below the header).
   */
  contentContainerStyle?: StyleProp<ViewStyle>;
}

/**
 * A minimal ParallaxScrollView component that:
 *  - Renders a fixed-height header at the top (the "foreground")
 *  - Renders children below the header
 *  - Accepts props matching what you've used in your screens (parallaxHeaderHeight, etc.)
 *  - Does NOT implement an actual parallax animation (just a static layout)
 */
const ParallaxScrollView: FC<ParallaxScrollViewProps> = ({
  parallaxHeaderHeight = 200,
  stickyHeaderHeight = 0,
  fadeOutForeground = false,
  fadeOutBackground = false,
  backgroundColor = 'transparent',
  contentBackgroundColor = 'transparent',
  renderForeground,
  contentContainerStyle,
  children,
  style,
  ...scrollProps
}) => {
  return (
    <ScrollView
      style={[styles.scrollView, style]}
      {...scrollProps}
    >
      {/* Header (foreground) area, fixed height */}
      <View
        style={[
          styles.headerContainer,
          { height: parallaxHeaderHeight, backgroundColor },
        ]}
      >
        {renderForeground?.()}
      </View>

      {/* Main content area, below the header */}
      <View
        style={[
          styles.contentContainer,
          contentContainerStyle,
          { backgroundColor: contentBackgroundColor },
        ]}
      >
        {children}
      </View>
    </ScrollView>
  );
};

export default ParallaxScrollView;

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  headerContainer: {
    width: '100%',
  },
  contentContainer: {
    width: '100%',
  },
});


import Animated, { useAnimatedStyle, useSharedValue, interpolate, useAnimatedScrollHandler, runOnJS, } from 'react-native-reanimated';
import { View, Dimensions, StyleSheet, TouchableOpacity, ImageBackground, Text, } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import config from 'tailwind.config';


const { width: screenWidth } = Dimensions.get('window');
const CARD_HEIGHT = 200;

interface AppleWidgetItem {
  id: string;
  title: string;
  subtitle?: string;
  background: string;
  content?: React.ReactNode;
}

interface AppleWidgetProps {
  items: AppleWidgetItem[];
}

export function AppleWidget({ items }: AppleWidgetProps) {
  const scrollViewRef = useRef<Animated.ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollY = useSharedValue(0);

  // Triple items for infinite scroll
  const infiniteItems = [...items, ...items, ...items];
  const middleIndex = items.length;

  useEffect(() => {
    // Start in the middle for infinite effect
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({
        y: middleIndex * CARD_HEIGHT,
        animated: false,
      });
    }, 100);
  }, [middleIndex]);

  const updateCurrentIndex = (index: number) => {
    setCurrentIndex(index % items.length);
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const onMomentumScrollEnd = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / CARD_HEIGHT);
    
    // Reset position for infinite scroll
    if (index <= 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          y: (items.length * 2 - 1) * CARD_HEIGHT,
          animated: false,
        });
      }, 50);
      updateCurrentIndex(items.length - 1);
    } else if (index >= infiniteItems.length - 1) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          y: items.length * CARD_HEIGHT,
          animated: false,
        });
      }, 50);
      updateCurrentIndex(0);
    } else {
      updateCurrentIndex(index);
    }
  };

  const scrollToIndex = (targetIndex: number) => {
    const currentScrollIndex = Math.round(scrollY.value / CARD_HEIGHT);
    const currentRealIndex = currentScrollIndex % items.length;
    
    let scrollIndex = currentScrollIndex;
    
    if (targetIndex !== currentRealIndex) {
      // Find the closest path to target
      const diff = targetIndex - currentRealIndex;
      if (Math.abs(diff) <= items.length / 2) {
        scrollIndex = currentScrollIndex + diff;
      } else {
        scrollIndex = currentScrollIndex + (diff > 0 ? diff - items.length : diff + items.length);
      }
      
      scrollViewRef.current?.scrollTo({
        y: scrollIndex * CARD_HEIGHT,
        animated: true,
      });
    }
  };

  const renderItem = (item: AppleWidgetItem, index: number) => {
    const animatedStyle = useAnimatedStyle(() => {
      const inputRange = [
        (index - 1) * CARD_HEIGHT,
        index * CARD_HEIGHT,
        (index + 1) * CARD_HEIGHT,
      ];

      return {
        transform: [{ 
          scale: interpolate(scrollY.value, inputRange, [0.8, 1, 0.8], 'clamp') 
        }],
        opacity: interpolate(scrollY.value, inputRange, [0, 1, 0], 'clamp'),
      };
    });

    const backgroundAnimatedStyle = useAnimatedStyle(() => {
      const inputRange = [
        (index - 1) * CARD_HEIGHT,
        index * CARD_HEIGHT,
        (index + 1) * CARD_HEIGHT,
      ];

      return {
        transform: [{ 
          translateY: interpolate(scrollY.value, inputRange, [-15, 0, 15], 'clamp') 
        }],
      };
    });

    return (
      <Animated.View key={`${item.id}-${index}`} style={[styles.card, animatedStyle]}>
        <View style={styles.cardContainer}>
          <Animated.View style={[styles.backgroundContainer, backgroundAnimatedStyle]}>
            <View
             className="flex-1 bg-primary"
            >
              <View style={styles.gradient} />
            </View>
          </Animated.View>
          
          <View style={styles.cardContent}>
            {item.content || (
              <>
                <Text style={styles.cardTitle}>{item.title}</Text>
                {item.subtitle && (
                  <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
                )}
              </>
            )}
          </View>
        </View>
      </Animated.View>
    );
  };

  const renderDots = () => (
    <View style={styles.dotsContainer}>
      {items.map((_, index) => {
        const animatedDotStyle = useAnimatedStyle(() => {
          // Calculate current index based on scroll position
          const currentScrollIndex = scrollY.value / CARD_HEIGHT;
          const currentRealIndex = (currentScrollIndex % items.length + items.length) % items.length;
          
          // Distance from current position
          const distance = Math.abs(index - currentRealIndex);
          const adjustedDistance = Math.min(distance, items.length - distance);
          
          return {
            transform: [{ 
              scale: interpolate(adjustedDistance, [0, 1], [1.4, 0.8], 'clamp') 
            }],
            opacity: interpolate(adjustedDistance, [0, 1], [1, 0.4], 'clamp'),
            backgroundColor: config.theme.extend.colors.primary,
          };
        });
        
        return (
          <TouchableOpacity
            key={index}
            onPress={() => scrollToIndex(index)}
            style={styles.dotTouchable}
          >
            <Animated.View style={[styles.dot, animatedDotStyle]} />
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.carouselContainer}>
        <View style={styles.scrollContainer}>
          {/* Subtle blur effect at top */}
          {/* <BlurView 
            intensity={5}
            style={styles.blurOverlay}
            tint={"light"}
          /> */}
          
          <Animated.ScrollView
            ref={scrollViewRef}
            showsVerticalScrollIndicator={false}
            pagingEnabled={true}
            decelerationRate="fast"
            snapToInterval={CARD_HEIGHT}
            snapToAlignment="center"
            contentContainerStyle={styles.scrollViewContent}
            onScroll={scrollHandler}
            onMomentumScrollEnd={onMomentumScrollEnd}
            scrollEventThrottle={16}
          >
            {infiniteItems.map((item, index) => renderItem(item, index))}
          </Animated.ScrollView>
        </View>
        
        {renderDots()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: CARD_HEIGHT,
    backgroundColor: config.theme.extend.colors.background,
  },
  carouselContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: config.theme.extend.colors.background,
    // shadowColor: config.theme.extend.colors.background,
    // shadowOffset: { width: 10, height: 10 },
    // shadowOpacity: 0.8,
    // shadowRadius: 15,
    elevation: 20,
    overflow: 'hidden',
  },
  scrollViewContent: {
    flexGrow: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  card: {
    height: CARD_HEIGHT,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    flex: 1,
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 15,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  backgroundImageStyle: {
    borderRadius: 20,
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: config.theme.extend.colors.primary,
    borderRadius: 20,
  },
  cardContent: {
    flex: 1,
    padding: 24,
    justifyContent: 'flex-end',
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  cardTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  cardSubtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  dotsContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: 16,
    gap: 4,
  },
  dotTouchable: {
    padding: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 99,
  },
  // blurOverlay: {
  //   position: 'absolute',
  //   top: 0,
  //   left: 0,
  //   right: 0,
  //   height: 20,
  //   borderTopLeftRadius: 99,
  //   borderTopRightRadius: 99,
  //   zIndex: 1,
  //   opacity: 0,
  // },
}); 
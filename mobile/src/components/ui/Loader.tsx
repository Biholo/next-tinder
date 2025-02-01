import { useEffect, useRef } from "react"
import { View, Animated, Easing, StyleSheet } from "react-native"

interface LoaderProps {
  size?: number
  color?: string
}

export function Loader({ size = 50, color = "#FF4458" }: LoaderProps) {
  const spinValue = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start()
  }, [spinValue])

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  })

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.loader,
          {
            width: size,
            height: size,
            borderColor: color,
            borderWidth: size / 10,
            borderRadius: size / 2,
            transform: [{ rotate: spin }],
          },
        ]}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loader: {
    borderTopColor: "transparent",
    borderRightColor: "transparent",
  },
})


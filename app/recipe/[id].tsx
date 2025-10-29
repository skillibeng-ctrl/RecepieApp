import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  useColorScheme,
  Switch,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { supabase } from "../../lib/supabase";
import { ThemedText } from "../../components/themed-text";
import { ThemedView } from "../../components/themed-view";
import { useThemeColor } from "../../hooks/use-theme-color";
import { Video } from "expo-av";
import { WebView } from "react-native-webview";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

export default function RecipeDetail() {
  const { id } = useLocalSearchParams();
  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);

  const systemTheme = useColorScheme();
  
  // Use custom dark mode or fall back to system theme
  const darkMode = isDark !== null ? isDark : systemTheme === "dark";
  
  // Get theme colors from your hook instead of hardcoding
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const tintColor = useThemeColor({}, "tint");
  const cardColor = useThemeColor({}, "card");

  // Custom colors for dark/light mode that work with your theming system
  const customBackground = darkMode ? "#0b0b0f" : "#fff8f0";
  const customTextColor = darkMode ? "#f5f5f5" : "#333";
  const customAccentColor = darkMode ? "#ff9f43" : "#ff7043";
  const customCardColor = darkMode ? "rgba(40,40,45,0.9)" : "rgba(255,255,255,0.9)";

  useEffect(() => {
    const fetchRecipe = async () => {
      const { data, error } = await supabase
        .from("receipes")
        .select("*")
        .eq("id", id)
        .single();

      if (error) console.error(error);
      else setRecipe(data);
      setLoading(false);
    };

    if (id) fetchRecipe();
  }, [id]);

  // Initialize dark mode based on system preference
  useEffect(() => {
    if (systemTheme) {
      setIsDark(systemTheme === "dark");
    }
  }, [systemTheme]);

  if (loading) {
    return (
      <View style={[styles.loader, { backgroundColor: customBackground }]}>
        <ActivityIndicator size="large" color={customAccentColor} />
      </View>
    );
  }

  if (!recipe) {
    return (
      <View style={[styles.loader, { backgroundColor: customBackground }]}>
        <ThemedText>No recipe found.</ThemedText>
      </View>
    );
  }

  const formattedInstructions = recipe.instructions
    ? recipe.instructions
        .split(/\r?\n|(?<=\.)\s+/)
        .map((line: string, index: number) => (
          <ThemedText key={index} style={[styles.text, { color: customTextColor }]}>
            {line.trim()}
          </ThemedText>
        ))
    : null;

  return (
    <LinearGradient
      colors={
        darkMode
          ? ["#0b0b0f", "#1a1a1f", "#1f1f26"]
          : ["#fff8f0", "#ffe9e3", "#fff5f9"]
      }
      style={styles.gradientContainer}
    >
      {/* 🌙 Dark Mode Toggle */}
      <View style={[styles.toggleContainer, { backgroundColor: darkMode ? 'rgba(40,40,45,0.8)' : 'rgba(255,255,255,0.8)' }]}>
        <ThemedText style={{ color: customTextColor, fontSize: 16, fontWeight: '600' }}>
          {darkMode ? "🌙 Dark Mode" : "☀️ Light Mode"}
        </ThemedText>
        <Switch
          value={isDark}
          onValueChange={setIsDark}
          thumbColor={darkMode ? customAccentColor : "#fff"}
          trackColor={{ false: "#ffbda0", true: customAccentColor }}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Recipe Image */}
        <View style={styles.imageWrapper}>
          <Image source={{ uri: recipe.image_url }} style={styles.image} />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.8)"]}
            style={styles.overlay}
          >
            <ThemedText style={styles.overlayText}>{recipe.title}</ThemedText>
            <View style={styles.recipeMeta}>
              {recipe.category && (
                <View style={[styles.categoryTag, { backgroundColor: customAccentColor }]}>
                  <ThemedText style={styles.categoryText}>{recipe.category}</ThemedText>
                </View>
              )}
              {recipe.cooking_time && (
                <View style={[styles.timeTag, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                  <ThemedText style={styles.timeText}>⏱️ {recipe.cooking_time}</ThemedText>
                </View>
              )}
            </View>
          </LinearGradient>
        </View>

        {/* Video Section */}
        {recipe.video_url ? (
          <View style={styles.videoContainer}>
            {recipe.video_url.includes("youtube.com") ||
            recipe.video_url.includes("youtu.be") ? (
              <WebView
                style={styles.webview}
                source={{
                  uri: recipe.video_url.replace("watch?v=", "embed/"),
                }}
                allowsFullscreenVideo
              />
            ) : (
              <Video
                source={{ uri: recipe.video_url }}
                style={styles.video}
                useNativeControls
                resizeMode="contain"
              />
            )}
          </View>
        ) : null}

        {/* Info Card */}
        <View
          style={[
            styles.infoCard,
            {
              backgroundColor: customCardColor,
              borderColor: darkMode ? "#3a3a3f" : "#ffd4b2",
            },
          ]}
        >
          <ThemedText
            style={[styles.title, { color: customTextColor }]}
          >
            {recipe.title}
          </ThemedText>

          <View
            style={[styles.divider, { backgroundColor: customAccentColor }]}
          />

          {/* Ingredients Section */}
          <View style={styles.section}>
            <ThemedText
              style={[styles.sectionTitle, { color: customAccentColor }]}
            >
              🥦 Ingredients
            </ThemedText>
            <View style={[styles.ingredientsContainer, { 
              backgroundColor: darkMode ? "#222229" : "#fffaf2",
              borderColor: darkMode ? "#3a3a3f" : "#ffd4b2",
            }]}>
              <ThemedText style={[styles.text, { color: customTextColor }]}>
                {recipe.ingredients}
              </ThemedText>
            </View>
          </View>

          {/* Instructions Section */}
          <View style={styles.section}>
            <ThemedText
              style={[styles.sectionTitle, { color: customAccentColor }]}
            >
              👩‍🍳 Instructions
            </ThemedText>
            <View
              style={[
                styles.instructionsContainer,
                {
                  backgroundColor: darkMode ? "#222229" : "#fffaf2",
                  borderColor: darkMode ? "#3a3a3f" : "#ffd4b2",
                },
              ]}
            >
              {formattedInstructions}
            </View>
          </View>

          {/* Additional Info */}
          {(recipe.category || recipe.cooking_time || recipe.difficulty) && (
            <View style={styles.section}>
              <ThemedText
                style={[styles.sectionTitle, { color: customAccentColor }]}
              >
                ℹ️ Recipe Info
              </ThemedText>
              <View style={[styles.infoGrid, {
                backgroundColor: darkMode ? "#222229" : "#fffaf2",
                borderColor: darkMode ? "#3a3a3f" : "#ffd4b2",
              }]}>
                {recipe.category && (
                  <View style={styles.infoItem}>
                    <ThemedText style={[styles.infoLabel, { color: customTextColor }]}>Category</ThemedText>
                    <ThemedText style={[styles.infoValue, { color: customAccentColor }]}>{recipe.category}</ThemedText>
                  </View>
                )}
                {recipe.cooking_time && (
                  <View style={styles.infoItem}>
                    <ThemedText style={[styles.infoLabel, { color: customTextColor }]}>Cook Time</ThemedText>
                    <ThemedText style={[styles.infoValue, { color: customAccentColor }]}>{recipe.cooking_time}</ThemedText>
                  </View>
                )}
                {recipe.difficulty && (
                  <View style={styles.infoItem}>
                    <ThemedText style={[styles.infoLabel, { color: customTextColor }]}>Difficulty</ThemedText>
                    <ThemedText style={[styles.infoValue, { color: customAccentColor }]}>{recipe.difficulty}</ThemedText>
                  </View>
                )}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientContainer: { 
    flex: 1 
  },
  scrollView: {
    flex: 1,
  },
  loader: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center" 
  },
  imageWrapper: { 
    position: "relative", 
    width, 
    height: 320 
  },
  image: {
    width: "100%",
    height: "100%",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 140,
    justifyContent: "flex-end",
    padding: 20,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  overlayText: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
    marginBottom: 8,
  },
  recipeMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  categoryTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  categoryText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  timeTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  timeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
  videoContainer: {
    margin: 20,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 4,
  },
  webview: { 
    width: "100%", 
    height: 230 
  },
  video: { 
    width: "100%", 
    height: 230 
  },
  infoCard: {
    marginHorizontal: 20,
    marginBottom: 40,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 4,
  },
  title: { 
    fontSize: 26, 
    fontWeight: "700", 
    textAlign: "center",
    marginBottom: 10,
  },
  divider: {
    height: 2,
    marginVertical: 14,
    marginHorizontal: 40,
    borderRadius: 2,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
  },
  text: { 
    fontSize: 16, 
    lineHeight: 26 
  },
  ingredientsContainer: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  instructionsContainer: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  infoGrid: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  infoItem: {
    width: '48%',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: 12,
    paddingRight: 20,
    gap: 10,
    borderRadius: 20,
    margin: 10,
    marginTop: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
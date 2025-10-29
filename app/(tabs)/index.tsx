import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  View,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { supabase } from "../../lib/supabase";
import { ThemedText } from "../../components/themed-text";
import { ThemedView } from "../../components/themed-view";
import { useThemeColor } from "../../hooks/use-theme-color";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2; // two columns layout

export default function HomeScreen() {
  const router = useRouter();
  const [recipes, setRecipes] = useState<any[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState<string[]>([
    "All",
    "African",
    "Intercontinental",
    "Seafood",
    "Vegetarian",
    "Dessert",
  ]);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const fadeAnim = new Animated.Value(1);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const tintColor = useThemeColor({}, "tint");

  const featuredImages = [
    "https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg",
    "https://www.themealdb.com/images/media/meals/ustsqw1468250014.jpg",
    "https://www.themealdb.com/images/media/meals/xvsurr1511719182.jpg",
  ];

  // Fetch recipes
  useEffect(() => {
    fetchRecipes();
  }, []);

  async function fetchRecipes() {
    setLoading(true);
    const { data, error } = await supabase
      .from("receipes")
      .select("*")
      .order("id", { ascending: true });

    if (error) console.error("❌ Supabase Error:", error);
    else {
      setRecipes(data || []);
      setFilteredRecipes(data || []);

      const uniqueCategories = Array.from(
        new Set(data?.map((r: any) => r.category).filter(Boolean))
      );
      const allCategories = Array.from(
        new Set(["All", "Seafood", "Vegetarian", "Dessert", ...uniqueCategories])
      );
      setCategories(allCategories);
    }

    setLoading(false);
  }

  // Auto-change featured image every 12s
  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }).start(() => {
        setFeaturedIndex((prev) => (prev + 1) % featuredImages.length);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }).start();
      });
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  // Handle search + category filter with debounce
  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      let filtered = recipes;

      if (selectedCategory !== "All") {
        filtered = filtered.filter(recipe => recipe.category === selectedCategory);
      }

      if (search) {
        filtered = filtered.filter(recipe =>
          recipe.title.toLowerCase().includes(search.toLowerCase())
        );
      }

      setFilteredRecipes(filtered);
    }, 300);

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [search, selectedCategory, recipes]);

  const styles = StyleSheet.create({
    container: { 
      flex: 1, 
      backgroundColor, 
      paddingHorizontal: 20,
    },
    header: {
      marginBottom: 8,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingTop: 60,
      paddingBottom: 12,
    },
    title: {
      fontSize: 34,
      fontWeight: "800",
      color: textColor,
      letterSpacing: -0.5,
      textShadowColor: 'rgba(0, 0, 0, 0.1)',
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 4,
    },
    subtitle: { 
      fontSize: 16, 
      color: textColor, 
      marginTop: 2,
      opacity: 0.7,
      lineHeight: 22,
      fontWeight: '400',
    },
    featuredContainer: {
      borderRadius: 24,
      overflow: "hidden",
      marginVertical: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.2,
      shadowRadius: 20,
      elevation: 10,
      backgroundColor: '#000',
    },
    featuredImage: {
      width: "100%",
      height: 220,
    },
    overlay: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: "rgba(0,0,0,0.6)",
      paddingVertical: 18,
      paddingHorizontal: 20,
    },
    overlayText: { 
      color: "#fff", 
      fontSize: 18, 
      fontWeight: "700",
      textAlign: "center",
      letterSpacing: 0.5,
      textShadowColor: 'rgba(0, 0, 0, 0.5)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 3,
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: backgroundColor === "#fff" ? "#f8f9fa" : "#1a1a1a",
      borderRadius: 25,
      paddingHorizontal: 20,
      marginVertical: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 5,
      borderWidth: 1,
      borderColor: backgroundColor === "#fff" ? "#e9ecef" : "#2a2a2a",
    },
    searchInput: { 
      flex: 1, 
      paddingVertical: 14, 
      color: textColor,
      fontSize: 16,
      marginLeft: 12,
      fontWeight: '500',
      letterSpacing: 0.3,
    },
    categoriesContainer: { 
      marginVertical: 8,
    },
    categoryButton: {
      paddingHorizontal: 22,
      paddingVertical: 12,
      marginRight: 10,
      borderRadius: 25,
      backgroundColor: backgroundColor === "#fff" ? "#f8f9fa" : "#1a1a1a",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 3,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    selectedCategory: { 
      backgroundColor: tintColor,
      shadowColor: tintColor,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 6,
      transform: [{ scale: 1.05 }],
    },
    categoryText: { 
      fontSize: 14, 
      fontWeight: "600",
      color: textColor,
      opacity: 0.8,
      letterSpacing: 0.3,
    },
    selectedCategoryText: { 
      color: "#fff",
      fontWeight: "700",
      opacity: 1,
    },
    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      paddingTop: 8,
      paddingBottom: 30,
    },
    card: {
      width: CARD_WIDTH,
      backgroundColor: backgroundColor === "#fff" ? "#ffffff" : "#1a1a1a",
      borderRadius: 20,
      marginBottom: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 15,
      elevation: 6,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: backgroundColor === "#fff" ? "#f0f0f0" : "#2a2a2a",
      transform: [{ scale: 1 }],
    },
    cardImage: {
      width: "100%",
      height: 140,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },
    cardTitle: {
      fontSize: 14,
      fontWeight: "700",
      marginVertical: 14,
      textAlign: "center",
      color: textColor,
      paddingHorizontal: 8,
      lineHeight: 18,
      letterSpacing: 0.2,
    },
    loadingContainer: {
      paddingVertical: 60,
      alignItems: 'center',
    },
    settingsButton: {
      padding: 12,
      backgroundColor: backgroundColor === "#fff" ? "#f8f9fa" : "#1a1a1a",
      borderRadius: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
      borderWidth: 1,
      borderColor: backgroundColor === "#fff" ? "#e9ecef" : "#2a2a2a",
    },
    featuredDots: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 12,
      marginBottom: 8,
    },
    dot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: 'rgba(0,0,0,0.2)',
      marginHorizontal: 4,
    },
    activeDot: {
      backgroundColor: tintColor,
      width: 20,
    },
    recipeCount: {
      fontSize: 16,
      fontWeight: '600',
      color: tintColor,
      marginLeft: 8,
      opacity: 0.8,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 24,
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 22,
      fontWeight: '800',
      color: textColor,
      letterSpacing: -0.3,
    },
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <ThemedText style={styles.title}>Food Recipes</ThemedText>
          <ThemedText style={styles.subtitle}>
            Discover the best recipes from around the world 🍳
          </ThemedText>
        </View>
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={22} color={textColor} />
        </TouchableOpacity>
      </View>

      {/* Featured Image */}
      <Animated.View style={[{ opacity: fadeAnim }, styles.featuredContainer]}>
        <View>
          <Image
            source={{ uri: featuredImages[featuredIndex] }}
            style={styles.featuredImage}
          />
          <View style={styles.overlay}>
            <ThemedText style={styles.overlayText}>🌟 Featured Recipe</ThemedText>
          </View>
        </View>
      </Animated.View>

      {/* Featured Image Dots */}
      <View style={styles.featuredDots}>
        {featuredImages.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === featuredIndex && styles.activeDot,
            ]}
          />
        ))}
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color={textColor}
          style={{ opacity: 0.7 }}
        />
        <TextInput
          placeholder="Search recipes..."
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholderTextColor={textColor}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={20} color={textColor} style={{ opacity: 0.7 }} />
          </TouchableOpacity>
        )}
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryButton,
                selectedCategory === cat && styles.selectedCategory,
              ]}
              onPress={() => setSelectedCategory(cat)}
            >
              <ThemedText
                style={[
                  styles.categoryText,
                  selectedCategory === cat && styles.selectedCategoryText,
                ]}
              >
                {cat}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <ThemedText style={styles.sectionTitle}>
          {selectedCategory === 'All' ? 'All Recipes' : selectedCategory}
        </ThemedText>
        <ThemedText style={styles.recipeCount}>
          {filteredRecipes.length} recipes
        </ThemedText>
      </View>

      {/* Recipes Grid */}
      <View>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={tintColor} />
          </View>
        ) : (
          <View style={styles.grid}>
            {filteredRecipes.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.card}
                onPress={() => router.push(`/recipe/${item.id}` as any)}
                activeOpacity={0.9}
              >
                <Image source={{ uri: item.image_url }} style={styles.cardImage} />
                <ThemedText style={styles.cardTitle} numberOfLines={2}>
                  {item.title}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
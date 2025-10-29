import React from "react";
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  ImageSourcePropType 
} from "react-native";

// Type definitions
interface Recipe {
  id: number;
  name: string;
  image: string;
}

interface UserData {
  name: string;
  email: string;
  joinDate: string;
  favoriteCuisine: string;
  bio: string;
  avatar: string;
}

export default function ProfileScreen(): JSX.Element {
  // Mock data with proper typing
  const userData: UserData = {
    name: "Mary Smith",
    email: "marysmith@example.com",
    joinDate: "Jan 2020",
    favoriteCuisine: "Italian",
    bio: "Loves baking pastries and exploring Italian cuisine",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
  };

  const myRecipes: Recipe[] = [
    { 
      id: 1, 
      name: "Lemon Tart", 
      image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=150&h=150&fit=crop" 
    },
    { 
      id: 2, 
      name: "Spaghetti Bolognese", 
      image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=150&h=150&fit=crop" 
    },
    { 
      id: 3, 
      name: "Blueberry Pancakes", 
      image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=150&h=150&fit=crop" 
    },
  ];

  const savedRecipes: Recipe[] = [
    { 
      id: 1, 
      name: "Fruit Salad", 
      image: "https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=120&h=120&fit=crop" 
    },
    { 
      id: 2, 
      name: "Vegetable Salad", 
      image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=120&h=120&fit=crop" 
    },
  ];

  // Handler functions
  const handleRecipePress = (recipeId: number): void => {
    console.log(`Recipe pressed: ${recipeId}`);
    // Navigation logic would go here
  };

  const handleSeeAllPress = (section: string): void => {
    console.log(`See all pressed for: ${section}`);
    // Navigation logic would go here
  };

  const handleNavPress = (navItem: string): void => {
    console.log(`Navigation pressed: ${navItem}`);
    // Navigation logic would go here
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>Recipe</Text>
        <View style={styles.nav}>
          <TouchableOpacity onPress={() => handleNavPress("Recipes")}>
            <Text style={styles.navItem}>Recipes</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleNavPress("Add Recipe")}>
            <Text style={styles.navItem}>Add Recipe</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleNavPress("Profile")}>
            <View style={styles.profileIcon} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image
          source={{ uri: userData.avatar }}
          style={styles.avatar}
          accessibilityLabel="Profile picture"
        />
        <View style={styles.profileText}>
          <Text style={styles.name}>{userData.name}</Text>
          <Text style={styles.bio}>{userData.bio}</Text>
        </View>
      </View>

      {/* User Info */}
      <View style={styles.userInfo}>
        <View style={styles.infoItem}>
          <Text style={styles.infoIcon}>📧</Text>
          <Text style={styles.infoText}>{userData.email}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoIcon}>📅</Text>
          <Text style={styles.infoText}>Member since {userData.joinDate}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoIcon}>🍝</Text>
          <Text style={styles.infoText}>Favorite cuisine: {userData.favoriteCuisine}</Text>
        </View>
      </View>

      {/* My Recipes */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Recipes</Text>
          <TouchableOpacity onPress={() => handleSeeAllPress("My Recipes")}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalScroll}
        >
          {myRecipes.map((recipe: Recipe) => (
            <TouchableOpacity 
              key={recipe.id} 
              style={styles.card}
              onPress={() => handleRecipePress(recipe.id)}
            >
              <Image 
                source={{ uri: recipe.image }} 
                style={styles.cardImage} 
                accessibilityLabel={recipe.name}
              />
              <Text style={styles.cardTitle}>{recipe.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Saved Recipes */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Saved Recipes</Text>
          <TouchableOpacity onPress={() => handleSeeAllPress("Saved Recipes")}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.savedRecipesGrid}>
          {savedRecipes.map((recipe: Recipe) => (
            <TouchableOpacity 
              key={recipe.id} 
              style={styles.smallCard}
              onPress={() => handleRecipePress(recipe.id)}
            >
              <Image 
                source={{ uri: recipe.image }} 
                style={styles.smallImg} 
                accessibilityLabel={recipe.name}
              />
              <Text style={styles.cardTitle}>{recipe.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDF3E6",
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#E97C47",
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  logo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  nav: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  navItem: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  profileIcon: {
    width: 32,
    height: 32,
    backgroundColor: "#fff",
    borderRadius: 16,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 32,
    paddingHorizontal: 8,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: "#E97C47",
  },
  profileText: {
    marginLeft: 20,
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
    color: "#3E2F24",
  },
  bio: {
    fontSize: 15,
    color: "#705B4E",
    marginTop: 6,
    lineHeight: 20,
  },
  userInfo: {
    marginTop: 24,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  infoIcon: {
    fontSize: 16,
    marginRight: 12,
    width: 24,
  },
  infoText: {
    fontSize: 15,
    color: "#4B3B32",
    fontWeight: "500",
  },
  section: {
    marginTop: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#3E2F24",
  },
  seeAllText: {
    fontSize: 14,
    color: "#E97C47",
    fontWeight: "600",
  },
  horizontalScroll: {
    paddingVertical: 4,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    marginRight: 16,
    width: 160,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardImage: {
    width: "100%",
    height: 110,
    borderRadius: 12,
  },
  cardTitle: {
    marginTop: 8,
    fontWeight: "600",
    textAlign: "center",
    color: "#3E2F24",
    fontSize: 14,
  },
  savedRecipesGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  smallCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    width: "48%",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  smallImg: {
    width: "100%",
    height: 90,
    borderRadius: 10,
  },
});
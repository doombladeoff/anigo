import { FlatList } from "react-native-gesture-handler";
import { useHeaderHeight } from "@react-navigation/elements";
import { ThemedView } from "@/components/ThemedView";
import { useSearchStore } from "@/store/searchStore";
import { genresMap } from "@/constants/Genres";
import { GenreItem } from "@/components/Filters/GenreItem";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function GenreScreen() {
  const headerHeight = useHeaderHeight();
  const iconColor = useThemeColor({ dark: 'white', light: 'black' }, 'icon');
  const { genre, setGenre } = useSearchStore();

  const toggleGenre = (id: string) => {
    if (!genre) return;
    const next = new Set(genre);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setGenre?.(Array.from(next));
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <FlatList
        data={Object.entries(genresMap)}
        contentContainerStyle={{ paddingTop: headerHeight + 10, paddingBottom: headerHeight * 2 }}
        keyExtractor={([id]) => id}
        renderItem={({ item: [id, name] }) => (
          <GenreItem
            id={id}
            name={name}
            selected={genre.includes(id)}
            onToggle={toggleGenre}
            iconColor={iconColor}
          />
        )}
        extraData={genre}
      />
    </ThemedView>
  );
}

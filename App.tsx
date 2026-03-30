import './global.css';

import { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as Haptics from 'expo-haptics';
import { supabase } from './lib/supabase';

type CardMetadata = {
  id: string;
  title: string;
  archetype: string;
  key_concepts: string;
};

export default function App() {
  const [cards, setCards] = useState<CardMetadata[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCards() {
      try {
        const { data, error } = await supabase
          .from('cards_metadata')
          .select('*')
          .order('created_at', { ascending: true });

        if (error) throw error;
        setCards(data || []);
      } catch (err) {
        console.error('Error fetching cards:', err);
      } finally {
        setLoading(false);
      }
    }

    loadCards();
  }, []);

  const handleCardPress = (card: CardMetadata) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    console.log('Selected:', card.title);
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-zen-dark">
        <ActivityIndicator size="large" color="#D4AF37" />
        <Text className="text-zen-cream mt-4 font-serif text-lg">Inhalando...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-zen-dark px-4 pt-16 pb-8">
      <Text className="text-zen-gold text-4xl font-serif text-center mb-2">Zen Tarot</Text>
      <Text className="text-zen-cream opacity-80 text-center mb-8 font-light italic">
        Selecciona una carta para tu reflexión de hoy.
      </Text>

      <FlatList
        data={cards}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 16 }}
        contentContainerStyle={{ paddingHorizontal: 8 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleCardPress(item)}
            activeOpacity={0.8}
            className="bg-zinc-900 border border-zen-gold/30 rounded-xl p-4 flex-1 mx-2 aspect-[2/3] items-center justify-center shadow-lg shadow-black"
          >
            <View className="w-12 h-12 rounded-full border border-zen-gold/50 items-center justify-center mb-4">
              <Text className="text-zen-gold text-lg">❖</Text>
            </View>
            <Text className="text-zen-cream font-serif text-xl font-medium text-center mb-1">
              {item.title}
            </Text>
            <Text className="text-zen-gold/80 text-xs text-center uppercase tracking-widest">
              {item.archetype}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

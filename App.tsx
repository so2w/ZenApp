import './global.css';

import { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Modal, ScrollView, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
import { supabase } from './lib/supabase';

type CardMetadata = {
  id: string;
  title: string;
  archetype: string;
  key_concepts: string;
};

// Utilidad para barajar aleatoriamente el mazo usando algoritmo de Fisher-Yates
function shuffleCards(array: CardMetadata[]) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function App() {
  const [cards, setCards] = useState<CardMetadata[]>([]);
  const [loading, setLoading] = useState(true);

  // Estado del Oráculo
  const [selectedCard, setSelectedCard] = useState<CardMetadata | null>(null);
  const [reflection, setReflection] = useState<string>('');
  const [isOracleThinking, setIsOracleThinking] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    async function loadCards() {
      try {
        const { data, error } = await supabase
          .from('cards_metadata')
          .select('*');

        if (error) throw error;
        
        // Barajado inicial aleatorio
        setCards(shuffleCards(data || []));
      } catch (err) {
        console.error('Error fetching cards:', err);
      } finally {
        setLoading(false);
      }
    }

    loadCards();
  }, []);

  const handleCardPress = async (card: CardMetadata) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setSelectedCard(card);
    setReflection('');
    setIsOracleThinking(true);
    setModalVisible(true);

    try {
      // Invocación a la Edge Function de Supabase (IA)
      const { data, error } = await supabase.functions.invoke('zen-oracle', {
        body: {
          cardName: card.title,
          archetype: card.archetype,
          concepts: card.key_concepts
        }
      });

      if (error) throw error;
      setReflection(data.text);
    } catch (err) {
      console.error('Oracle Error:', err);
      setReflection('El camino está nublado en este momento. La mente necesita calma. Intenta de nuevo más tarde.');
    } finally {
      setIsOracleThinking(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const closeOracle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setModalVisible(false);
    setTimeout(() => {
      setSelectedCard(null);
      setReflection('');
      setCards(shuffleCards(cards)); // Volver a barajar en cada nueva consulta
    }, 300);
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-zen-dark">
        <ActivityIndicator size="large" color="#D4AF37" />
        <Text className="text-zen-cream mt-4 font-serif text-lg tracking-widest">Inhalando...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-zen-dark pt-16 pb-8">
      <Text className="text-zen-gold text-4xl font-serif text-center mb-2">Zen Tarot</Text>
      <Text className="text-zen-cream opacity-80 text-center mb-8 font-light italic px-4 px-6 text-sm">
        Concéntrate en tu respiración. Selecciona una carta cuando sientas el impulso.
      </Text>

      <FlatList
        data={cards}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 16 }}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleCardPress(item)}
            activeOpacity={0.8}
            className="bg-black border border-zen-gold/40 rounded-xl p-4 flex-1 mx-2 aspect-[2/3] items-center justify-center shadow-lg hover:bg-zinc-900 transition-colors"
          >
            <View className="w-14 h-14 rounded-full border border-zen-gold/60 items-center justify-center mb-4">
              <Text className="text-zen-gold text-xl">❖</Text>
            </View>
            <Text className="text-zen-cream font-serif text-lg font-medium text-center mb-1">
              ?
            </Text>
            <Text className="text-zen-gold/60 text-[10px] text-center uppercase tracking-widest mt-2">
              Descubrir
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Modal de Reflexión (El Oráculo) */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeOracle}
      >
        <View className="flex-1 bg-zen-dark/95 justify-center items-center px-4 py-12">
          {selectedCard && (
            <View className="bg-black/80 w-full max-w-sm rounded-2xl border border-zen-gold p-6 items-center shadow-2xl">
              
              <Text className="text-zen-gold/80 uppercase tracking-[0.3em] text-xs mb-2">
                {selectedCard.archetype}
              </Text>
              
              <Text className="text-zen-cream text-3xl font-serif mb-6 text-center">
                {selectedCard.title}
              </Text>

              <View className="w-full h-[1px] bg-zen-gold/30 mb-6" />

              <ScrollView className="max-h-64 w-full" showsVerticalScrollIndicator={false}>
                {isOracleThinking ? (
                  <View className="py-8 items-center justify-center">
                    <ActivityIndicator size="large" color="#F5F5DC" />
                    <Text className="text-zen-cream/70 mt-4 font-serif italic text-center">
                      El oráculo está observando el vacío...
                    </Text>
                  </View>
                ) : (
                  <Text className="text-zen-cream text-lg font-serif text-center leading-relaxed">
                    {reflection}
                  </Text>
                )}
              </ScrollView>

              {!isOracleThinking && (
                <TouchableOpacity
                  onPress={closeOracle}
                  className="mt-8 border border-zen-gold/60 py-3 px-8 rounded-full active:bg-zen-gold/20"
                >
                  <Text className="text-zen-gold uppercase tracking-widest text-sm">
                    Agradecer y Volver
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}

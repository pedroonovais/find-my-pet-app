import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Pressable,
  ImageBackground,
  SafeAreaView,
  Image,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function AdocaoScreen() {
  const navigation = useNavigation();

  const [modalVisible, setModalVisible] = useState(false);
  const [animalSelecionado, setAnimalSelecionado] = useState(null);

  const animais = [
    { nome: 'Nina', idade: '2 anos', raca: 'Vira-lata', local: 'Abrigo Esperança', tipo: 'cachorro', foto: 'https://placedog.net/400/300?id=1' },
    { nome: 'Thor', idade: '1 ano', raca: 'Poodle', local: 'Lar dos Peludos', tipo: 'cachorro', foto: 'https://placedog.net/400/300?id=2' },
    { nome: 'Lola', idade: '3 anos', raca: 'Beagle', local: 'Cãotinho Feliz', tipo: 'cachorro', foto: 'https://placedog.net/400/300?id=3' },
    { nome: 'Max', idade: '4 anos', raca: 'Labrador', local: 'Amor Animal', tipo: 'cachorro', foto: 'https://placedog.net/400/300?id=4' },
    { nome: 'Bela', idade: '6 meses', raca: 'SRD', local: 'Patinhas do Bem', tipo: 'cachorro', foto: 'https://placedog.net/400/300?id=5' },

    { nome: 'Malu', idade: '1 ano', raca: 'Siamês', local: 'Gato Feliz', tipo: 'gato', foto: 'https://cdn2.thecatapi.com/images/MTY3ODIyMQ.jpg' },
    { nome: 'Luna', idade: '3 anos', raca: 'Persa', local: 'Abrigo dos Felinos', tipo: 'gato', foto: 'https://cdn2.thecatapi.com/images/MTY3ODIyMQ.jpg' },
    { nome: 'mel', idade: '4 anos', raca: 'SRD', local: 'Lar dos Gatinhos', tipo: 'gato', foto: 'https://cdn2.thecatapi.com/images/MTY3ODIyMQ.jpg' },
  ];

  const abrirDetalhes = (animal) => {
    setAnimalSelecionado(animal);
    setModalVisible(true);
  };

  const fecharDetalhes = () => {
    setModalVisible(false);
    setAnimalSelecionado(null);
  };

  const solicitarAdocao = () => {
    alert('Solicitação enviada com sucesso.');
    fecharDetalhes();
  };

  const renderIconeAnimal = (tipo) => {
    if (tipo === 'cachorro') {
      return <MaterialCommunityIcons name="dog" size={24} color="#0E6BA8" style={{ marginRight: 6 }} />;
    } else if (tipo === 'gato') {
      return <MaterialCommunityIcons name="cat" size={24} color="#D15FEE" style={{ marginRight: 6 }} />;
    }
    return null;
  };

  return (
    <ImageBackground
      source={require('../../../assets/image.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
            <Text style={styles.backText}>Voltar</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Adoção de Animais</Text>
        </View>

        <Text style={styles.subtitle}>Encontre um novo companheiro para sua família</Text>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {animais.map((animal, index) => (
            <TouchableOpacity
              key={index}
              style={styles.card}
              onPress={() => abrirDetalhes(animal)}
              activeOpacity={0.8}
            >
              <Image source={{ uri: animal.foto }} style={styles.animalImage} resizeMode="cover" />
              <View style={styles.cardContent}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {renderIconeAnimal(animal.tipo)}
                  <Text style={styles.animalName}>{animal.nome}</Text>
                </View>
                <Text style={styles.animalInfo}>Raça: {animal.raca}</Text>
                <Text style={styles.animalInfo}>Idade: {animal.idade}</Text>
                <Text style={styles.animalInfo}>Local: {animal.local}</Text>
                <View style={styles.buttonWrapper}>
                  <Text style={styles.viewDetails}>Visualizar</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Modal
          transparent
          visible={modalVisible}
          animationType="slide"
          onRequestClose={fecharDetalhes}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>{animalSelecionado?.nome}</Text>
              <Image source={{ uri: animalSelecionado?.foto }} style={styles.modalImage} resizeMode="cover" />
              <View style={styles.modalLine} />
              <Text style={styles.modalInfo}>Local: {animalSelecionado?.local}</Text>
              <Text style={styles.modalInfo}>Idade: {animalSelecionado?.idade}</Text>
              <Text style={styles.modalInfo}>Raça: {animalSelecionado?.raca}</Text>
              <Text style={[styles.modalInfo, { fontStyle: 'italic', marginBottom: 8 }]}>
                {animalSelecionado?.tipo === 'gato'
                  ? 'Um gato carinhoso e independente.'
                  : 'Um cão leal e amigo para todas as horas.'}
              </Text>
              <Text style={styles.modalInfo}>
                Entre em contato com o abrigo para iniciar a adoção.
              </Text>
              <Text style={[styles.modalInfo, { fontWeight: 'bold' }]}>
                Contato: (99) 99999-8888
              </Text>

              <Pressable style={styles.primaryButton} onPress={solicitarAdocao}>
                <Text style={styles.primaryButtonText}>Solicitar Adoção</Text>
              </Pressable>

              <Pressable style={styles.secondaryButton} onPress={fecharDetalhes}>
                <Text style={styles.secondaryButtonText}>Fechar</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 40,
    marginBottom: 10,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 10,
  },
  backText: {
    color: '#fff',
    marginLeft: 6,
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    flex: 1,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    color: '#fff',
    marginLeft: -20,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#ddd',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  scroll: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffffee',
    borderRadius: 16,
    padding: 10,
    marginBottom: 16, 
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 6,
  },
  animalImage: {
    width: 110,
    height: 100,
    borderRadius: 16,
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  animalName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0E2F44',
    marginBottom: 6,
  },
  animalInfo: {
    fontSize: 14,
    color: '#4B6584',
    marginBottom: 4,
  },
  buttonWrapper: {
    marginTop: 8,
    backgroundColor: '#0E6BA8',
    paddingVertical: 6,
    borderRadius: 12,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  viewDetails: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
    paddingHorizontal: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0E2F44',
    marginBottom: 12,
  },
  modalImage: {
    width: 260,
    height: 180,
    borderRadius: 18,
    marginBottom: 16,
  },
  modalLine: {
    height: 1,
    backgroundColor: '#0E6BA8',
    width: '70%',
    marginVertical: 8,
  },
  modalInfo: {
    fontSize: 14,
    color: '#4B6584',
    marginBottom: 6,
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: '#0E6BA8',
    paddingVertical: 14,
    borderRadius: 24,
    marginTop: 18,
    width: '100%',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    textAlign: 'center',
  },
  secondaryButton: {
    paddingVertical: 14,
    borderRadius: 24,
    marginTop: 12,
    borderColor: '#0E6BA8',
    borderWidth: 2,
    width: '100%',
  },
  secondaryButtonText: {
    color: '#0E6BA8',
    fontWeight: '700',
    fontSize: 16,
    textAlign: 'center',
  },
});

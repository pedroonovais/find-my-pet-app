import React, { useState } from 'react';
import {
  Image,
  ImageBackground,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function WelcomeScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <ImageBackground
      source={require('../../../assets/image.png')}
      style={styles.background}
      imageStyle={{ opacity: 0.40 }}
    >
      <View style={styles.overlay}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text style={styles.aboutButton}>Sobre nós</Text>
          </TouchableOpacity>
        </View>

        <Image source={require('../../../assets/logo.png')} style={styles.logo} />

        <Text style={styles.title}>Seja bem-vindo à FindMyPet!</Text>
        <Text style={styles.subtitle}>Faça login para continuar!</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Login')}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Sobre o projeto</Text>
              <Text style={styles.modalText}>
                O FindMyPet é um projeto que conecta pessoas na missão de encontrar, resgatar e adotar animais perdidos.
                Nosso objetivo é criar uma rede de ajuda rápida e eficaz para garantir o bem-estar dos animais.
              </Text>
              <Pressable style={styles.modalCloseButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalCloseText}>Fechar</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 30,
    paddingTop: 60,
  },
  header: {
    position: 'absolute',
    top: 50,
    right: 30,
    zIndex: 10,
  },
  aboutButton: {
    fontSize: 16,
    color: '#3498db',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  logo: {
    width: 300,
    height: 350,
    marginTop: -30,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 32,
    color: '#5a4e9c',
    fontWeight: '700',
    marginTop: 30,
    marginBottom: 50,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 20,
    color: '#4b3ca7',
    fontWeight: '500',
    marginBottom: 50,
    textAlign: 'center',
    fontStyle: 'italic',
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#7a64d9',
    paddingVertical: 15,
    paddingHorizontal: 75,
    borderRadius: 30,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#f0f0f0',
    fontSize: 20,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#5a4e9c',
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  modalCloseButton: {
    backgroundColor: '#7a64d9',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  modalCloseText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

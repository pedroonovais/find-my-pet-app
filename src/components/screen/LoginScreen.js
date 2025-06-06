import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
  KeyboardAvoidingView,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../api/api'; // usa seu axiosInstance

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const validateEmail = (email) => /^\S+@\S+\.\S+$/.test(email);
  const validateSenha = (senha) => senha.length >= 6;

  const handleLogin = async () => {
    if (!validateEmail(email)) {
      Alert.alert('Email inválido', 'Por favor, insira um endereço de email válido.');
      return;
    }

    if (!validateSenha(senha)) {
      Alert.alert('Senha inválida', 'A senha deve conter no mínimo 6 caracteres.');
      return;
    }

    try {
      const response = await api.post('/auth/login', {
        email,
        password: senha,
      });

      const { accessToken, refreshToken } = response.data;

      await AsyncStorage.setItem('accessToken', accessToken);
      await AsyncStorage.setItem('refreshToken', refreshToken);

      navigation.replace('Home', { email });
    } catch (error) {
      console.error('Erro no login:', error);
      Alert.alert('Erro no login', 'Email ou senha incorretos. Verifique suas credenciais.');
    }
  };

  return (
    <ImageBackground
      source={require('../../../assets/image.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#fff" style={styles.iconShadow} />
          <Text style={[styles.backText, styles.iconShadow]}>Voltar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.faleConoscoButtonTop}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="help-circle-outline" size={20} color="#fff" style={styles.iconShadow} />
          <Text style={[styles.faleConoscoText, styles.iconShadow]}>Ajuda</Text>
        </TouchableOpacity>

        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.content}>
            <Image source={require('../../../assets/logo.png')} style={styles.logo} />
            <Text style={styles.title}>Login</Text>

            <Text style={styles.label}>Email</Text>
            <TextInput
              placeholder="Digite seu email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              placeholderTextColor="#999"
            />

            <Text style={styles.label}>Senha</Text>
            <TextInput
              placeholder="Digite sua senha"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
              style={styles.input}
              placeholderTextColor="#999"
            />

            <TouchableOpacity style={styles.button} onPress={handleLogin} activeOpacity={0.8}>
              <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <Modal
          animationType="fade"
          transparent
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalBeautifulContainer}>
              <Text style={styles.modalBeautifulTitle}>Precisa de ajuda?</Text>
              <Text style={styles.modalBeautifulMessage}>
                Se estiver com dificuldades no login, entre em contato com nosso suporte:
              </Text>
              <Text style={styles.modalBeautifulEmail}>suporte@findmypet.com</Text>

              <TouchableOpacity
                style={styles.modalBeautifulCloseButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalBeautifulCloseText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: {
    flexGrow: 1,
    paddingHorizontal: 30,
    paddingTop: 100,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7a64d9',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 25,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 10,
  },
  backText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 6,
    fontWeight: '600',
  },
  iconShadow: {
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  faleConoscoButtonTop: {
    position: 'absolute',
    top: 40,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7a64d9',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 25,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 10,
  },
  faleConoscoText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 6,
  },
  content: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 30,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#fff2',
    alignItems: 'center',
  },
  logo: {
    width: 160,
    height: 160,
    resizeMode: 'contain',
    marginBottom: 25,
  },
  title: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
  },
  label: {
    alignSelf: 'flex-start',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === 'ios' ? 15 : 10,
    fontSize: 16,
    color: '#000',
    borderWidth: 1,
    borderColor: '#bbb',
  },
  button: {
    marginTop: 25,
    backgroundColor: '#7a64d9',
    borderRadius: 15,
    paddingVertical: 15,
    width: '100%',
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBeautifulContainer: {
    width: '85%',
    backgroundColor: '#f2f5f7',
    borderRadius: 25,
    padding: 25,
    alignItems: 'center',
    elevation: 6,
  },
  modalBeautifulTitle: {
    fontWeight: 'bold',
    fontSize: 26,
    color: '#8a2be2',
    marginBottom: 12,
  },
  modalBeautifulMessage: {
    fontSize: 17,
    color: '#000',
    marginBottom: 18,
    textAlign: 'center',
  },
  modalBeautifulEmail: {
    fontSize: 18,
    color: '#8a2be2',
    marginBottom: 25,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  modalBeautifulCloseButton: {
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    minWidth: 120,
    elevation: 2,
  },
  modalBeautifulCloseText: {
    color: '#7a64d9',
    fontWeight: 'bold',
    fontSize: 17,
    textAlign: 'center',
  },
});
